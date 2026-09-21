-- Question attempts: one row per learner submission (not per selected option).
-- Progress/analytics should aggregate from this table once writers + backfill are in place.

CREATE TABLE IF NOT EXISTS question_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    selected_answer_ids UUID[] NOT NULL DEFAULT '{}',
    response_json JSONB,
    answered_at TIMESTAMP NOT NULL DEFAULT NOW(),
    exam_id UUID REFERENCES mock_exams(id) ON DELETE SET NULL
);

-- Upgrade path for environments that already applied an earlier 007 without exam_id
ALTER TABLE question_attempts
  ADD COLUMN IF NOT EXISTS exam_id UUID REFERENCES mock_exams(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_question_attempts_user
  ON question_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_question_attempts_user_question
  ON question_attempts(user_id, question_id);

CREATE INDEX IF NOT EXISTS idx_question_attempts_answered_at
  ON question_attempts(user_id, answered_at DESC);

CREATE INDEX IF NOT EXISTS idx_question_attempts_exam
  ON question_attempts(exam_id)
  WHERE exam_id IS NOT NULL;

-- Backfill recoverable history from user_answers (1:1).
-- Reuses user_answers.id as the attempt id for idempotent re-runs.
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
  SELECT 1 FROM question_attempts qa WHERE qa.id = ua.id
)
ON CONFLICT (id) DO NOTHING;
