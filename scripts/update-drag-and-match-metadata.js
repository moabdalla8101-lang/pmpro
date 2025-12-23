const fs = require('fs');
const path = require('path');

// Use pg from backend/server node_modules
const pgPath = path.join(__dirname, '..', 'backend', 'server', 'node_modules', 'pg');
const { Pool } = require(pgPath);

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'pmp_app',
  user: 'postgres',
  password: 'postgres'
});

(async () => {
  try {
    // Read CSV to get Q031 data
    const csvPath = path.join(__dirname, '..', 'PMP_Questions_Complete.csv');
    const csv = fs.readFileSync(csvPath, 'utf-8');
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const q31Index = lines.findIndex(l => l.includes('Q031'));
    
    if (q31Index === -1) {
      console.log('Q031 not found');
      process.exit(1);
    }
    
    const values = lines[q31Index].split(',');
    const optionsIdx = headers.indexOf('Options (JSON)');
    const correctIdx = headers.indexOf('Correct Options (JSON)');
    
    // Parse JSON (handle CSV escaping)
    const optionsJson = values[optionsIdx].replace(/\"\"/g, '"');
    const correctJson = values[correctIdx].replace(/\"\"/g, '"');
    
    const options = JSON.parse(optionsJson);
    const correct = JSON.parse(correctJson);
    
    const metadata = {
      leftItems: options.left_items || [],
      rightItems: options.right_items || [],
      matches: correct.matches || {}
    };
    
    // Update the question
    const result = await pool.query(
      'UPDATE questions SET question_metadata = $1 WHERE question_id = $2 RETURNING id',
      [JSON.stringify(metadata), 'Q031']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Updated Q031 with metadata');
      console.log('Metadata:', JSON.stringify(metadata, null, 2));
    } else {
      console.log('❌ Q031 not found in database');
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
    process.exit(1);
  }
})();

