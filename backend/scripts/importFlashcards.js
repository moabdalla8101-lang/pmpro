const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Create database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pmp_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function importFlashcards() {
  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '..', '..', 'PMP_Anki_Flashcards_Simple.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const records = csv.parseSync(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} flashcards to import`);

    let imported = 0;
    let errors = 0;

    for (const record of records) {
      try {
        const id = uuidv4();
        const frontFace = record['Front Face'] ? record['Front Face'] : (record.front_face ? record.front_face : '');
        const backFace = record['Back Face'] ? record['Back Face'] : (record.back_face ? record.back_face : '');
        const knowledgeArea = record['Knowledge Area'] ? record['Knowledge Area'] : (record.knowledge_area ? record.knowledge_area : null);

        if (!frontFace || !backFace) {
          const recordId = record.ID ? record.ID : 'unknown';
          console.warn(`Skipping record ${recordId} - missing front or back face`);
          errors++;
          continue;
        }

        await pool.query(
          `INSERT INTO flashcards (id, front_face, back_face, knowledge_area, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [id, frontFace, backFace, knowledgeArea]
        );
        imported++;
      } catch (error) {
        const recordId = record.ID ? record.ID : 'unknown';
        const errorMsg = error && error.message ? error.message : String(error);
        console.error(`Error importing flashcard ${recordId}:`, errorMsg);
        errors++;
      }
    }

    console.log(`\nImport complete:`);
    console.log(`- Imported: ${imported}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Total: ${records.length}`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    await pool.end();
    process.exit(1);
  }
}

importFlashcards();

