const fs = require('fs');
const path = require('path');

/**
 * Extract correct answer from HTML
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
 */
function extractExplanation(html) {
  if (!html) return '';
  
  const explanationMatch = html.match(/<strong>Explanation:<\/strong>(.*?)(?=<strong>|$)/is);
  if (explanationMatch) {
    let explanation = explanationMatch[1].trim();
    
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
 */
function extractExamContentOutline(html) {
  const result = {
    domain: '',
    task: '',
    approach: ''
  };
  
  if (!html) return result;
  
  const domainMatch = html.match(/Domain:\s*<span>([^<]+)<\/span>/i);
  if (domainMatch) {
    result.domain = domainMatch[1].trim();
  }
  
  const taskMatch = html.match(/Task:\s*<span>([^<]+)<\/span>/i);
  if (taskMatch) {
    result.task = taskMatch[1].trim();
  }
  
  const approachMatch = html.match(/PM\s+Approach:\s*<span>([^<]+)<\/span>/i);
  if (approachMatch) {
    result.approach = approachMatch[1].trim();
  }
  
  return result;
}

/**
 * Merge backup data from directory into extracted questions
 */
function mergeBackupDirectory(extractedQuestionsPath, backupDir) {
  console.log('📖 Reading extracted questions...');
  const extractedQuestions = JSON.parse(fs.readFileSync(extractedQuestionsPath, 'utf-8'));
  console.log(`   Found ${extractedQuestions.length} questions`);
  
  // Read all backup files
  const backupFiles = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('backup_') && f.endsWith('_full.json'))
    .sort();
  
  console.log(`📖 Found ${backupFiles.length} backup files`);
  
  // Create a map of backup data by question number
  const backupMap = new Map();
  
  backupFiles.forEach(backupFile => {
    const backupPath = path.join(backupDir, backupFile);
    try {
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
      
      // Handle both single item and array
      const items = Array.isArray(backupData) ? backupData : [backupData];
      
      items.forEach(item => {
        if (item.number) {
          backupMap.set(item.number, item);
        }
      });
    } catch (error) {
      console.warn(`   ⚠️  Error reading ${backupFile}: ${error.message}`);
    }
  });
  
  console.log(`   Loaded ${backupMap.size} backup entries`);
  
  let merged = 0;
  let updated = 0;
  
  console.log('\n🔄 Merging data...\n');
  
  // Merge data from backup into extracted questions
  extractedQuestions.forEach((question) => {
    const questionNumber = question.number;
    const backupItem = backupMap.get(questionNumber);
    
    if (!backupItem) {
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
  console.log(`\n💾 Saving merged data to ${extractedQuestionsPath}...`);
  fs.writeFileSync(extractedQuestionsPath, JSON.stringify(extractedQuestions, null, 2), 'utf-8');
  
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
  console.error('Usage: node merge-backup-directory.js <extracted_questions.json> <backup_directory>');
  console.error('');
  console.error('Example:');
  console.error('  node merge-backup-directory.js extracted_questions.json json_backups/');
  process.exit(1);
}

const extractedQuestionsPath = args[0];
const backupDir = args[1];

if (!fs.existsSync(extractedQuestionsPath)) {
  console.error(`Error: Extracted questions file not found: ${extractedQuestionsPath}`);
  process.exit(1);
}

if (!fs.existsSync(backupDir)) {
  console.error(`Error: Backup directory not found: ${backupDir}`);
  process.exit(1);
}

mergeBackupDirectory(extractedQuestionsPath, backupDir);
