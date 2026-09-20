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
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'pmp_app',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      }
);

const exportPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '../questions_export_20260203_181643.json');

async function importQuestions() {
  const questions = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
  console.log(`Importing ${questions.length} questions from ${exportPath}`);

  const certResult = await pool.query(
    "SELECT id FROM certifications WHERE type = 'pmp' LIMIT 1"
  );
  if (certResult.rows.length === 0) {
    throw new Error('PMP certification not found. Seed initial data first.');
  }
  const certId = certResult.rows[0].id;

  const kaResult = await pool.query(
    'SELECT id, name FROM knowledge_areas WHERE certification_id = $1',
    [certId]
  );
  const knowledgeAreas = new Map(kaResult.rows.map((row) => [row.name, row.id]));

  let imported = 0;
  let skipped = 0;

  for (const question of questions) {
    const knowledgeAreaId = knowledgeAreas.get(question.knowledge_area_name);
    if (!knowledgeAreaId) {
      skipped += 1;
      console.warn(`Skipping question ${question.question_id}: unknown knowledge area ${question.knowledge_area_name}`);
      continue;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const questionResult = await client.query(
        `INSERT INTO questions (
            id, question_id, certification_id, knowledge_area_id,
            question_text, explanation, difficulty, question_type,
            domain, task, pm_approach, question_metadata,
            question_images, explanation_images, is_active, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, COALESCE($16, NOW()), NOW()
          )
          ON CONFLICT (question_id) DO UPDATE SET
            question_text = EXCLUDED.question_text,
            explanation = EXCLUDED.explanation,
            difficulty = EXCLUDED.difficulty,
            question_type = EXCLUDED.question_type,
            domain = EXCLUDED.domain,
            task = EXCLUDED.task,
            pm_approach = EXCLUDED.pm_approach,
            question_metadata = EXCLUDED.question_metadata,
            question_images = EXCLUDED.question_images,
            explanation_images = EXCLUDED.explanation_images,
            knowledge_area_id = EXCLUDED.knowledge_area_id,
            is_active = EXCLUDED.is_active,
            updated_at = NOW()
          RETURNING id`,
        [
          question.id,
          question.question_id,
          certId,
          knowledgeAreaId,
          question.question_text,
          question.explanation || null,
          question.difficulty || 'medium',
          question.question_type || 'select_one',
          question.domain || null,
          question.task || null,
          question.pm_approach || null,
          question.question_metadata ? JSON.stringify(question.question_metadata) : null,
          question.question_images ? JSON.stringify(question.question_images) : null,
          question.explanation_images ? JSON.stringify(question.explanation_images) : null,
          question.is_active !== false,
          question.created_at || null,
        ]
      );

      const dbQuestionId = questionResult.rows[0].id;
      await client.query('DELETE FROM answers WHERE question_id = $1', [dbQuestionId]);

      for (const answer of question.answers || []) {
        await client.query(
          `INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
           VALUES (COALESCE($1::uuid, uuid_generate_v4()), $2, $3, $4, $5, NOW())`,
          [
            answer.id || null,
            dbQuestionId,
            answer.answer_text,
            !!answer.is_correct,
            answer.order ?? 0,
          ]
        );
      }

      await client.query('COMMIT');
      imported += 1;
      if (imported % 100 === 0) {
        process.stdout.write(`\rImported ${imported}/${questions.length}`);
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  console.log(`\nDone. Imported ${imported}, skipped ${skipped}`);
}

importQuestions()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
