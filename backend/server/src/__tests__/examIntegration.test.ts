/**
 * Database-backed exam integration tests.
 * Skips when Postgres is unreachable (set RUN_DB_TESTS=0 to force skip).
 */
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { generateToken } from '@pmp-app/shared';
import { app } from '../index';
import { pool as appPool } from '../db/connection';
import { LEARNER_ATTEMPTS_CTE } from '../utils/learnerAttempts';
import { normalizeDragMetadata } from '../utils/normalizeDragMetadata';

const CERT_ID = '550e8400-e29b-41d4-a716-446655440000';
const MIGRATIONS_DIR = path.join(__dirname, '../../../database/migrations');
const forceSkip = process.env.RUN_DB_TESTS === '0';

let dbAvailable = false;
let testUserId = '';
let authHeader = '';

async function applyMigrationFile(filename: string) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf8');
  await appPool.query(sql);
}

async function ensureMigrations() {
  await applyMigrationFile('008_exam_questions_and_attempt_backfill.sql');
  await applyMigrationFile('009_deactivate_empty_drag_and_cancel_legacy_exams.sql');
  await applyMigrationFile('010_exam_draft_answers_and_legacy_assignment_backfill.sql');
}

beforeAll(async () => {
  if (forceSkip) return;
  try {
    await appPool.query('SELECT 1');
    dbAvailable = true;
    await ensureMigrations();
    const email = `exam-int-${Date.now()}@example.com`;
    const result = await appPool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier)
       VALUES (uuid_generate_v4(), $1, 'x', 'Exam', 'Int', 'user', 'premium_monthly')
       RETURNING id`,
      [email]
    );
    testUserId = result.rows[0].id;
    authHeader = `Bearer ${generateToken({ userId: testUserId, email, role: 'user' })}`;
  } catch (err) {
    dbAvailable = false;
    console.warn('Skipping DB integration tests:', (err as Error).message);
  }
}, 60000);

afterAll(async () => {
  if (!dbAvailable || !testUserId) return;
  await appPool.query('DELETE FROM mock_exams WHERE user_id = $1', [testUserId]);
  await appPool.query('DELETE FROM question_attempts WHERE user_id = $1', [testUserId]);
  await appPool.query('DELETE FROM user_answers WHERE user_id = $1', [testUserId]);
  await appPool.query('DELETE FROM users WHERE id = $1', [testUserId]);
});

function itDb(name: string, fn: () => Promise<void>, timeout = 60000) {
  it(name, async () => {
    if (!dbAvailable) return;
    await fn();
  }, timeout);
}

describe('exam integration (database)', () => {
  itDb('persists assignment, drafts, typed review, idempotent submit, and delete cascade', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', authHeader)
      .send({ certificationId: CERT_ID, totalQuestions: 3 })
      .expect(201);

    const examId = start.body.examId;
    expect(start.body.questions).toHaveLength(3);

    const assigned = await appPool.query(
      'SELECT question_id FROM exam_questions WHERE exam_id = $1 ORDER BY position',
      [examId]
    );
    expect(assigned.rows).toHaveLength(3);

    const q0 = start.body.questions[0];
    const answerId = q0.answers?.[0]?.id;
    expect(answerId).toBeTruthy();

    await request(app)
      .put(`/api/exams/${examId}/progress`)
      .set('Authorization', authHeader)
      .send({ answers: { [q0.id]: { answerId } } })
      .expect(200);

    const resumed = await request(app)
      .get(`/api/exams/${examId}`)
      .set('Authorization', authHeader)
      .expect(200);
    expect(resumed.body.draftAnswers?.[q0.id]?.answerId).toBe(answerId);
    expect(resumed.body.questions).toHaveLength(3);

    const submitAnswers = start.body.questions.map((q: any, idx: number) => {
      if (idx === 0) return { questionId: q.id, answerId };
      return { questionId: q.id };
    });

    const submitted = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', authHeader)
      .send({ answers: submitAnswers })
      .expect(200);

    expect(submitted.body.totalQuestions).toBe(3);

    const idempotent = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', authHeader)
      .send({ answers: submitAnswers })
      .expect(200);
    expect(idempotent.body.alreadySubmitted).toBe(true);

    const review = await request(app)
      .get(`/api/exams/${examId}/review`)
      .set('Authorization', authHeader)
      .expect(200);

    expect(review.body.answers).toHaveLength(3);
    for (const row of review.body.answers) {
      expect(row).toEqual(
        expect.objectContaining({
          questionType: expect.any(String),
          answerLabels: expect.any(Array),
          correctAnswerLabels: expect.any(Array),
          selectedDragMatches: expect.any(Array),
          correctDragMatches: expect.any(Array),
          options: expect.any(Array),
        })
      );
    }
    expect(review.body.answers.some((a: any) => a.unanswered)).toBe(true);

    const attemptsBefore = await appPool.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT COUNT(*)::int AS c FROM learner_attempts WHERE user_id = $1 AND exam_id = $2`,
      [testUserId, examId]
    );
    expect(attemptsBefore.rows[0].c).toBe(3);

    await request(app).delete(`/api/exams/${examId}`).set('Authorization', authHeader).expect(200);

    const attemptsAfter = await appPool.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT COUNT(*)::int AS c FROM learner_attempts WHERE user_id = $1 AND exam_id = $2`,
      [testUserId, examId]
    );
    expect(attemptsAfter.rows[0].c).toBe(0);

    const orphanUa = await appPool.query(
      `SELECT COUNT(*)::int AS c FROM user_answers
       WHERE user_id = $1 AND answered_at > NOW() - INTERVAL '5 minutes'`,
      [testUserId]
    );
    expect(orphanUa.rows[0].c).toBe(0);
  });

  itDb('counts one drag submission and returns drag review mappings', async () => {
    const drag = await appPool.query(
      `SELECT id, question_metadata FROM questions
       WHERE certification_id = $1 AND question_type = 'drag_and_match' AND is_active = true
       LIMIT 20`,
      [CERT_ID]
    );
    const usable = drag.rows.find((r: any) => normalizeDragMetadata(r.question_metadata).usable);
    expect(usable).toBeTruthy();
    const normalized = normalizeDragMetadata(usable.question_metadata);

    const fillers = await appPool.query(
      `SELECT id FROM questions
       WHERE certification_id = $1 AND is_active = true AND id <> $2
       LIMIT 2`,
      [CERT_ID, usable.id]
    );
    const questionIds = [usable.id, ...fillers.rows.map((r: any) => r.id)];

    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', authHeader)
      .send({
        certificationId: CERT_ID,
        totalQuestions: questionIds.length,
        questionIds,
      })
      .expect(201);

    const examId = start.body.examId;
    const answers = questionIds.map((qid) =>
      qid === usable.id
        ? { questionId: qid, dragMatches: { ...normalized.correctMatches } }
        : { questionId: qid }
    );

    await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', authHeader)
      .send({ answers })
      .expect(200);

    const counts = await appPool.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT COUNT(*)::int AS c
       FROM learner_attempts
       WHERE user_id = $1 AND question_id = $2 AND exam_id = $3`,
      [testUserId, usable.id, examId]
    );
    expect(counts.rows[0].c).toBe(1);

    const review = await request(app)
      .get(`/api/exams/${examId}/review`)
      .set('Authorization', authHeader)
      .expect(200);
    const dragCard = review.body.answers.find((a: any) => a.questionId === usable.id);
    expect(dragCard.questionType).toBe('drag_and_match');
    expect(dragCard.isCorrect).toBe(true);
    expect(dragCard.selectedDragMatches.length).toBeGreaterThan(0);

    await request(app).delete(`/api/exams/${examId}`).set('Authorization', authHeader);
  });

  itDb(
    'starts and submits a 180-question exam under the 10s mobile timeout budget',
    async () => {
      const t0 = Date.now();
      const start = await request(app)
        .post('/api/exams/start')
        .set('Authorization', authHeader)
        .send({ certificationId: CERT_ID, totalQuestions: 180 })
        .expect(201);
      expect(start.body.questions).toHaveLength(180);
      expect(Date.now() - t0).toBeLessThan(10000);

      const answers = start.body.questions.map((q: any) => ({ questionId: q.id }));
      const t1 = Date.now();
      const submitted = await request(app)
        .post(`/api/exams/${start.body.examId}/submit`)
        .set('Authorization', authHeader)
        .send({ answers })
        .expect(200);
      expect(submitted.body.totalQuestions).toBe(180);
      expect(Date.now() - t1).toBeLessThan(10000);

      await request(app)
        .delete(`/api/exams/${start.body.examId}`)
        .set('Authorization', authHeader);
    },
    120000
  );
});

describe('migration upgrade scenarios', () => {
  itDb('deactivates empty drag records and has draft_answers + exam_questions', async () => {
    const empty = await appPool.query(
      `SELECT COUNT(*)::int AS c FROM questions
       WHERE question_id IN ('INTEGRATION-23', 'RESOURCE-3') AND is_active = true`
    );
    expect(empty.rows[0].c).toBe(0);

    const cols = await appPool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'mock_exams' AND column_name = 'draft_answers'`
    );
    expect(cols.rows).toHaveLength(1);
    const tables = await appPool.query(`SELECT to_regclass('public.exam_questions') AS t`);
    expect(tables.rows[0].t).toBe('exam_questions');
  });

  itDb('backfills assignments for a completed pre-assignment exam from windowed attempts', async () => {
    const qs = await appPool.query(
      `SELECT id FROM questions WHERE certification_id = $1 AND is_active = true LIMIT 2`,
      [CERT_ID]
    );
    const examIdRes = await appPool.query(
      `INSERT INTO mock_exams (id, user_id, certification_id, started_at, completed_at, total_questions, correct_answers, score)
       VALUES (uuid_generate_v4(), $1, $2, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '1 minute', 2, 1, 50)
       RETURNING id`,
      [testUserId, CERT_ID]
    );
    const examId = examIdRes.rows[0].id;

    for (const row of qs.rows) {
      await appPool.query(
        `INSERT INTO question_attempts (id, user_id, question_id, is_correct, selected_answer_ids, response_json, answered_at, exam_id)
         VALUES (uuid_generate_v4(), $1, $2, true, '{}', '{"legacy":true}'::jsonb, NOW() - INTERVAL '5 minutes', NULL)`,
        [testUserId, row.id]
      );
    }

    await applyMigrationFile('010_exam_draft_answers_and_legacy_assignment_backfill.sql');

    const assigned = await appPool.query(
      'SELECT COUNT(*)::int AS c FROM exam_questions WHERE exam_id = $1',
      [examId]
    );
    expect(assigned.rows[0].c).toBe(2);

    const linked = await appPool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE exam_id = $1',
      [examId]
    );
    expect(linked.rows[0].c).toBe(2);

    await appPool.query('DELETE FROM mock_exams WHERE id = $1', [examId]);
  });
});
