-- Mid-exam draft answers for resume, plus best-effort legacy assignment backfill.

ALTER TABLE mock_exams
  ADD COLUMN IF NOT EXISTS draft_answers JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Reconstruct exam_questions for completed exams that never received an assignment
-- when answers in the exam time window identify the set.
WITH legacy_exams AS (
  SELECT me.id AS exam_id, me.user_id, me.started_at, me.completed_at, me.total_questions
  FROM mock_exams me
  WHERE me.completed_at IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM exam_questions eq WHERE eq.exam_id = me.id)
),
windowed AS (
  SELECT
    le.exam_id,
    qa.question_id,
    MIN(qa.answered_at) AS first_answered_at,
    ROW_NUMBER() OVER (PARTITION BY le.exam_id ORDER BY MIN(qa.answered_at)) - 1 AS position
  FROM legacy_exams le
  JOIN question_attempts qa
    ON qa.user_id = le.user_id
   AND qa.exam_id IS NULL
   AND qa.answered_at >= le.started_at
   AND qa.answered_at <= le.completed_at
  GROUP BY le.exam_id, qa.question_id
),
eligible AS (
  SELECT w.exam_id
  FROM windowed w
  JOIN mock_exams me ON me.id = w.exam_id
  GROUP BY w.exam_id, me.total_questions
  HAVING COUNT(*) > 0 AND COUNT(*) <= me.total_questions
)
INSERT INTO exam_questions (id, exam_id, question_id, position)
SELECT uuid_generate_v4(), w.exam_id, w.question_id, w.position::int
FROM windowed w
JOIN eligible e ON e.exam_id = w.exam_id
ON CONFLICT (exam_id, question_id) DO NOTHING;

-- Attach unlinked attempts in the same window to the reconstructed exam.
UPDATE question_attempts qa
SET exam_id = me.id
FROM mock_exams me
WHERE qa.user_id = me.user_id
  AND qa.exam_id IS NULL
  AND me.completed_at IS NOT NULL
  AND qa.answered_at >= me.started_at
  AND qa.answered_at <= me.completed_at
  AND EXISTS (SELECT 1 FROM exam_questions eq WHERE eq.exam_id = me.id AND eq.question_id = qa.question_id)
  AND NOT EXISTS (
    SELECT 1 FROM question_attempts qa2
    WHERE qa2.exam_id = me.id AND qa2.question_id = qa.question_id
  );

-- Fallback: user_answers window → exam_questions when attempts were never created.
WITH legacy_exams AS (
  SELECT me.id AS exam_id, me.user_id, me.started_at, me.completed_at, me.total_questions
  FROM mock_exams me
  WHERE me.completed_at IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM exam_questions eq WHERE eq.exam_id = me.id)
),
windowed AS (
  SELECT
    le.exam_id,
    ua.question_id,
    MIN(ua.answered_at) AS first_answered_at,
    ROW_NUMBER() OVER (PARTITION BY le.exam_id ORDER BY MIN(ua.answered_at)) - 1 AS position
  FROM legacy_exams le
  JOIN user_answers ua
    ON ua.user_id = le.user_id
   AND ua.answered_at >= le.started_at
   AND ua.answered_at <= le.completed_at
  GROUP BY le.exam_id, ua.question_id
),
eligible AS (
  SELECT w.exam_id
  FROM windowed w
  JOIN mock_exams me ON me.id = w.exam_id
  GROUP BY w.exam_id, me.total_questions
  HAVING COUNT(*) > 0 AND COUNT(*) <= GREATEST(me.total_questions, 1)
)
INSERT INTO exam_questions (id, exam_id, question_id, position)
SELECT uuid_generate_v4(), w.exam_id, w.question_id, w.position::int
FROM windowed w
JOIN eligible e ON e.exam_id = w.exam_id
ON CONFLICT (exam_id, question_id) DO NOTHING;
