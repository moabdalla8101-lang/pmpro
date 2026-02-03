import { Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function getSubscription(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      `SELECT subscription_tier, subscription_expires_at 
       FROM users WHERE id = $1`,
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('User not found'));
    }

    const user = result.rows[0];
    res.json({
      tier: user.subscription_tier,
      expiresAt: user.subscription_expires_at,
      isActive: !user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date()
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSubscription(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { tier, expiresAt } = req.body;

    await pool.query(
      `UPDATE users 
       SET subscription_tier = $1, 
           subscription_expires_at = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [tier, expiresAt, req.user!.userId]
    );

    res.json({ message: 'Subscription updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function cancelSubscription(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await pool.query(
      `UPDATE users 
       SET subscription_tier = 'free',
       subscription_expires_at = NULL,
       updated_at = NOW()
       WHERE id = $1`,
      [req.user!.userId]
    );

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Sync subscription from RevenueCat
 * Called by mobile app after purchase or restore
 */
export async function syncSubscription(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { tier, expiresAt } = req.body;

    // Validate tier
    const validTiers = ['free', 'premium_monthly', 'premium_semi_annual', 'premium_annual', 'cram_time'];
    if (tier && !validTiers.includes(tier)) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    // Parse expiration date
    const expirationDate = expiresAt ? new Date(expiresAt) : null;

    // Update subscription
    await pool.query(
      `UPDATE users 
       SET subscription_tier = $1, 
           subscription_expires_at = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [tier || 'free', expirationDate, req.user!.userId]
    );

    // Return updated subscription status
    const result = await pool.query(
      `SELECT subscription_tier, subscription_expires_at 
       FROM users WHERE id = $1`,
      [req.user!.userId]
    );

    const user = result.rows[0];
    res.json({
      tier: user.subscription_tier,
      expiresAt: user.subscription_expires_at,
      isActive: !user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date()
    });
  } catch (error) {
    next(error);
  }
}


