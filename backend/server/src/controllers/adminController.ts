import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { pool } from '../db/connection';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, subscriptionTier } = req.query;

    let query = 'SELECT id, email, first_name, last_name, role, subscription_tier, created_at FROM users WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (email ILIKE $${paramCount++} OR first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount++})`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (subscriptionTier) {
      query += ` AND subscription_tier = $${paramCount++}`;
      params.push(subscriptionTier);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await pool.query(query, params);

    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, email, first_name, last_name, role, subscription_tier, 
              subscription_expires_at, preferences, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('User not found'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

