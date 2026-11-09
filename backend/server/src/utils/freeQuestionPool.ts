import { pool } from '../db/connection';
import { AuthRequest } from '../middleware/auth';
import { isSubscriptionActive } from '../middleware/subscription';

/** Free users may browse/answer this many questions per knowledge area. */
export const FREE_QUESTIONS_PER_KNOWLEDGE_AREA = 10;

/**
 * Stable free-pool selection: first N active questions per knowledge area
 * (oldest first, then id).
 */
export function freePoolSubquery(certificationParam: string): string {
  return `
    SELECT id FROM (
      SELECT q.id,
             ROW_NUMBER() OVER (
               PARTITION BY q.knowledge_area_id
               ORDER BY q.created_at ASC NULLS LAST, q.id ASC
             ) AS rn
      FROM questions q
      WHERE q.is_active = true
        AND q.certification_id = ${certificationParam}
    ) ranked
    WHERE rn <= ${FREE_QUESTIONS_PER_KNOWLEDGE_AREA}
  `;
}

export async function getFreeQuestionIds(certificationId: string): Promise<string[]> {
  const result = await pool.query(
    `SELECT id FROM (${freePoolSubquery('$1')}) free_ids`,
    [certificationId]
  );
  return result.rows.map((r: { id: string }) => r.id);
}

export async function isQuestionInFreePool(
  questionId: string,
  certificationId: string
): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1 FROM (${freePoolSubquery('$1')}) free_ids WHERE id = $2 LIMIT 1`,
    [certificationId, questionId]
  );
  return result.rows.length > 0;
}

/**
 * True when the requester must be limited to the free question pool.
 * Admins and active premium subscribers get the full bank.
 */
export async function requesterNeedsFreePool(req: AuthRequest): Promise<boolean> {
  if (req.user?.role === 'admin') {
    return false;
  }

  if (!req.user?.userId) {
    return true; // guest
  }

  const result = await pool.query(
    `SELECT subscription_tier, subscription_expires_at
     FROM users WHERE id = $1`,
    [req.user.userId]
  );
  if (result.rows.length === 0) {
    return true;
  }

  const row = result.rows[0];
  return !isSubscriptionActive(row.subscription_tier, row.subscription_expires_at);
}
