/**
 * Server-side premium gating + subscription self-service denial.
 * Skips when Postgres is unreachable (RUN_DB_TESTS=0 to force skip).
 */
import request from 'supertest';
import { generateToken } from '@pmp-app/shared';
import { app } from '../index';
import { pool } from '../db/connection';
import {
  isPremiumTier,
  isSubscriptionActive,
} from '../middleware/subscription';

const CERT_ID = '550e8400-e29b-41d4-a716-446655440000';
const forceSkip = process.env.RUN_DB_TESTS === '0';

let dbAvailable = false;

function itDb(name: string, fn: () => Promise<void>, timeout = 60000) {
  it(name, async () => {
    if (!dbAvailable) return;
    await fn();
  }, timeout);
}

async function createUser(tier: string) {
  const email = `sec-gate-${tier}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier)
     VALUES (uuid_generate_v4(), $1, 'x', 'Sec', $2, 'user', $3)
     RETURNING id`,
    [email, tier.slice(0, 20), tier]
  );
  const id = result.rows[0].id;
  const token = generateToken({ userId: id, email, role: 'user' });
  return { id, token };
}

beforeAll(async () => {
  if (forceSkip) return;
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
  } catch {
    dbAvailable = false;
  }
});

afterAll(async () => {
  await pool.end().catch(() => undefined);
});

describe('subscription helpers', () => {
  it('recognizes premium tiers and expiry', () => {
    expect(isPremiumTier('premium_monthly')).toBe(true);
    expect(isPremiumTier('free')).toBe(false);
    expect(isSubscriptionActive('premium_monthly', null)).toBe(true);
    expect(
      isSubscriptionActive('premium_monthly', new Date(Date.now() - 60_000))
    ).toBe(false);
    expect(
      isSubscriptionActive('premium_monthly', new Date(Date.now() + 60_000))
    ).toBe(true);
  });
});

describe('server-side premium gates', () => {
  itDb('free users cannot start mock exams', async () => {
    const free = await createUser('free');
    const res = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${free.token}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 });
    expect(res.status).toBe(403);
    expect(JSON.stringify(res.body)).toMatch(/premium/i);
  });

  itDb('premium users can start mock exams', async () => {
    const premium = await createUser('premium_monthly');
    const res = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${premium.token}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 });
    expect(res.status).toBe(201);
  });

  itDb('free users can still start daily quiz', async () => {
    const free = await createUser('free');
    const res = await request(app)
      .post('/api/exams/daily-quiz/start')
      .set('Authorization', `Bearer ${free.token}`)
      .send({ certificationId: CERT_ID });
    // May be 201 or 409 if already completed today — must not be 403.
    expect(res.status).not.toBe(403);
    expect([201, 409, 400].includes(res.status)).toBe(true);
  });

  itDb('free users cannot list bookmarks or missed questions', async () => {
    const free = await createUser('free');
    const bookmarks = await request(app)
      .get('/api/bookmarks')
      .set('Authorization', `Bearer ${free.token}`);
    expect(bookmarks.status).toBe(403);

    const missed = await request(app)
      .get('/api/progress/missed-questions')
      .set('Authorization', `Bearer ${free.token}`);
    expect(missed.status).toBe(403);

    const knowledge = await request(app)
      .get(`/api/progress/knowledge-area?certificationId=${CERT_ID}`)
      .set('Authorization', `Bearer ${free.token}`);
    expect(knowledge.status).toBe(403);
  });

  itDb('expired premium is treated as free', async () => {
    const email = `sec-expired-${Date.now()}@example.com`;
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier, subscription_expires_at)
       VALUES (uuid_generate_v4(), $1, 'x', 'Sec', 'Expired', 'user', 'premium_monthly', NOW() - INTERVAL '1 day')
       RETURNING id`,
      [email]
    );
    const token = generateToken({
      userId: result.rows[0].id,
      email,
      role: 'user',
    });

    const res = await request(app)
      .post('/api/exams/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ certificationId: CERT_ID, totalQuestions: 2 });
    expect(res.status).toBe(403);
  });
});
