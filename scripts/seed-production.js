const { spawn } = require('child_process');
const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.DATABASE_SSL === 'false'
            ? false
            : { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'pmp_app',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      }
);

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

async function main() {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM questions');
  await pool.end();

  if (result.rows[0].count > 0) {
    console.log(`Skipping seed; ${result.rows[0].count} questions already exist.`);
    return;
  }

  await run(require('path').join(__dirname, 'import-questions-from-json.js'));
  await run(require('path').join(__dirname, 'import-flashcards-from-json.js'));
}

main().catch((error) => {
  console.error('Production seed failed:', error);
  process.exit(1);
});
