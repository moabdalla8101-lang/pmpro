/**
 * Authoritative scoring acceptance tests (practice + exam).
 * Skips when Postgres is unreachable (RUN_DB_TESTS=0 to force skip).
 */
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '@pmp-app/shared';
import { app } from '../index';
import { pool } from '../db/connection';

const CERT_ID = '550e8400-e29b-41d4-a716-446655440000';
const forceSkip = process.env.RUN_DB_TESTS === '0';

let dbAvailable = false;
let userA = '';
let userB = '';
let tokenA = '';
let tokenB = '';

async function createUser(label: string) {
  const email = `auth-score-${label}-${Date.now()}@example.com`;
  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier)
     VALUES (uuid_generate_v4(), $1, 'x', 'Auth', $2, 'user', 'premium_monthly')
     RETURNING id`,
    [email, label]
  );
  const id = result.rows[0].id;
  const token = generateToken({ userId: id, email, role: 'user' });
  return { id, token };
}

beforeAll(async () => {
  if (forceSkip) return;
  try {
    await pool.query('SELECT 1');
    await pool.query(`
      ALTER TABLE question_attempts
        ADD COLUMN IF NOT EXISTS idempotency_key TEXT
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_user_idempotency
        ON question_attempts (user_id, idempotency_key)
        WHERE idempotency_key IS NOT NULL
    `);
    const a = await createUser('a');
    const b = await createUser('b');
    userA = a.id;
    tokenA = a.token;
    userB = b.id;
    tokenB = b.token;
    dbAvailable = true;
  } catch (err) {
    dbAvailable = false;
    console.warn('Skipping authoritative scoring DB tests:', (err as Error).message);
  }
}, 60000);

afterAll(async () => {
  if (!dbAvailable) return;
  for (const id of [userA, userB]) {
    if (!id) continue;
    await pool.query('DELETE FROM mock_exams WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM question_attempts WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM user_progress WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
});

function itDb(name: string, fn: () => Promise<void>, timeout = 60000) {
  it(name, async () => {
    if (!dbAvailable) return;
    await fn();
  }, timeout);
}

function practicePost(
  token: string,
  body: Record<string, unknown>,
  idempotencyKey = `test-${uuidv4()}`
) {
  return request(app)
    .post('/api/progress/answer')
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', idempotencyKey)
    .send({ certificationId: CERT_ID, ...body });
}

async function pickSelectOne() {
  const result = await pool.query(
    `SELECT q.id as question_id, a.id as answer_id, a.is_correct
     FROM questions q
     JOIN answers a ON a.question_id = q.id
     WHERE q.certification_id = $1
       AND q.is_active = true
       AND COALESCE(q.question_type, 'select_one') IN ('select_one', 'multiple_choice')
     ORDER BY q.id, a."order"
     LIMIT 20`,
    [CERT_ID]
  );
  const byQ = new Map<string, any[]>();
  for (const row of result.rows) {
    const list = byQ.get(row.question_id) || [];
    list.push(row);
    byQ.set(row.question_id, list);
  }
  for (const [qid, opts] of byQ) {
    if (opts.length >= 2) {
      const correct = opts.find((o) => o.is_correct) || opts[0];
      const wrong = opts.find((o) => o.id !== correct.answer_id) || opts[1];
      return {
        questionId: qid,
        correctAnswerId: correct.answer_id,
        wrongAnswerId: wrong.answer_id,
        otherQuestionAnswerId: null as string | null,
      };
    }
  }
  throw new Error('No select_one fixture');
}

describe('authoritative practice scoring', () => {
  itDb('rejects answer IDs belonging to another question', async () => {
    const q1 = await pickSelectOne();
    const q2rows = await pool.query(
      `SELECT a.id FROM answers a
       JOIN questions q ON q.id = a.question_id
       WHERE q.certification_id = $1 AND q.is_active = true AND q.id <> $2
       LIMIT 1`,
      [CERT_ID, q1.questionId]
    );
    const foreignAnswerId = q2rows.rows[0].id;

    const res = await practicePost(tokenA, {
      questionId: q1.questionId,
      answerId: foreignAnswerId,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(JSON.stringify(res.body)).toMatch(/belong|Invalid|Validation|error/i);

    const count = await pool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE user_id = $1 AND question_id = $2',
      [userA, q1.questionId]
    );
    expect(count.rows[0].c).toBe(0);
  });

  itDb('rejects repeated answer IDs in one payload', async () => {
    const q = await pickSelectOne();
    const res = await practicePost(tokenA, {
      questionId: q.questionId,
      answerIds: [q.correctAnswerId, q.correctAnswerId],
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  itDb('requires Idempotency-Key and certificationId', async () => {
    const q = await pickSelectOne();
    const missingKey = await request(app)
      .post('/api/progress/answer')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        questionId: q.questionId,
        answerId: q.correctAnswerId,
        certificationId: CERT_ID,
      });
    expect(missingKey.status).toBeGreaterThanOrEqual(400);

    const missingCert = await request(app)
      .post('/api/progress/answer')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('Idempotency-Key', `nokey-${uuidv4()}`)
      .send({
        questionId: q.questionId,
        answerId: q.correctAnswerId,
      });
    expect(missingCert.status).toBeGreaterThanOrEqual(400);
  });

  itDb('rejects questions that do not belong to the requested certification', async () => {
    const q = await pickSelectOne();
    const fakeCert = uuidv4();
    const res = await request(app)
      .post('/api/progress/answer')
      .set('Authorization', `Bearer ${tokenA}`)
      .set('Idempotency-Key', `wrong-cert-${uuidv4()}`)
      .send({
        questionId: q.questionId,
        answerId: q.correctAnswerId,
        certificationId: fakeCert,
      });
    expect(res.status).toBe(404);

    const count = await pool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE user_id = $1 AND question_id = $2',
      [userA, q.questionId]
    );
    expect(count.rows[0].c).toBe(0);
  });

  itDb('idempotent retries with the same key do not inflate progress', async () => {
    const q = await pickSelectOne();
    const key = `idem-${uuidv4()}`;

    const first = await practicePost(
      tokenA,
      { questionId: q.questionId, answerId: q.correctAnswerId },
      key
    ).expect(200);

    const before = await pool.query(
      'SELECT total_questions_answered::int AS t FROM user_progress WHERE user_id = $1 AND certification_id = $2',
      [userA, CERT_ID]
    );

    const second = await practicePost(
      tokenA,
      { questionId: q.questionId, answerId: q.correctAnswerId },
      key
    ).expect(200);

    expect(second.body.alreadyRecorded).toBe(true);
    expect(second.body.attemptId).toBe(first.body.attemptId);

    const attempts = await pool.query(
      `SELECT COUNT(*)::int AS c FROM question_attempts
       WHERE user_id = $1 AND question_id = $2 AND idempotency_key = $3`,
      [userA, q.questionId, key]
    );
    expect(attempts.rows[0].c).toBe(1);

    const after = await pool.query(
      'SELECT total_questions_answered::int AS t FROM user_progress WHERE user_id = $1 AND certification_id = $2',
      [userA, CERT_ID]
    );
    expect(after.rows[0].t).toBe(before.rows[0].t);
  });

  itDb('rejects inactive questions', async () => {
    const inactive = await pool.query(
      `SELECT id FROM questions WHERE certification_id = $1 AND is_active = false LIMIT 1`,
      [CERT_ID]
    );
    if (!inactive.rows.length) return;
    const res = await practicePost(tokenA, {
      questionId: inactive.rows[0].id,
      answerId: uuidv4(),
    });
    expect(res.status).toBe(404);
  });

  itDb('rejects client-authored isCorrect on practice submit', async () => {
    const q = await pickSelectOne();
    const res = await practicePost(tokenA, {
      questionId: q.questionId,
      answerId: q.wrongAnswerId,
      isCorrect: true,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  itDb('rejects client-authored progress totals', async () => {
    const res = await request(app)
      .put('/api/progress')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        certificationId: CERT_ID,
        totalQuestionsAnswered: 9999,
        correctAnswers: 9999,
      });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  itDb('valid single-select practice still works', async () => {
    const q = await pickSelectOne();
    const res = await practicePost(tokenA, {
      questionId: q.questionId,
      answerId: q.correctAnswerId,
    }).expect(200);
    expect(typeof res.body.isCorrect).toBe('boolean');
    expect(res.body.isCorrect).toBe(true);
  });
});

describe('authoritative exam scoring', () => {
  itDb('partial submit scores against assigned denominator, not submitted count', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 5 })
      .expect(201);

    const examId = start.body.examId;
    const q0 = start.body.questions[0];
    const answerId = q0.answers?.[0]?.id;

    const submitted = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        answers: answerId ? [{ questionId: q0.id, answerId }] : [{ questionId: q0.id }],
      })
      .expect(200);

    expect(submitted.body.totalQuestions).toBe(5);
    expect(submitted.body.correctAnswers).toBeLessThanOrEqual(5);
    expect(submitted.body.score).toBeGreaterThanOrEqual(0);
    expect(submitted.body.score).toBeLessThanOrEqual(100);
    // At most 1/5 correct if first answer happened to be right
    expect(submitted.body.score).toBeLessThanOrEqual(20.0001);

    const attempts = await pool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE exam_id = $1',
      [examId]
    );
    expect(attempts.rows[0].c).toBe(5);
  });

  itDb('empty answers array grades all assigned as incorrect', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 3 })
      .expect(201);

    const submitted = await request(app)
      .post(`/api/exams/${start.body.examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ answers: [] })
      .expect(200);

    expect(submitted.body.totalQuestions).toBe(3);
    expect(submitted.body.correctAnswers).toBe(0);
    expect(submitted.body.score).toBe(0);
  });

  itDb('rejects another user exam and completed-exam replay does not add rows', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 })
      .expect(201);
    const examId = start.body.examId;

    const foreign = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ answers: [] });
    expect(foreign.status).toBe(404);

    await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ answers: [] })
      .expect(200);

    const before = await pool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE exam_id = $1',
      [examId]
    );

    const again = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ answers: [] })
      .expect(200);
    expect(again.body.alreadySubmitted).toBe(true);

    const after = await pool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE exam_id = $1',
      [examId]
    );
    expect(after.rows[0].c).toBe(before.rows[0].c);
  });

  itDb('rejects duplicate question IDs and foreign question IDs in one exam submit', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 })
      .expect(201);
    const examId = start.body.examId;
    const q0 = start.body.questions[0].id;

    const dup = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ answers: [{ questionId: q0 }, { questionId: q0 }] });
    expect(dup.status).toBeGreaterThanOrEqual(400);

    const foreignQ = await pool.query(
      `SELECT id FROM questions WHERE certification_id = $1 AND is_active = true AND id <> ALL($2::uuid[]) LIMIT 1`,
      [CERT_ID, start.body.questions.map((q: any) => q.id)]
    );

    const foreign = await request(app)
      .post(`/api/exams/${examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ answers: [{ questionId: foreignQ.rows[0].id }] });
    expect(foreign.status).toBeGreaterThanOrEqual(400);
  });

  itDb('concurrent submissions do not inflate attempts', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 })
      .expect(201);
    const examId = start.body.examId;

    const [r1, r2] = await Promise.all([
      request(app)
        .post(`/api/exams/${examId}/submit`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ answers: [] }),
      request(app)
        .post(`/api/exams/${examId}/submit`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ answers: [] }),
    ]);

    expect([r1.status, r2.status].every((s) => s === 200)).toBe(true);
    const bodies = [r1.body, r2.body];
    expect(bodies.some((b) => b.alreadySubmitted === true || b.totalQuestions === 2)).toBe(true);

    const attempts = await pool.query(
      'SELECT COUNT(*)::int AS c FROM question_attempts WHERE exam_id = $1',
      [examId]
    );
    expect(attempts.rows[0].c).toBe(2);

    const exam = await pool.query('SELECT correct_answers, total_questions, score FROM mock_exams WHERE id = $1', [
      examId,
    ]);
    expect(exam.rows[0].total_questions).toBe(2);
    expect(Number(exam.rows[0].score)).toBeGreaterThanOrEqual(0);
    expect(Number(exam.rows[0].score)).toBeLessThanOrEqual(100);
  });

  itDb('rejects client-authored score on exam submit', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 })
      .expect(201);

    const res = await request(app)
      .post(`/api/exams/${start.body.examId}/submit`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ answers: [], score: 100, correctAnswers: 2 });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  itDb('rejects exam assignments that mix certifications', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 })
      .expect(201);

    const examId = start.body.examId;
    const q0 = start.body.questions[0].id;
    const otherCert = uuidv4();

    await pool.query(
      `INSERT INTO certifications (id, name, type, description, is_active)
       VALUES ($1, 'Other Cert', 'other', 'test', true)`,
      [otherCert]
    );

    // Simulate a corrupted assignment that points at another certification.
    await pool.query('UPDATE questions SET certification_id = $1 WHERE id = $2', [
      otherCert,
      q0,
    ]);

    try {
      const res = await request(app)
        .post(`/api/exams/${examId}/submit`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ answers: [] });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(JSON.stringify(res.body)).toMatch(/certification/i);
    } finally {
      await pool.query('UPDATE questions SET certification_id = $1 WHERE id = $2', [
        CERT_ID,
        q0,
      ]);
      await pool.query('DELETE FROM certifications WHERE id = $1', [otherCert]);
    }
  });

  itDb('inactive assigned exam questions cannot score as correct', async () => {
    const start = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 })
      .expect(201);

    const examId = start.body.examId;
    const q0 = start.body.questions[0];
    const correctOpt = (q0.answers || []).find((a: any) => a) || q0.answers?.[0];

    // Deactivate one assigned question after assignment (content disable mid-exam).
    await pool.query('UPDATE questions SET is_active = false WHERE id = $1', [q0.id]);

    try {
      const submitted = await request(app)
        .post(`/api/exams/${examId}/submit`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          answers: correctOpt?.id
            ? [{ questionId: q0.id, answerId: correctOpt.id }]
            : [{ questionId: q0.id }],
        })
        .expect(200);

      expect(submitted.body.totalQuestions).toBe(2);
      // Even if client sent a "correct" option, inactive item is forced incorrect.
      const inactiveAttempt = await pool.query(
        `SELECT is_correct, response_json FROM question_attempts
         WHERE exam_id = $1 AND question_id = $2`,
        [examId, q0.id]
      );
      expect(inactiveAttempt.rows[0].is_correct).toBe(false);
      expect(inactiveAttempt.rows[0].response_json?.inactiveQuestion).toBe(true);
      expect(submitted.body.correctAnswers).toBeLessThanOrEqual(1);
    } finally {
      await pool.query('UPDATE questions SET is_active = true WHERE id = $1', [q0.id]);
    }
  });
});
