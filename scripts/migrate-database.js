const fs = require('fs');
const path = require('path');
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

async function runSqlFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(
      __dirname,
      '../backend/database/migrations'
    );
    const migrations = fs
      .readdirSync(migrationsDir)
      .filter((filename) => filename.endsWith('.sql'))
      .sort();

    for (const filename of migrations) {
      const applied = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [filename]
      );
      if (applied.rowCount) continue;

      console.log(`Applying migration ${filename}`);
      await client.query('BEGIN');
      try {
        await runSqlFile(client, path.join(migrationsDir, filename));
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename]
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    const seedCheck = await client.query(
      'SELECT 1 FROM certifications LIMIT 1'
    );
    if (!seedCheck.rowCount) {
      console.log('Applying initial reference data');
      await runSqlFile(
        client,
        path.join(
          __dirname,
          '../backend/database/seeds/001_initial_data.sql'
        )
      );
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Database migration failed:', error);
  process.exit(1);
});
