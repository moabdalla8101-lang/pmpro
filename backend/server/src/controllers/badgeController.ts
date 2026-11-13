import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import {
  calendarDaysBetween,
  pgDateToYmd,
  sanitizeLocalDate,
  sanitizeTimeZone,
} from '../utils/userTimeZone';

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

async function resolveTodayLocal(req: AuthRequest): Promise<string> {
  const fromBody = sanitizeLocalDate(req.body?.localDate);
  if (fromBody) return fromBody;

  const timeZone = sanitizeTimeZone(req.body?.timeZone ?? req.query?.timeZone);
  try {
    const result = await pool.query(
      `SELECT (CURRENT_TIMESTAMP AT TIME ZONE $1)::date::text AS today`,
      [timeZone]
    );
    return result.rows[0]?.today || new Date().toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export async function updateStreak(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const existing = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [req.user!.userId]
    );

    // Streak day boundaries follow the user's timezone (client localDate / IANA tz),
    // not the server's UTC clock.
    const today = await resolveTodayLocal(req);

    if (existing.rows.length === 0) {
      const id = uuidv4();
      await pool.query(
        `INSERT INTO streaks (id, user_id, current_streak, longest_streak, last_activity_date)
         VALUES ($1, $2, 1, 1, $3::date)`,
        [id, req.user!.userId, today]
      );
    } else {
      const streak = existing.rows[0];
      const lastActivity =
        pgDateToYmd(streak.last_activity_date) || today;
      const daysDiff = calendarDaysBetween(lastActivity, today);

      let newStreak = streak.current_streak;
      if (daysDiff === 1) {
        newStreak = streak.current_streak + 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }
      // daysDiff === 0 → same local day; keep streak, refresh last_activity_date

      const longestStreak = Math.max(newStreak, streak.longest_streak);

      await pool.query(
        `UPDATE streaks
         SET current_streak = $1,
             longest_streak = $2,
             last_activity_date = $3::date
         WHERE user_id = $4`,
        [newStreak, longestStreak, today, req.user!.userId]
      );
    }

    const updatedStreak = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [req.user!.userId]
    );

    const currentStreak = updatedStreak.rows[0].current_streak;
    const badgeMilestones = [7, 30, 60, 90, 180, 365];

    for (const milestone of badgeMilestones) {
      if (currentStreak === milestone) {
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

    res.json({
      message: 'Streak updated successfully',
      localDate: today,
      timeZone: sanitizeTimeZone(req.body?.timeZone ?? req.query?.timeZone),
    });
  } catch (error) {
    next(error);
  }
}
