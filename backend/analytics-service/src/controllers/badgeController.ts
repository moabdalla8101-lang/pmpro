import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function getUserBadges(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      'SELECT * FROM badges WHERE user_id = $1 ORDER BY earned_at DESC',
      [req.user!.userId]
    );

    res.json({ badges: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getUserStreak(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updateStreak(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const existing = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [req.user!.userId]
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (existing.rows.length === 0) {
      // Create new streak
      const id = uuidv4();
      await pool.query(
        `INSERT INTO streaks (id, user_id, current_streak, longest_streak, last_activity_date)
         VALUES ($1, $2, 1, 1, $3)`,
        [id, req.user!.userId, today]
      );
    } else {
      const streak = existing.rows[0];
      const lastActivity = new Date(streak.last_activity_date);
      lastActivity.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = streak.current_streak;
      if (daysDiff === 1) {
        // Consecutive day
        newStreak = streak.current_streak + 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If daysDiff === 0, same day, don't update

      const longestStreak = Math.max(newStreak, streak.longest_streak);

      await pool.query(
        `UPDATE streaks 
         SET current_streak = $1,
             longest_streak = $2,
             last_activity_date = $3
         WHERE user_id = $4`,
        [newStreak, longestStreak, today, req.user!.userId]
      );
    }

    // Check for badge eligibility
    const updatedStreak = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [req.user!.userId]
    );

    const currentStreak = updatedStreak.rows[0].current_streak;
    const badgeMilestones = [7, 30, 60, 90, 180, 365];

    for (const milestone of badgeMilestones) {
      if (currentStreak === milestone) {
        // Check if badge already exists
        const badgeCheck = await pool.query(
          'SELECT id FROM badges WHERE user_id = $1 AND badge_type = $2',
          [req.user!.userId, `streak_${milestone}`]
        );

        if (badgeCheck.rows.length === 0) {
          const badgeId = uuidv4();
          await pool.query(
            `INSERT INTO badges (id, user_id, badge_type, earned_at)
             VALUES ($1, $2, $3, NOW())`,
            [badgeId, req.user!.userId, `streak_${milestone}`]
          );
        }
      }
    }

    res.json({ message: 'Streak updated successfully' });
  } catch (error) {
    next(error);
  }
}




