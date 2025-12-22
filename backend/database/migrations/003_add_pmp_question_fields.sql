-- Migration: 003_add_pmp_question_fields.sql
-- Add fields to match PMP Questions Complete CSV format

-- Add new columns to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS question_type VARCHAR(50) DEFAULT 'select_one',
ADD COLUMN IF NOT EXISTS domain VARCHAR(255),
ADD COLUMN IF NOT EXISTS task VARCHAR(255),
ADD COLUMN IF NOT EXISTS pm_approach VARCHAR(50);

-- Create index on question_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_question_id ON questions(question_id);

-- Create index on domain and task for filtering
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);
CREATE INDEX IF NOT EXISTS idx_questions_task ON questions(task);
CREATE INDEX IF NOT EXISTS idx_questions_pm_approach ON questions(pm_approach);

