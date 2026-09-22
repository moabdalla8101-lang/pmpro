import { Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError, SubscriptionTier } from '@pmp-app/shared';
import { AuthRequest } from './auth';
import { pool } from '../db/connection';

const PREMIUM_TIERS = new Set<string>([
  SubscriptionTier.PREMIUM_MONTHLY,
  SubscriptionTier.PREMIUM_SEMI_ANNUAL,
  'premium_annual',
  SubscriptionTier.CRAM_TIME,
  'premium', // legacy
]);

export function isPremiumTier(tier: string | null | undefined): boolean {
  if (!tier) return false;
  return PREMIUM_TIERS.has(tier.toLowerCase());
}

export function isSubscriptionActive(
  tier: string | null | undefined,
  expiresAt?: Date | string | null
): boolean {
  if (!isPremiumTier(tier)) return false;
  if (!expiresAt) return true;
  const expirationDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expirationDate > new Date();
}

/**
 * Server-side premium gate. Loads tier from DB — never trusts JWT or client body.
 * Admins bypass for support/ops tooling.
 */
export async function requirePremium(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.userId) {
      return next(new UnauthorizedError());
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const result = await pool.query(
      `SELECT subscription_tier, subscription_expires_at
       FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return next(new UnauthorizedError('User not found'));
    }

    const row = result.rows[0];
    if (!isSubscriptionActive(row.subscription_tier, row.subscription_expires_at)) {
      return next(
        new ForbiddenError('Premium subscription required for this feature')
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
