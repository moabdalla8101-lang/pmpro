-- Migration: 006_add_exam_type.sql
-- Add exam_type column to mock_exams table to distinguish between mock exams and daily quizzes

ALTER TABLE mock_exams
ADD COLUMN IF NOT EXISTS exam_type VARCHAR(50) DEFAULT 'mock_exam';

-- Update existing records to have exam_type = 'mock_exam'
UPDATE mock_exams SET exam_type = 'mock_exam' WHERE exam_type IS NULL;

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_mock_exams_exam_type ON mock_exams(exam_type);
CREATE INDEX IF NOT EXISTS idx_mock_exams_user_type_date ON mock_exams(user_id, exam_type, started_at);

