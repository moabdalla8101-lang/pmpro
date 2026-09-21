-- Idempotent practice/exam attempt retries (network replay safety).

ALTER TABLE question_attempts
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_user_idempotency
  ON question_attempts (user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- Harden exam attempt uniqueness (concurrent submit safety).
CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_exam_question
  ON question_attempts (exam_id, question_id)
  WHERE exam_id IS NOT NULL;
