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

const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '../flashcards_export_20260203_182627.json');

async function main() {
  const flashcards = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  let imported = 0;

  for (const flashcard of flashcards) {
    if (!flashcard.front_face || !flashcard.back_face) {
      continue;
    }

    await pool.query(
      `INSERT INTO flashcards (
         id, front_face, back_face, knowledge_area, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, COALESCE($5, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET
         front_face = EXCLUDED.front_face,
         back_face = EXCLUDED.back_face,
         knowledge_area = EXCLUDED.knowledge_area,
         updated_at = NOW()`,
      [
        flashcard.id,
        flashcard.front_face,
        flashcard.back_face,
        flashcard.knowledge_area || null,
        flashcard.created_at || null,
      ]
    );
    imported += 1;
  }

  console.log(`Imported ${imported} flashcards`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
