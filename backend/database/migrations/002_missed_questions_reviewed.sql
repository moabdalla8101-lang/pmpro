-- Create table for tracking reviewed missed questions
CREATE TABLE IF NOT EXISTS missed_questions_reviewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  reviewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_missed_questions_reviewed_user ON missed_questions_reviewed(user_id);
CREATE INDEX IF NOT EXISTS idx_missed_questions_reviewed_question ON missed_questions_reviewed(question_id);



