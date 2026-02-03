const fs = require('fs');
const path = require('path');

/**
 * Extract correct answers for multi-select questions from HTML
 * Looks for patterns in explanation or answer sections
 */
function extractMultiAnswer(html) {
  if (!html) return '';
  
  const answers = [];
  
  // Pattern 1: Look for checked checkboxes with correct class
  // <input checked class="correct_a" value="518682">
  const checkedCorrectPattern = /<input[^>]*checked[^>]*class="[^"]*correct[^"]*"[^>]*value="(\d+)"[^>]*>/gi;
  let match;
  const checkedValues = [];
  while ((match = checkedCorrectPattern.exec(html)) !== null) {
    checkedValues.push(match[1]);
  }
  
  // Find labels for these checked values
  for (const valueId of checkedValues) {
    // Look for label with this value's ID
    const labelPattern = new RegExp(`<label[^>]*for="qc_${valueId}"[^>]*>.*?<strong>([A-F])</strong>`, 'i');
    const labelMatch = html.match(labelPattern);
    if (labelMatch) {
      answers.push(labelMatch[1].trim());
    }
  }
  
  // Pattern 2: Look for "Correct Answer: A, C, D" pattern
  const correctAnswerPattern = /Correct\s+Answer[s]?:\s*([A-F,\s]+)/i;
  const correctMatch = html.match(correctAnswerPattern);
  if (correctMatch) {
    const answerStr = correctMatch[1].trim();
    const answerLetters = answerStr.split(/[,\s]+/).map(a => a.trim().toUpperCase()).filter(a => /^[A-F]$/.test(a));
    if (answerLetters.length > 0) {
      return answerLetters.join(', ');
    }
  }
  
  // Pattern 3: Look for choice explanations with correct class
  // <p class="choice_explanation correct_a">
  const choiceCorrectPattern = /<p[^>]*class="[^"]*correct_a[^"]*"[^>]*>.*?<strong>([A-F])<\/strong>/gi;
  const choiceAnswers = [];
  while ((match = choiceCorrectPattern.exec(html)) !== null) {
    choiceAnswers.push(match[1].trim().toUpperCase());
  }
  if (choiceAnswers.length > 0) {
    return choiceAnswers.join(', ');
  }
  
  // Pattern 4: Look in explanation text for option letters near "correct"
  const explanationMatch = html.match(/<strong>Explanation:<\/strong>(.*?)(?=<strong>|$)/is);
  if (explanationMatch) {
    const explanation = explanationMatch[1];
    // Look for patterns like "A, C, and D are correct" or "options A, C, D"
    const explanationPatterns = [
      /\b([A-F])\s*,\s*([A-F])\s*,\s*([A-F])\s+(?:are\s+)?correct/i,
      /correct[^.]{0,100}\b([A-F])\s*,\s*([A-F])\s*,\s*([A-F])\b/i,
      /options?\s+([A-F])\s*,\s*([A-F])\s*,\s*([A-F])\b/i,
    ];
    
    for (const pattern of explanationPatterns) {
      const expMatch = explanation.match(pattern);
      if (expMatch) {
        const found = [expMatch[1], expMatch[2], expMatch[3]]
          .map(a => a.trim().toUpperCase())
          .filter(a => /^[A-F]$/.test(a));
        if (found.length === 3) {
          return found.join(', ');
        }
      }
    }
  }
  
  // Return what we found from checked inputs
  if (answers.length > 0) {
    return answers.sort().join(', ');
  }
  
  return '';
}

/**
 * Extract question data from HTML
 */
function extractQuestionFromHTML(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf-8');
  let html = content;
  
  // Check if it's JSON with full_html field
  if (content.trim().startsWith('"full_html"') || content.trim().startsWith('{')) {
    try {
      // Try to parse as JSON
      let data;
      if (content.trim().startsWith('"full_html"')) {
        // It's just the full_html field, wrap it
        data = JSON.parse('{' + content + '}');
      } else {
        data = JSON.parse(content);
      }
      
      if (data.full_html) {
        html = data.full_html;
        console.log('   Extracted HTML from JSON full_html field');
      } else if (Array.isArray(data) && data[0] && data[0].full_html) {
        html = data[0].full_html;
        console.log('   Extracted HTML from JSON array');
      }
    } catch (e) {
      // Not JSON, use as-is
      console.log('   Note: File is not JSON, using as HTML');
    }
  }
  
  // Extract question text - look for the quest_div content
  // Pattern: <div id="quest_div">...<div>...<p>question text</p>
  const questionMatch = html.match(/<div id="quest_div"[^>]*>.*?<div>.*?<p>(.*?)<\/p>/s);
  let questionText = '';
  if (questionMatch) {
    let qText = questionMatch[1];
    // Get all <p> tags in the question div
    const allPMatches = html.match(/<div id="quest_div"[^>]*>.*?<div>(.*?)<\/div>.*?<form/s);
    if (allPMatches) {
      const questionDiv = allPMatches[1];
      const pMatches = questionDiv.match(/<p>(.*?)<\/p>/g);
      if (pMatches) {
        questionText = pMatches.map(p => {
          return p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }).join(' ');
      }
    }
    if (!questionText) {
      questionText = qText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }
  
  // Extract options - look for pattern in table: <td class="jq_input_pos">...<strong>A</strong>...<input id="qc_518682">...<label for="qc_518682">text</label>
  const options = [];
  // Pattern: Match the table row structure
  const optionPattern = /<td[^>]*class="jq_input_pos"[^>]*>.*?<strong>([A-F])<\/strong>.*?<input[^>]*id="qc_(\d+)"[^>]*>.*?<label[^>]*for="qc_\2"[^>]*>(.*?)<\/label>/gi;
  let optionMatch;
  while ((optionMatch = optionPattern.exec(html)) !== null) {
    const letter = optionMatch[1].trim();
    const valueId = optionMatch[2];
    let text = optionMatch[3].trim();
    text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    options.push({
      letter: letter,
      text: text,
      valueId: valueId
    });
  }
  
  // If that didn't work, try a simpler pattern without the td wrapper
  if (options.length === 0) {
    const simplePattern = /<strong>([A-F])<\/strong>.*?<input[^>]*name="quest_choice"[^>]*id="qc_(\d+)"[^>]*>.*?<label[^>]*for="qc_\2"[^>]*>(.*?)<\/label>/gi;
    while ((optionMatch = simplePattern.exec(html)) !== null) {
      const letter = optionMatch[1].trim();
      const valueId = optionMatch[2];
      let text = optionMatch[3].trim();
      text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      
      options.push({
        letter: letter,
        text: text,
        valueId: valueId
      });
    }
  }
  
  // Extract correct answer
  const correctAnswer = extractMultiAnswer(html);
  
  // Extract explanation
  let explanation = '';
  const explanationMatch = html.match(/<strong>Explanation:<\/strong>(.*?)(?=<strong>|$)/is);
  if (explanationMatch) {
    explanation = explanationMatch[1]
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
  }
  
  // Extract domain, task, approach
  const domainMatch = html.match(/Domain:\s*<span>([^<]+)<\/span>/i);
  const taskMatch = html.match(/Task:\s*<span>([^<]+)<\/span>/i);
  const approachMatch = html.match(/PM\s+Approach:\s*<span>([^<]+)<\/span>/i);
  
  return {
    question_text: questionText,
    options: options,
    correct_answer: correctAnswer,
    explanation: explanation,
    domain: domainMatch ? domainMatch[1].trim() : '',
    task: taskMatch ? taskMatch[1].trim() : '',
    approach: approachMatch ? approachMatch[1].trim() : ''
  };
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: node extract-multi-answer-from-html.js <html_file>');
  console.error('');
  console.error('Example:');
  console.error('  node extract-multi-answer-from-html.js multi1.html');
  process.exit(1);
}

const htmlPath = args[0];

if (!fs.existsSync(htmlPath)) {
  console.error(`Error: HTML file not found: ${htmlPath}`);
  process.exit(1);
}

console.log('📖 Reading HTML file...');
const extracted = extractQuestionFromHTML(htmlPath);

console.log('\n📊 Extracted Data:');
console.log(`\nQuestion Text: ${extracted.question_text.substring(0, 200)}...`);
console.log(`\nOptions (${extracted.options.length}):`);
extracted.options.forEach(opt => {
  console.log(`  ${opt.letter}: ${opt.text.substring(0, 80)}...`);
});

console.log(`\n✅ Correct Answer: ${extracted.correct_answer || 'NOT FOUND'}`);
console.log(`\nDomain: ${extracted.domain || 'NOT FOUND'}`);
console.log(`Task: ${extracted.task || 'NOT FOUND'}`);
console.log(`Approach: ${extracted.approach || 'NOT FOUND'}`);

if (extracted.explanation) {
  console.log(`\nExplanation (first 300 chars): ${extracted.explanation.substring(0, 300)}...`);
}

// Save to JSON
const outputPath = htmlPath.replace('.html', '_extracted.json');
fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2), 'utf-8');
console.log(`\n💾 Saved extracted data to: ${outputPath}`);
