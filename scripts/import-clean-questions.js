const fs = require('fs');
const path = require('path');

// Add backend/server/node_modules to module path
const serverNodeModules = path.join(__dirname, '../backend/server/node_modules');
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function(request, parent) {
  try {
    return originalResolveFilename.apply(this, arguments);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      try {
        return require.resolve(request, { paths: [serverNodeModules] });
      } catch (e) {
        throw err;
      }
    }
    throw err;
  }
};

const { parse } = require('csv-parse');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../backend/server/.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'pmp_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function importQuestions() {
  try {
    // Read CSV file from project root
    const csvPath = path.join(__dirname, '../PMP_Questions_Clean.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    console.log(`Reading CSV file: ${csvPath}`);
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = await new Promise((resolve, reject) => {
      parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true
      }, (err, records) => {
        if (err) reject(err);
        else resolve(records);
      });
    });

    console.log(`Found ${records.length} questions in CSV`);

    // Get PMP certification ID
    const certResult = await pool.query(
      "SELECT id FROM certifications WHERE type = 'pmp' LIMIT 1"
    );
    
    if (certResult.rows.length === 0) {
      throw new Error('PMP certification not found. Please run initial seed first.');
    }
    
    const pmpCertId = certResult.rows[0].id;
    console.log(`PMP Certification ID: ${pmpCertId}`);

    // Get first knowledge area (all questions belong to first knowledge area)
    const kaResult = await pool.query(
      `SELECT id FROM knowledge_areas 
       WHERE certification_id = $1 
       ORDER BY "order" ASC 
       LIMIT 1`,
      [pmpCertId]
    );

    if (kaResult.rows.length === 0) {
      throw new Error('No knowledge areas found. Please run initial seed first.');
    }

    const knowledgeAreaId = kaResult.rows[0].id;
    console.log(`Using Knowledge Area ID: ${knowledgeAreaId}`);

    // Start transaction
    await pool.query('BEGIN');

    // Delete all existing questions for this certification
    console.log('\nDeleting existing questions...');
    const deleteResult = await pool.query(
      'DELETE FROM questions WHERE certification_id = $1',
      [pmpCertId]
    );
    console.log(`Deleted ${deleteResult.rowCount} existing questions`);

    let imported = 0;
    let errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      try {
        const questionId = record['Question ID'] || `Q${i + 1}`;
        const questionType = record['Question Type'] || 'select_one';
        const questionText = record['Question Text'] || '';
        const explanation = record['Explanation'] || null;
        // Normalize domain: remove prefix (e.g., "1. People" -> "People", "3. Business Environment" -> "Business")
        let domain = record['Domain'] || null;
        if (domain) {
          // Remove prefix like "1. ", "2. ", "3. "
          domain = domain.replace(/^\d+\.\s*/, '').trim();
          // Map "Business Environment" to "Business"
          if (domain === 'Business Environment') {
            domain = 'Business';
          }
        }
        const task = record['Task'] || null;
        const pmApproach = record['PM Approach'] || null;

        // Parse options JSON
        let options = [];
        let parsedOptions = null;
        try {
          const optionsJson = record['Options (JSON)'] || '[]';
          parsedOptions = JSON.parse(optionsJson);
          
          if (questionType === 'drag_and_match') {
            // For drag_and_match, convert to a simple format
            const leftItems = parsedOptions.left_items || [];
            const rightItems = parsedOptions.right_items || [];
            
            // Create options from right items (these are the draggable items)
            options = rightItems.map((item, idx) => ({
              letter: String.fromCharCode(65 + idx),
              text: item
            }));
            
            // If no right items, try left items
            if (options.length === 0 && leftItems.length > 0) {
              options = leftItems.map((item, idx) => ({
                letter: String.fromCharCode(65 + idx),
                text: item
              }));
            }
          } else if (Array.isArray(parsedOptions)) {
            options = parsedOptions;
          } else {
            throw new Error('Options must be an array or drag_and_match format');
          }
        } catch (e) {
          throw new Error(`Invalid options JSON: ${e.message}`);
        }

        if (options.length === 0) {
          throw new Error('No options found');
        }

        // Parse correct options JSON
        let correctOptions = {};
        try {
          const correctJson = record['Correct Options (JSON)'] || '{}';
          correctOptions = JSON.parse(correctJson);
        } catch (e) {
          throw new Error(`Invalid correct options JSON: ${e.message}`);
        }

        // Determine correct answer(s)
        const correctAnswer = correctOptions.answer || correctOptions.answers || null;
        let correctAnswersArray = [];
        
        if (Array.isArray(correctAnswer)) {
          correctAnswersArray = correctAnswer;
        } else if (correctAnswer) {
          correctAnswersArray = [correctAnswer];
        }

        // Parse question images JSON
        let questionImages = null;
        try {
          const questionImagesJson = record['Question Images (JSON)'] || null;
          if (questionImagesJson && questionImagesJson.trim() !== '') {
            questionImages = JSON.parse(questionImagesJson);
          }
        } catch (e) {
          console.warn(`Warning: Invalid question images JSON for ${questionId}: ${e.message}`);
          questionImages = null;
        }

        // Parse explanation images JSON
        let explanationImages = null;
        try {
          const explanationImagesJson = record['Explanation Images (JSON)'] || null;
          if (explanationImagesJson && explanationImagesJson.trim() !== '') {
            explanationImages = JSON.parse(explanationImagesJson);
          }
        } catch (e) {
          console.warn(`Warning: Invalid explanation images JSON for ${questionId}: ${e.message}`);
          explanationImages = null;
        }

        // Prepare question metadata for drag_and_match questions
        let questionMetadata = null;
        if (questionType === 'drag_and_match' && parsedOptions) {
          const leftItems = parsedOptions.left_items || [];
          const rightItems = parsedOptions.right_items || [];
          const matches = correctOptions.matches || {};
          
          questionMetadata = {
            leftItems,
            rightItems,
            matches
          };
        }

        // Insert or update question (handle duplicates)
        const questionResult = await pool.query(
          `INSERT INTO questions (
            question_id, certification_id, knowledge_area_id, 
            question_text, explanation, difficulty, 
            question_type, domain, task, pm_approach, 
            question_metadata, question_images, explanation_images, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, NOW(), NOW())
          ON CONFLICT (question_id) DO UPDATE SET
            question_text = EXCLUDED.question_text,
            explanation = EXCLUDED.explanation,
            difficulty = EXCLUDED.difficulty,
            question_type = EXCLUDED.question_type,
            domain = EXCLUDED.domain,
            task = EXCLUDED.task,
            pm_approach = EXCLUDED.pm_approach,
            question_metadata = EXCLUDED.question_metadata,
            question_images = EXCLUDED.question_images,
            explanation_images = EXCLUDED.explanation_images,
            updated_at = NOW()
          RETURNING id`,
          [
            questionId,
            pmpCertId,
            knowledgeAreaId,
            questionText,
            explanation || null,
            'medium', // Default difficulty
            questionType,
            domain || null,
            task || null,
            pmApproach || null,
            questionMetadata ? JSON.stringify(questionMetadata) : null,
            questionImages ? JSON.stringify(questionImages) : null,
            explanationImages ? JSON.stringify(explanationImages) : null
          ]
        );

        const dbQuestionId = questionResult.rows[0].id;
        
        // Delete existing answers for this question before inserting new ones
        await pool.query('DELETE FROM answers WHERE question_id = $1', [dbQuestionId]);

        // Insert answers
        for (let j = 0; j < options.length; j++) {
          const option = options[j];
          const answerLetter = option.letter || String.fromCharCode(65 + j); // A, B, C, D
          const answerText = option.text || '';
          
          // Check if this answer is correct
          const isCorrect = correctAnswersArray.includes(answerLetter) || 
                           correctAnswersArray.includes(option.letter) ||
                           (correctAnswersArray.length === 0 && j === 0); // Fallback to first if no correct answer specified

          await pool.query(
            `INSERT INTO answers (question_id, answer_text, is_correct, "order", created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [dbQuestionId, answerText, isCorrect, j]
          );
        }

        imported++;
        if (imported % 10 === 0) {
          process.stdout.write(`\rImported ${imported}/${records.length} questions...`);
        }
      } catch (error) {
        errors.push({
          questionId: record['Question ID'] || `Row ${i + 1}`,
          error: error.message
        });
        console.error(`\nError importing ${record['Question ID'] || `Row ${i + 1}`}:`, error.message);
      }
    }

    // Commit transaction
    await pool.query('COMMIT');

    console.log(`\n\n✅ Import complete!`);
    console.log(`   Imported: ${imported} questions`);
    console.log(`   Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.questionId}: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importQuestions();

