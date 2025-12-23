-- Migration: 004_add_drag_and_match_metadata.sql
-- Add JSONB column to store drag_and_match question metadata (left_items, right_items, matches)

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_metadata JSONB;

-- Create index for faster queries on question_metadata
CREATE INDEX IF NOT EXISTS idx_questions_metadata ON questions USING GIN (question_metadata);

