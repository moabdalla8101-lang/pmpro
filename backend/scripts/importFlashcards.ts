import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { pool } from '../server/src/db/connection';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

async function importFlashcards() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), '..', 'PMP_Anki_Flashcards_Simple.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} flashcards to import`);

    // Clear existing flashcards (optional - comment out if you want to keep existing)
    // await pool.query('DELETE FROM user_flashcard_progress');
    // await pool.query('DELETE FROM flashcards');

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
      } catch (error: any) {
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
