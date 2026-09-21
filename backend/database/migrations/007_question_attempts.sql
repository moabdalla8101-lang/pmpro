-- Question attempts: one row per learner submission (not per selected option).
-- Progress/analytics should aggregate from this table.

CREATE TABLE IF NOT EXISTS question_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    selected_answer_ids UUID[] NOT NULL DEFAULT '{}',
    response_json JSONB,
    answered_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_question_attempts_user
  ON question_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_question_attempts_user_question
  ON question_attempts(user_id, question_id);

CREATE INDEX IF NOT EXISTS idx_question_attempts_answered_at
  ON question_attempts(user_id, answered_at DESC);
