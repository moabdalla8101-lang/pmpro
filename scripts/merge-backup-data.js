const fs = require('fs');
const path = require('path');

/**
 * Extract correct answer from HTML
 * Looks for patterns like "Correct Answer: C" or "Correct Answer: A, B"
 */
function extractCorrectAnswer(html) {
  if (!html) return '';
  
  // Pattern 1: <strong>Correct Answer: C</strong>
  let match = html.match(/<strong>Correct\s+Answer:\s*([A-Z, ]+)<\/strong>/i);
  if (match) {
    return match[1].trim().split(',').map(a => a.trim()).join(', ');
  }
  
  // Pattern 2: Correct Answer: C
  match = html.match(/Correct\s+Answer:\s*([A-Z, ]+)/i);
  if (match) {
    return match[1].trim().split(',').map(a => a.trim()).join(', ');
  }
  
  // Pattern 3: Look for checked radio button with correct class
  match = html.match(/<input[^>]*checked[^>]*class="[^"]*correct[^"]*"[^>]*value="(\d+)"[^>]*>/i);
  if (match) {
    // Find the label associated with this value
    const valueId = match[1];
    const labelMatch = html.match(new RegExp(`<label[^>]*for="[^"]*${valueId}[^"]*"[^>]*>([A-Z])</label>`, 'i'));
    if (labelMatch) {
      return labelMatch[1].trim();
    }
  }
  
  return '';
}

/**
 * Extract explanation from HTML
 * Gets text between <strong>Explanation:</strong> and next section
 */
function extractExplanation(html) {
  if (!html) return '';
  
  // Find explanation section
  const explanationMatch = html.match(/<strong>Explanation:<\/strong>(.*?)(?=<strong>|$)/is);
  if (explanationMatch) {
    let explanation = explanationMatch[1].trim();
    
    // Remove HTML tags but keep structure
    explanation = explanation
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
    
    return explanation;
  }
  
  return '';
}

/**
 * Extract domain, task, and approach from HTML
 * Looks for "Exam Content Outline" section
 */
function extractExamContentOutline(html) {
  const result = {
    domain: '',
    task: '',
    approach: ''
  };
  
  if (!html) return result;
  
  // Pattern: Domain: <span>1. People</span>
  const domainMatch = html.match(/Domain:\s*<span>([^<]+)<\/span>/i);
  if (domainMatch) {
    result.domain = domainMatch[1].trim();
  }
  
  // Pattern: Task: <span>1.2 Lead a team</span>
  const taskMatch = html.match(/Task:\s*<span>([^<]+)<\/span>/i);
  if (taskMatch) {
    result.task = taskMatch[1].trim();
  }
  
  // Pattern: PM Approach: <span>Agile / Hybrid</span>
  const approachMatch = html.match(/PM\s+Approach:\s*<span>([^<]+)<\/span>/i);
  if (approachMatch) {
    result.approach = approachMatch[1].trim();
  }
  
  return result;
}

/**
 * Merge backup data into extracted questions
 */
function mergeBackupData(extractedQuestionsPath, backupPath, outputPath) {
  console.log('📖 Reading extracted questions...');
  const extractedQuestions = JSON.parse(fs.readFileSync(extractedQuestionsPath, 'utf-8'));
  console.log(`   Found ${extractedQuestions.length} questions`);
  
  console.log('📖 Reading backup file...');
  const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  console.log(`   Found ${backupData.length} backup entries`);
  
  // Create a map of backup data by question number
  const backupMap = new Map();
  backupData.forEach(item => {
    backupMap.set(item.number, item);
  });
  
  let merged = 0;
  let updated = 0;
  
  console.log('\n🔄 Merging data...\n');
  
  // Merge data from backup into extracted questions
  extractedQuestions.forEach((question, index) => {
    const questionNumber = question.number;
    const backupItem = backupMap.get(questionNumber);
    
    if (!backupItem) {
      console.log(`   ⚠️  Question ${questionNumber}: No backup data found`);
      return;
    }
    
    const answerHtml = backupItem.answer_html || backupItem.full_html || '';
    const extractedData = question.extracted_data || {};
    
    let hasUpdates = false;
    
    // Extract correct answer
    if (!extractedData.correct_answer || extractedData.correct_answer.trim() === '') {
      const correctAnswer = extractCorrectAnswer(answerHtml);
      if (correctAnswer) {
        extractedData.correct_answer = correctAnswer;
        hasUpdates = true;
        updated++;
      }
    }
    
    // Extract explanation
    if (!extractedData.explanation || extractedData.explanation.trim() === '') {
      const explanation = extractExplanation(answerHtml);
      if (explanation) {
        extractedData.explanation = explanation;
        hasUpdates = true;
      }
    }
    
    // Extract domain, task, approach
    const outline = extractExamContentOutline(answerHtml);
    if ((!extractedData.domain || extractedData.domain.trim() === '') && outline.domain) {
      extractedData.domain = outline.domain;
      hasUpdates = true;
    }
    if ((!extractedData.task || extractedData.task.trim() === '') && outline.task) {
      extractedData.task = outline.task;
      hasUpdates = true;
    }
    if ((!extractedData.approach || extractedData.approach.trim() === '') && outline.approach) {
      extractedData.approach = outline.approach;
      hasUpdates = true;
    }
    
    if (hasUpdates) {
      merged++;
      console.log(`   ✅ Question ${questionNumber}: Merged data`);
    }
  });
  
  // Save merged data
  console.log(`\n💾 Saving merged data to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(extractedQuestions, null, 2), 'utf-8');
  
  console.log(`\n✅ Merge complete!`);
  console.log(`   Questions with updates: ${merged}`);
  console.log(`   Questions with correct answers added: ${updated}`);
  
  // Summary
  const withCorrectAnswer = extractedQuestions.filter(q => 
    q.extracted_data?.correct_answer && q.extracted_data.correct_answer.trim() !== ''
  ).length;
  const withExplanation = extractedQuestions.filter(q => 
    q.extracted_data?.explanation && q.extracted_data.explanation.trim() !== ''
  ).length;
  const withDomain = extractedQuestions.filter(q => 
    q.extracted_data?.domain && q.extracted_data.domain.trim() !== ''
  ).length;
  
  console.log(`\n📊 Final Statistics:`);
  console.log(`   Questions with correct_answer: ${withCorrectAnswer}/${extractedQuestions.length}`);
  console.log(`   Questions with explanation: ${withExplanation}/${extractedQuestions.length}`);
  console.log(`   Questions with domain: ${withDomain}/${extractedQuestions.length}`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node merge-backup-data.js <extracted_questions.json> <backup_20_full.json> [output.json]');
  console.error('');
  console.error('Example:');
  console.error('  node merge-backup-data.js extracted_questions.json backup_20_full.json extracted_questions_merged.json');
  process.exit(1);
}

const extractedQuestionsPath = args[0];
const backupPath = args[1];
const outputPath = args[2] || extractedQuestionsPath.replace('.json', '_merged.json');

if (!fs.existsSync(extractedQuestionsPath)) {
  console.error(`Error: Extracted questions file not found: ${extractedQuestionsPath}`);
  process.exit(1);
}

if (!fs.existsSync(backupPath)) {
  console.error(`Error: Backup file not found: ${backupPath}`);
  process.exit(1);
}

mergeBackupData(extractedQuestionsPath, backupPath, outputPath);
