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

async function checkDuplicates() {
  const jsonPath = '/Users/mohamed/Downloads/pmp/pmp_extractions/extraction_20260120_222757/extracted_questions.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`);
    process.exit(1);
  }

  console.log('📖 Reading JSON file...');
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const questions = JSON.parse(jsonContent);

  console.log(`📊 Found ${questions.length} questions in JSON\n`);

  const duplicates = [];
  const newQuestions = [];
  const missingData = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const data = q.extracted_data || q;
    const questionText = data.question_text || '';
    const questionNumber = q.number;

    if (!questionText || questionText.trim() === '') {
      missingData.push({
        number: questionNumber,
        reason: 'Missing question text'
      });
      continue;
    }

    // Check if question exists in database by question_text
    // Use a substring match to handle slight variations
    const searchText = questionText.substring(0, 100); // First 100 chars for matching
    
    const result = await pool.query(
      `SELECT id, question_id, question_text, knowledge_area_id, 
              (SELECT name FROM knowledge_areas WHERE id = questions.knowledge_area_id) as knowledge_area_name
       FROM questions 
       WHERE question_text LIKE $1 
       OR question_text = $2
       LIMIT 5`,
      [`%${searchText}%`, questionText]
    );

    if (result.rows.length > 0) {
      // Check for exact match
      const exactMatch = result.rows.find(row => 
        row.question_text.trim() === questionText.trim()
      );

      if (exactMatch) {
        duplicates.push({
          number: questionNumber,
          questionText: questionText.substring(0, 100) + '...',
          existingQuestionId: exactMatch.question_id,
          existingId: exactMatch.id,
          knowledgeArea: exactMatch.knowledge_area_name
        });
      } else {
        // Similar but not exact match
        duplicates.push({
          number: questionNumber,
          questionText: questionText.substring(0, 100) + '...',
          similarMatches: result.rows.map(row => ({
            questionId: row.question_id,
            knowledgeArea: row.knowledge_area_name,
            preview: row.question_text.substring(0, 100) + '...'
          })),
          note: 'Similar but not exact match'
        });
      }
    } else {
      // Check if missing required data
      const hasCorrectAnswer = data.correct_answer && data.correct_answer.trim() !== '';
      const hasOptions = data.options && data.options.length > 0;
      const hasExplanation = data.explanation && data.explanation.trim() !== '';

      if (!hasCorrectAnswer || !hasOptions) {
        missingData.push({
          number: questionNumber,
          reason: !hasCorrectAnswer ? 'Missing correct answer' : 'Missing options',
          preview: questionText.substring(0, 100) + '...'
        });
      } else {
        newQuestions.push({
          number: questionNumber,
          preview: questionText.substring(0, 100) + '...',
          hasExplanation: hasExplanation
        });
      }
    }
  }

  console.log('='.repeat(80));
  console.log('📋 DUPLICATE CHECK RESULTS');
  console.log('='.repeat(80));
  
  console.log(`\n✅ New Questions (ready to import): ${newQuestions.length}`);
  if (newQuestions.length > 0) {
    console.log('\n   New questions:');
    newQuestions.forEach(q => {
      console.log(`      #${q.number}: ${q.preview}`);
      if (!q.hasExplanation) {
        console.log(`         ⚠️  Missing explanation`);
      }
    });
  }

  console.log(`\n❌ Duplicate Questions: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log('\n   Duplicate questions:');
    duplicates.forEach(dup => {
      console.log(`\n      Question #${dup.number}:`);
      console.log(`         Text: ${dup.questionText}`);
      if (dup.existingQuestionId) {
        console.log(`         ✅ Exact match found:`);
        console.log(`            - Question ID: ${dup.existingQuestionId}`);
        console.log(`            - Knowledge Area: ${dup.knowledgeArea}`);
      } else if (dup.similarMatches) {
        console.log(`         ⚠️  Similar matches found (not exact):`);
        dup.similarMatches.forEach(match => {
          console.log(`            - Question ID: ${match.questionId}`);
          console.log(`            - Knowledge Area: ${match.knowledgeArea}`);
          console.log(`            - Preview: ${match.preview}`);
        });
      }
    });
  }

  console.log(`\n⚠️  Questions with Missing Data: ${missingData.length}`);
  if (missingData.length > 0) {
    console.log('\n   Questions missing data:');
    missingData.forEach(q => {
      console.log(`      #${q.number}: ${q.reason}`);
      if (q.preview) {
        console.log(`         Preview: ${q.preview}`);
      }
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Total questions in file: ${questions.length}`);
  console.log(`   New questions (ready): ${newQuestions.length}`);
  console.log(`   Duplicates found: ${duplicates.length}`);
  console.log(`   Missing data: ${missingData.length}`);
  console.log(`   Total processable: ${newQuestions.length + missingData.length}`);
  console.log('='.repeat(80));

  await pool.end();
}

checkDuplicates().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
