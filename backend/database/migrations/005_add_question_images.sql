-- Migration: 005_add_question_images.sql
-- Add columns for question images and explanation images

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_images JSONB,
ADD COLUMN IF NOT EXISTS explanation_images JSONB;

-- Create index for faster queries on image fields
CREATE INDEX IF NOT EXISTS idx_questions_question_images ON questions USING GIN (question_images);
CREATE INDEX IF NOT EXISTS idx_questions_explanation_images ON questions USING GIN (explanation_images);

