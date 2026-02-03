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
 * Map question_type from JSON to database format
 */
function mapQuestionType(questionType) {
  if (!questionType) return 'select_one';
  
  const type = questionType.toLowerCase().trim();
  
  if (type === 'multiple_choice') {
    return 'select_one';
  } else if (type === 'drag_drop' || type === 'drag_and_match') {
    return 'drag_and_match';
  }
  
  return 'select_one';
}

async function main() {
  const jsonPath = '/Users/mohamed/Downloads/pmp/pmp_extractions/extraction_20260120_222757/extracted_questions.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`);
    process.exit(1);
  }

  console.log('📖 Reading JSON file...');
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const questions = JSON.parse(jsonContent);

  console.log(`📊 Found ${questions.length} questions in JSON`);

  // Count questions with images
  const questionsWithImages = questions.filter(q => {
    const images = q.extracted_data?.images || q.images;
    return images && Array.isArray(images) && images.length > 0;
  });
  
  console.log(`🖼️  Questions with images: ${questionsWithImages.length}`);

  // Filter out invalid questions - handle both formats (extracted_data or direct)
  const validQuestions = questions.filter(q => {
    const questionText = q.extracted_data?.question_text || q.question_text;
    return questionText && questionText.trim() !== '';
  });

  console.log(`✅ ${validQuestions.length} valid questions after filtering`);

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

  // Get Integration Management knowledge area ID
  const kaResult = await pool.query(
    "SELECT id FROM knowledge_areas WHERE name = 'Project Integration Management' LIMIT 1"
  );
  
  if (kaResult.rows.length === 0) {
    console.error('Error: Project Integration Management knowledge area not found in database');
    process.exit(1);
  }
  
  const integrationKnowledgeAreaId = kaResult.rows[0].id;
  console.log(`✅ Found Integration Management knowledge area ID: ${integrationKnowledgeAreaId}`);

  // Start transaction
  await pool.query('BEGIN');

  let imported = 0;
  let updated = 0;
  const errors = [];
  const skipped = [];

  console.log('\n🔄 Processing questions...\n');

  for (let i = 0; i < validQuestions.length; i++) {
    const q = validQuestions[i];
    // Handle both formats: extracted_data or direct properties
    const data = q.extracted_data || q;
    
    try {
      // Generate question ID
      const questionId = `INTEGRATION-${q.number || i + 1}`;
      
      const questionText = data.question_text || '';
      if (!questionText || questionText.trim() === '') {
        throw new Error('Question text is required');
      }

      // Check if question already exists by exact question text match
      const duplicateCheck = await pool.query(
        'SELECT id, question_id FROM questions WHERE question_text = $1 LIMIT 1',
        [questionText.trim()]
      );

      if (duplicateCheck.rows.length > 0) {
        // Skip duplicate - already exists in database
        errors.push({
          questionNumber: q.number || i + 1,
          questionId: `INTEGRATION-${q.number || i + 1}`,
          issues: [`Duplicate: Question already exists (ID: ${duplicateCheck.rows[0].question_id})`],
          questionText: questionText.substring(0, 100) + '...'
        });
        continue; // Skip this question
      }

      // Get question type
      const questionType = mapQuestionType(data.question_type || 'multiple_choice');
      
      // Parse options
      let options = [];
      if (data.options && Array.isArray(data.options)) {
        options = data.options.map((opt, idx) => ({
          letter: opt.letter || String.fromCharCode(65 + idx),
          text: opt.text || ''
        }));
      }

      // Get drag_drop_pairs for drag-and-drop questions
      const dragDropPairs = data.drag_drop_pairs || [];
      
      // Get correct answer - handle both string and object formats
      let correctAnswer = '';
      if (typeof data.correct_answer === 'string') {
        correctAnswer = data.correct_answer.trim().toUpperCase();
      } else if (data.correct_answer && Array.isArray(data.correct_answer)) {
        // For drag-and-drop, correct_answer might be an array of pairs
        correctAnswer = 'DRAG_DROP'; // Placeholder
      }
      
      // Validate question before processing
      const issues = [];
      if (questionType !== 'drag_and_match' && options.length === 0) {
        issues.push('No options found');
      }
      if (questionType === 'drag_and_match' && dragDropPairs.length === 0 && options.length === 0) {
        issues.push('No drag_drop_pairs or options found for drag-and-drop question');
      }
      if (!correctAnswer && questionType !== 'drag_and_match') {
        issues.push('No correct answer specified');
      }
      
      // Skip questions with issues - just report them
      if (issues.length > 0) {
        skipped.push({
          questionNumber: q.number || i + 1,
          questionId: questionId,
          issues: issues,
          questionText: questionText.substring(0, 100) + '...'
        });
        continue; // Skip this question
      }

      // Normalize fields
      const normalizedDomain = normalizeDomain(data.domain);
      const normalizedTask = normalizeTask(data.task);
      const normalizedPMApproach = normalizePMApproach(data.approach);

      // Parse images
      const questionImages = data.images || [];
      const explanationImages = []; // No separate explanation images in this JSON structure

      // Prepare question metadata for drag_and_match questions
      let questionMetadata = null;
      if (questionType === 'drag_and_match') {
        // Extract left and right items from drag_drop_pairs
        const leftItems = dragDropPairs.map(pair => pair.left_item || pair.left).filter(Boolean);
        const rightItems = dragDropPairs.map(pair => pair.right_item || pair.right).filter(Boolean);
        
        // Create matches object from correct_answer if available
        let matches = {};
        if (data.correct_answer && Array.isArray(data.correct_answer)) {
          data.correct_answer.forEach(pair => {
            if (pair.left && pair.right) {
              matches[pair.left] = pair.right;
            }
          });
        } else if (dragDropPairs.length > 0) {
          // Create matches from drag_drop_pairs
          dragDropPairs.forEach(pair => {
            if (pair.correct_match && pair.left_item && pair.right_item) {
              matches[pair.left_item] = pair.right_item;
            }
          });
        }
        
        questionMetadata = {
          leftItems: leftItems,
          rightItems: rightItems,
          matches: matches,
          dragDropPairs: dragDropPairs
        };
        
        // If we don't have options but have drag_drop_pairs, create options from right items
        if (options.length === 0 && rightItems.length > 0) {
          options = rightItems.map((item, idx) => ({
            letter: String.fromCharCode(65 + idx),
            text: item
          }));
        }
      }

      // Check if question already exists by question_id (shouldn't happen since we check by text, but just in case)
      const existingQuestion = await pool.query(
        'SELECT id FROM questions WHERE question_id = $1',
        [questionId]
      );

      let dbQuestionId;

      if (existingQuestion.rows.length > 0) {
        // Skip if question_id already exists (don't update, just skip)
        errors.push({
          questionNumber: q.number || i + 1,
          questionId: questionId,
          issues: [`Duplicate: Question ID already exists`],
          questionText: questionText.substring(0, 100) + '...'
        });
        continue; // Skip this question
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
            integrationKnowledgeAreaId,
            questionText,
            data.explanation || null,
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
          const answerLetter = option.letter || String.fromCharCode(65 + j);
          const answerText = option.text || '';
          
          // Check if this answer is correct
          const isCorrect = correctAnswer === answerLetter;

          await pool.query(
            `INSERT INTO answers (question_id, answer_text, is_correct, "order", created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [dbQuestionId, answerText, isCorrect, j]
          );
        }
      }

      if (imported % 10 === 0 && imported > 0) {
        process.stdout.write(`\rProcessed ${imported} new questions imported...`);
      }
    } catch (error) {
      errors.push({
        questionNumber: q.number || i + 1,
        questionId: questionId || `UNKNOWN-${i + 1}`,
        issues: [error.message],
        questionText: data?.question_text?.substring(0, 100) + '...' || 'N/A'
      });
      // Don't log here - we'll report all issues at the end
    }
  }

  // Commit transaction
  await pool.query('COMMIT');

  console.log(`\n\n✅ Import complete!`);
  console.log(`   New questions imported: ${imported}`);
  console.log(`   Questions with images: ${questionsWithImages.length}`);
  console.log(`   Duplicates skipped: ${errors.filter(e => e.issues && e.issues[0] && e.issues[0].includes('Duplicate')).length}`);
  console.log(`   Questions skipped (missing data): ${skipped.length}`);
  
  // Show normalization summary
  const domainStats = await pool.query(
    `SELECT domain, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND domain IS NOT NULL
     GROUP BY domain
     ORDER BY count DESC`,
    [integrationKnowledgeAreaId]
  );
  
  const taskStats = await pool.query(
    `SELECT task, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND task IS NOT NULL
     GROUP BY task
     ORDER BY count DESC
     LIMIT 10`,
    [integrationKnowledgeAreaId]
  );
  
  const pmApproachStats = await pool.query(
    `SELECT pm_approach, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND pm_approach IS NOT NULL
     GROUP BY pm_approach
     ORDER BY count DESC`,
    [integrationKnowledgeAreaId]
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
    console.log('\n❌ Duplicate questions (already in database):');
    errors.forEach(err => {
      console.log(`\n   Question ${err.questionNumber} (${err.questionId}):`);
      if (Array.isArray(err.issues)) {
        err.issues.forEach(issue => {
          console.log(`      - ${issue}`);
        });
      } else {
        console.log(`      - ${err.issues || err.error || 'Unknown issue'}`);
      }
      console.log(`      Preview: ${err.questionText}`);
    });
  }

  if (skipped.length > 0) {
    console.log('\n⚠️  Questions skipped (missing required data):');
    skipped.forEach(skip => {
      console.log(`\n   Question ${skip.questionNumber} (${skip.questionId}):`);
      if (Array.isArray(skip.issues)) {
        skip.issues.forEach(issue => {
          console.log(`      - ${issue}`);
        });
      } else {
        console.log(`      - ${skip.issues || 'Unknown issue'}`);
      }
      console.log(`      Preview: ${skip.questionText}`);
    });
  }

  await pool.end();
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
