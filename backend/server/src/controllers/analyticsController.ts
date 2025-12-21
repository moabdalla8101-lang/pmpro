import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function getUserAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    // Overall stats
    const progressResult = await pool.query(
      `SELECT 
         total_questions_answered,
         correct_answers,
         accuracy,
         last_activity_at
       FROM user_progress
       WHERE user_id = $1 AND certification_id = $2`,
      [req.user!.userId, certificationId]
    );

    // Streak
    const streakResult = await pool.query(
      'SELECT current_streak, longest_streak FROM streaks WHERE user_id = $1',
      [req.user!.userId]
    );

    // Recent activity
    const activityResult = await pool.query(
      `SELECT DATE(answered_at) as date, COUNT(*) as count
       FROM user_answers
       WHERE user_id = $1
       GROUP BY DATE(answered_at)
       ORDER BY date DESC
       LIMIT 30`,
      [req.user!.userId]
    );

    res.json({
      progress: progressResult.rows[0] || null,
      streak: streakResult.rows[0] || { current_streak: 0, longest_streak: 0 },
      recentActivity: activityResult.rows
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    
    // Active users (last 30 days)
    const activeUsersResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as active
       FROM user_answers
       WHERE answered_at > NOW() - INTERVAL '30 days'`
    );

    // Total questions answered
    const questionsResult = await pool.query(
      'SELECT COUNT(*) as total FROM user_answers'
    );

    res.json({
      totalUsers: parseInt(usersResult.rows[0].total),
      activeUsers: parseInt(activeUsersResult.rows[0].active),
      totalQuestionsAnswered: parseInt(questionsResult.rows[0].total)
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsageAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        DATE(answered_at) as date,
        COUNT(*) as questions_answered,
        COUNT(DISTINCT user_id) as active_users
      FROM user_answers
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND answered_at >= $${paramCount++}`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND answered_at <= $${paramCount++}`;
      params.push(endDate);
    }

    query += ' GROUP BY DATE(answered_at) ORDER BY date DESC';

    const result = await pool.query(query, params);

    res.json({ usage: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getRevenueReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      `SELECT 
         subscription_tier,
         COUNT(*) as user_count
       FROM users
       WHERE subscription_tier != 'free'
       GROUP BY subscription_tier`
    );

    // Calculate estimated revenue (simplified)
    const tierPricing: { [key: string]: number } = {
      premium_monthly: 12.49,
      premium_semi_annual: 49.99 / 6,
      cram_time: 9.99
    };

    const revenue = result.rows.reduce((total: number, row: any) => {
      const monthlyPrice = tierPricing[row.subscription_tier] || 0;
      return total + (monthlyPrice * parseInt(row.user_count));
    }, 0);

    res.json({
      subscriptions: result.rows,
      estimatedMonthlyRevenue: revenue
    });
  } catch (error) {
    next(error);
  }
}


