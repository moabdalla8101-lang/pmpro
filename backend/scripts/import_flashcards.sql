-- Import flashcards from CSV
-- This script reads the CSV and inserts into flashcards table

-- First, create a temporary table to hold the CSV data
CREATE TEMP TABLE temp_flashcards (
    id INTEGER,
    front_face TEXT,
    back_face TEXT,
    knowledge_area TEXT
);

-- Copy data from CSV (skip header)
\copy temp_flashcards(id, front_face, back_face, knowledge_area) FROM 'PMP_Anki_Flashcards_Simple.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- Insert into flashcards table with UUIDs
INSERT INTO flashcards (id, front_face, back_face, knowledge_area, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    front_face,
    back_face,
    knowledge_area,
    NOW(),
    NOW()
FROM temp_flashcards
WHERE front_face IS NOT NULL AND back_face IS NOT NULL;

-- Drop temp table
DROP TABLE temp_flashcards;

-- Show count
SELECT COUNT(*) as total_flashcards FROM flashcards;
SELECT COUNT(DISTINCT knowledge_area) as knowledge_areas FROM flashcards WHERE knowledge_area IS NOT NULL;



