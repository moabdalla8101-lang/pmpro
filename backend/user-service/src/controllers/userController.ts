import { Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, role, subscription_tier, 
              subscription_expires_at, created_at, updated_at, preferences
       FROM users WHERE id = $1`,
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('User not found'));
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      subscriptionTier: user.subscription_tier,
      subscriptionExpiresAt: user.subscription_expires_at,
      preferences: user.preferences,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { firstName, lastName } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, first_name, last_name, role, subscription_tier, updated_at`,
      [firstName, lastName, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('User not found'));
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      subscriptionTier: user.subscription_tier,
      updatedAt: user.updated_at
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserPreferences(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      'SELECT preferences FROM users WHERE id = $1',
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('User not found'));
    }

    res.json({ preferences: result.rows[0].preferences || {} });
  } catch (error) {
    next(error);
  }
}

export async function updateUserPreferences(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { preferences } = req.body;

    await pool.query(
      'UPDATE users SET preferences = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(preferences), req.user!.userId]
    );

    res.json({ preferences });
  } catch (error) {
    next(error);
  }
}


