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

/**
 * Normalize Domain field
 * Examples: "2. Process" -> "Process", "1. People" -> "People", "3. Business Environment" -> "Business"
 */
function normalizeDomain(domain) {
  if (!domain) return null;
  
  // Remove leading numbers and dots, trim whitespace
  let normalized = domain.trim();
  
  // Remove pattern like "1. ", "2. ", "3. " at the start
  normalized = normalized.replace(/^\d+\.\s*/, '');
  
  // Map to standard domain names
  if (normalized.toLowerCase().includes('people')) {
    return 'People';
  } else if (normalized.toLowerCase().includes('process')) {
    return 'Process';
  } else if (normalized.toLowerCase().includes('business')) {
    return 'Business';
  }
  
  return normalized;
}

/**
 * Normalize Task field
 * Examples: "2.13 Determine appropriate project methodology/methods and practices" -> "2.13 Determine appropriate project methodology/methods and practices"
 * Keep the full task description as it's already in a standard format
 */
function normalizeTask(task) {
  if (!task) return null;
  return task.trim();
}

/**
 * Normalize PM Approach field
 * Examples: "Agile / Hybrid" -> "Agile / Hybrid", "Predictive" -> "Predictive"
 * Standardize variations
 */
function normalizePMApproach(pmApproach) {
  if (!pmApproach) return null;
  
  const normalized = pmApproach.trim();
  
  // Standardize variations
  if (normalized.toLowerCase().includes('agile') && normalized.toLowerCase().includes('hybrid')) {
    return 'Agile / Hybrid';
  } else if (normalized.toLowerCase().includes('predictive')) {
    return 'Predictive';
  } else if (normalized.toLowerCase().includes('agile')) {
    return 'Agile';
  }
  
  return normalized;
}

/**
 * Parse images JSON array
 * Handles both empty arrays and arrays with image objects
 */
function parseImages(imagesJson) {
  if (!imagesJson || imagesJson.trim() === '' || imagesJson.trim() === '[]') {
    return [];
  }
  
  try {
    const parsed = JSON.parse(imagesJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.warn(`Warning: Could not parse images JSON: ${imagesJson}`);
    return [];
  }
}

async function main() {
  const csvPath = path.join(__dirname, '../Communication_Management_Questions.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  console.log('📖 Reading CSV file...');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parse CSV
  const records = await new Promise((resolve, reject) => {
    parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  console.log(`📊 Found ${records.length} records in CSV`);

  // Filter out empty rows
  const validRecords = records.filter(record => {
    const questionText = record['Question Text'] || record['Question ID'];
    return questionText && questionText.trim() !== '';
  });

  console.log(`✅ ${validRecords.length} valid records after filtering`);

  // Get PMP certification ID
  const certResult = await pool.query(
    "SELECT id FROM certifications WHERE type = 'pmp' LIMIT 1"
  );
  
  if (certResult.rows.length === 0) {
    console.error('Error: PMP certification not found in database');
    process.exit(1);
  }
  
  const pmpCertId = certResult.rows[0].id;
  console.log(`✅ Found PMP certification ID: ${pmpCertId}`);

  // Get Communication Management knowledge area ID
  const kaResult = await pool.query(
    "SELECT id FROM knowledge_areas WHERE name = 'Project Communications Management' LIMIT 1"
  );
  
  if (kaResult.rows.length === 0) {
    console.error('Error: Project Communications Management knowledge area not found in database');
    process.exit(1);
  }
  
  const communicationKnowledgeAreaId = kaResult.rows[0].id;
  console.log(`✅ Found Communication Management knowledge area ID: ${communicationKnowledgeAreaId}`);

  // Start transaction
  await pool.query('BEGIN');

  let imported = 0;
  let updated = 0;
  const errors = [];

  console.log('\n🔄 Processing questions...\n');

  for (let i = 0; i < validRecords.length; i++) {
    const record = validRecords[i];
    
    try {
      // Get question ID - use "Question ID" column, fallback to "ID" column
      const questionId = record['Question ID'] || record['ID'] || `COMM-${i + 1}`;
      
      if (!questionId || questionId.trim() === '') {
        throw new Error('Question ID is required');
      }

      // Get question type
      const questionType = (record['Question Type'] || 'select_one').toLowerCase().trim();
      
      if (!['select_one', 'select_multiple', 'drag_and_match'].includes(questionType)) {
        throw new Error(`Unknown question type: ${questionType}`);
      }

      // Parse options JSON
      let options = [];
      try {
        const optionsJson = record['Options (JSON)'] || '[]';
        const parsedOptions = JSON.parse(optionsJson);
        
        // Handle different question types
        if (questionType === 'drag_and_match') {
          // For drag_and_match, we need to handle left and right items
          const leftItems = parsedOptions.left || parsedOptions.left_items || [];
          const rightItems = parsedOptions.right || parsedOptions.right_items || [];
          
          // For drag_and_match, we'll create options from the right items (targets)
          // The left items will be stored in metadata
          options = rightItems.map((item, idx) => {
            // Handle both object format {index: 1, text: "..."} and string format
            if (typeof item === 'object' && item.text) {
              return {
                letter: String.fromCharCode(65 + idx),
                text: item.text,
                index: item.index || idx + 1
              };
            } else if (typeof item === 'string') {
              return {
                letter: String.fromCharCode(65 + idx),
                text: item,
                index: idx + 1
              };
            } else {
              return {
                letter: String.fromCharCode(65 + idx),
                text: String(item),
                index: idx + 1
              };
            }
          });
          
          // If no right items, use left items as fallback
          if (options.length === 0 && leftItems.length > 0) {
            options = leftItems.map((item, idx) => {
              if (typeof item === 'object' && item.text) {
                return {
                  letter: item.letter || String.fromCharCode(65 + idx),
                  text: item.text
                };
              } else if (typeof item === 'string') {
                return {
                  letter: String.fromCharCode(65 + idx),
                  text: item
                };
              } else {
                return {
                  letter: String.fromCharCode(65 + idx),
                  text: String(item)
                };
              }
            });
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

      // Determine correct answer(s) - handle both single and multiple choice
      let correctAnswersArray = [];
      
      // Check for multiple choice (answers array) or single choice (answer string)
      if (correctOptions.answers && Array.isArray(correctOptions.answers)) {
        // Multi-choice question
        correctAnswersArray = correctOptions.answers;
      } else if (correctOptions.answer) {
        // Single choice question
        if (Array.isArray(correctOptions.answer)) {
          correctAnswersArray = correctOptions.answer;
        } else {
          correctAnswersArray = [correctOptions.answer];
        }
      }

      // Normalize fields
      const normalizedDomain = normalizeDomain(record['Domain']);
      const normalizedTask = normalizeTask(record['Task']);
      const normalizedPMApproach = normalizePMApproach(record['PM Approach']);

      // Parse images
      const questionImagesJson = record['Question Images (JSON)'] || '[]';
      const explanationImagesJson = record['Explanation Images (JSON)'] || '[]';
      const questionImages = parseImages(questionImagesJson);
      const explanationImages = parseImages(explanationImagesJson);

      // Prepare question metadata for drag_and_match questions
      let questionMetadata = null;
      if (questionType === 'drag_and_match') {
        const parsedOptions = JSON.parse(record['Options (JSON)'] || '[]');
        const leftItems = parsedOptions.left || parsedOptions.left_items || [];
        const rightItems = parsedOptions.right || parsedOptions.right_items || [];
        const matches = correctOptions.matches || {};
        
        questionMetadata = {
          leftItems,
          rightItems,
          matches
        };
      }

      // Check if question already exists by question_id
      const existingQuestion = await pool.query(
        'SELECT id FROM questions WHERE question_id = $1',
        [questionId]
      );

      let dbQuestionId;

      if (existingQuestion.rows.length > 0) {
        // Update existing question
        dbQuestionId = existingQuestion.rows[0].id;
        
        await pool.query(
          `UPDATE questions 
           SET question_text = $1,
               explanation = $2,
               difficulty = $3,
               question_type = $4,
               domain = $5,
               task = $6,
               pm_approach = $7,
               question_metadata = $8,
               question_images = $9,
               explanation_images = $10,
               updated_at = NOW()
           WHERE id = $11`,
          [
            record['Question Text'] || '',
            record['Explanation'] || null,
            'medium', // Default difficulty
            questionType,
            normalizedDomain,
            normalizedTask,
            normalizedPMApproach,
            questionMetadata ? JSON.stringify(questionMetadata) : null,
            questionImages.length > 0 ? JSON.stringify(questionImages) : null,
            explanationImages.length > 0 ? JSON.stringify(explanationImages) : null,
            dbQuestionId
          ]
        );

        // Delete existing answers and recreate
        await pool.query('DELETE FROM answers WHERE question_id = $1', [dbQuestionId]);
        updated++;
      } else {
        // Insert new question
        const questionResult = await pool.query(
          `INSERT INTO questions (
            question_id, certification_id, knowledge_area_id, 
            question_text, explanation, difficulty, 
            question_type, domain, task, pm_approach, question_metadata, 
            question_images, explanation_images, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true)
          RETURNING id`,
          [
            questionId,
            pmpCertId,
            communicationKnowledgeAreaId,
            record['Question Text'] || '',
            record['Explanation'] || null,
            'medium', // Default difficulty
            questionType,
            normalizedDomain,
            normalizedTask,
            normalizedPMApproach,
            questionMetadata ? JSON.stringify(questionMetadata) : null,
            questionImages.length > 0 ? JSON.stringify(questionImages) : null,
            explanationImages.length > 0 ? JSON.stringify(explanationImages) : null
          ]
        );

        dbQuestionId = questionResult.rows[0].id;
        imported++;
      }

      // For drag_and_match questions, we don't insert answers in the traditional way
      // Instead, the matching logic is stored in question_metadata
      // But we still need to insert the right items as answers for display purposes
      if (questionType === 'drag_and_match') {
        // Insert right items as answers (these are the target options)
        for (let j = 0; j < options.length; j++) {
          const option = options[j];
          const answerText = option.text || '';
          
          // For drag_and_match, answers are not marked as correct/incorrect
          // The correctness is determined by the matches in metadata
          await pool.query(
            `INSERT INTO answers (question_id, answer_text, is_correct, "order", created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [dbQuestionId, answerText, false, j]
          );
        }
      } else {
        // Insert answers for select_one and select_multiple
        for (let j = 0; j < options.length; j++) {
          const option = options[j];
          const answerLetter = option.letter || String.fromCharCode(65 + j); // A, B, C, D, E, etc.
          const answerText = option.text || '';
          
          // Check if this answer is correct
          // For multi-choice, check if the letter is in the correctAnswersArray
          // For single choice, check if it matches the single answer
          const isCorrect = correctAnswersArray.includes(answerLetter) || 
                           correctAnswersArray.includes(option.letter) ||
                           (correctAnswersArray.length === 0 && j === 0); // Fallback to first if no correct answer specified

          await pool.query(
            `INSERT INTO answers (question_id, answer_text, is_correct, "order", created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [dbQuestionId, answerText, isCorrect, j]
          );
        }
      }

      if ((imported + updated) % 10 === 0) {
        process.stdout.write(`\rProcessed ${imported + updated}/${validRecords.length} questions... (${imported} new, ${updated} updated)`);
      }
    } catch (error) {
      errors.push({
        questionId: record['Question ID'] || record['ID'] || `ROW-${i + 1}`,
        error: error.message
      });
      console.error(`\nError processing question ${i + 1}:`, error.message);
    }
  }

  // Commit transaction
  await pool.query('COMMIT');

  console.log(`\n\n✅ Import complete!`);
  console.log(`   New questions imported: ${imported}`);
  console.log(`   Existing questions updated: ${updated}`);
  console.log(`   Total processed: ${imported + updated}`);
  console.log(`   Errors: ${errors.length}`);
  
  // Show normalization summary
  const domainStats = await pool.query(
    `SELECT domain, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND domain IS NOT NULL
     GROUP BY domain
     ORDER BY count DESC`,
    [communicationKnowledgeAreaId]
  );
  
  const taskStats = await pool.query(
    `SELECT task, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND task IS NOT NULL
     GROUP BY task
     ORDER BY count DESC
     LIMIT 10`,
    [communicationKnowledgeAreaId]
  );
  
  const pmApproachStats = await pool.query(
    `SELECT pm_approach, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND pm_approach IS NOT NULL
     GROUP BY pm_approach
     ORDER BY count DESC`,
    [communicationKnowledgeAreaId]
  );

  console.log('\n📊 Import Summary:');
  console.log('\n   Domains:');
  domainStats.rows.forEach(row => {
    console.log(`      ${row.domain}: ${row.count}`);
  });
  
  console.log('\n   Top Tasks:');
  taskStats.rows.forEach(row => {
    console.log(`      ${row.task}: ${row.count}`);
  });
  
  console.log('\n   PM Approaches:');
  pmApproachStats.rows.forEach(row => {
    console.log(`      ${row.pm_approach}: ${row.count}`);
  });

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(err => {
      console.log(`   Question ${err.questionId}: ${err.error}`);
    });
  }

  await pool.end();
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

