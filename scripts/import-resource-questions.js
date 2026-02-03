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
  const jsonPath = '/Users/mohamed/Downloads/pmp/pmp_extractions/extraction_20260116_184356_resourses/extracted_questions.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`);
    process.exit(1);
  }

  console.log('📖 Reading JSON file...');
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const questions = JSON.parse(jsonContent);

  console.log(`📊 Found ${questions.length} questions in JSON`);

  // Count questions with images
  const questionsWithImages = questions.filter(q => 
    q.extracted_data?.images && 
    Array.isArray(q.extracted_data.images) && 
    q.extracted_data.images.length > 0
  );
  
  console.log(`🖼️  Questions with images: ${questionsWithImages.length}`);

  // Filter out invalid questions
  const validQuestions = questions.filter(q => {
    const questionText = q.extracted_data?.question_text;
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

  // Get Resource Management knowledge area ID
  const kaResult = await pool.query(
    "SELECT id FROM knowledge_areas WHERE name = 'Project Resource Management' LIMIT 1"
  );
  
  if (kaResult.rows.length === 0) {
    console.error('Error: Project Resource Management knowledge area not found in database');
    process.exit(1);
  }
  
  const resourceKnowledgeAreaId = kaResult.rows[0].id;
  console.log(`✅ Found Resource Management knowledge area ID: ${resourceKnowledgeAreaId}`);

  // Start transaction
  await pool.query('BEGIN');

  let imported = 0;
  let updated = 0;
  const errors = [];

  console.log('\n🔄 Processing questions...\n');

  for (let i = 0; i < validQuestions.length; i++) {
    const q = validQuestions[i];
    const data = q.extracted_data;
    
    try {
      // Generate question ID
      const questionId = `RESOURCE-${q.number || i + 1}`;
      
      if (!data.question_text || data.question_text.trim() === '') {
        throw new Error('Question text is required');
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

      // Get correct answer
      const correctAnswer = (data.correct_answer || '').trim().toUpperCase();
      
      // Validate question before processing
      const issues = [];
      if (options.length === 0) {
        issues.push('No options found');
      }
      if (!correctAnswer && questionType !== 'drag_and_match') {
        issues.push('No correct answer specified');
      }
      
      // Skip questions with issues - just report them
      if (issues.length > 0) {
        errors.push({
          questionNumber: q.number || i + 1,
          questionId: questionId,
          issues: issues,
          questionText: data.question_text?.substring(0, 100) + '...' || 'N/A'
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
      if (questionType === 'drag_and_match' && data.drag_drop_pairs && Array.isArray(data.drag_drop_pairs)) {
        questionMetadata = {
          drag_drop_pairs: data.drag_drop_pairs
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
            data.question_text || '',
            data.explanation || null,
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
            resourceKnowledgeAreaId,
            data.question_text || '',
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

      if ((imported + updated) % 10 === 0) {
        process.stdout.write(`\rProcessed ${imported + updated}/${validQuestions.length} questions... (${imported} new, ${updated} updated)`);
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
  console.log(`   Existing questions updated: ${updated}`);
  console.log(`   Total processed: ${imported + updated}`);
  console.log(`   Questions with images: ${questionsWithImages.length}`);
  console.log(`   Errors: ${errors.length}`);
  
  // Show normalization summary
  const domainStats = await pool.query(
    `SELECT domain, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND domain IS NOT NULL
     GROUP BY domain
     ORDER BY count DESC`,
    [resourceKnowledgeAreaId]
  );
  
  const taskStats = await pool.query(
    `SELECT task, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND task IS NOT NULL
     GROUP BY task
     ORDER BY count DESC
     LIMIT 10`,
    [resourceKnowledgeAreaId]
  );
  
  const pmApproachStats = await pool.query(
    `SELECT pm_approach, COUNT(*) as count 
     FROM questions 
     WHERE knowledge_area_id = $1 AND pm_approach IS NOT NULL
     GROUP BY pm_approach
     ORDER BY count DESC`,
    [resourceKnowledgeAreaId]
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
    console.log('\n❌ Questions skipped due to issues:');
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

  await pool.end();
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
