-- Authoritative exam question assignments, attempt linking, and semantic backfill.
-- Safe to run after either the original or amended 007_question_attempts.sql.

CREATE TABLE IF NOT EXISTS question_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    selected_answer_ids UUID[] NOT NULL DEFAULT '{}',
    response_json JSONB,
    answered_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE question_attempts
  ADD COLUMN IF NOT EXISTS exam_id UUID;

-- Prefer CASCADE so deleting an exam removes its attempt rows.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'question_attempts'
      AND constraint_name = 'question_attempts_exam_id_fkey'
  ) THEN
    ALTER TABLE question_attempts DROP CONSTRAINT question_attempts_exam_id_fkey;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

ALTER TABLE question_attempts
  DROP CONSTRAINT IF EXISTS question_attempts_exam_id_fkey;

ALTER TABLE question_attempts
  ADD CONSTRAINT question_attempts_exam_id_fkey
  FOREIGN KEY (exam_id) REFERENCES mock_exams(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_exam_question
  ON question_attempts(exam_id, question_id)
  WHERE exam_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_question_attempts_exam
  ON question_attempts(exam_id)
  WHERE exam_id IS NOT NULL;

-- Immutable exam question set (order preserved).
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    UNIQUE (exam_id, question_id),
    UNIQUE (exam_id, position)
);

CREATE INDEX IF NOT EXISTS idx_exam_questions_exam
  ON exam_questions(exam_id, position);

-- Semantic backfill: one attempt per legacy user_answers row when not already present
-- by (user, question, answered_at, selected answer membership).
INSERT INTO question_attempts (
  id,
  user_id,
  question_id,
  is_correct,
  selected_answer_ids,
  response_json,
  answered_at,
  exam_id
)
SELECT
  ua.id,
  ua.user_id,
  ua.question_id,
  ua.is_correct,
  ARRAY[ua.answer_id]::uuid[],
  jsonb_build_object(
    'selectedAnswerIds', jsonb_build_array(ua.answer_id),
    'legacyUserAnswerId', ua.id,
    'legacy', true
  ),
  ua.answered_at,
  NULL
FROM user_answers ua
WHERE NOT EXISTS (
  SELECT 1
  FROM question_attempts qa
  WHERE qa.user_id = ua.user_id
    AND qa.question_id = ua.question_id
    AND qa.answered_at = ua.answered_at
    AND (
      ua.answer_id = ANY (qa.selected_answer_ids)
      OR (qa.response_json->>'legacyUserAnswerId') = ua.id::text
      OR qa.id = ua.id
    )
)
ON CONFLICT (id) DO NOTHING;
