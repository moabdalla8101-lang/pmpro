import { Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function getUserProgress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    let query = 'SELECT * FROM user_progress WHERE user_id = $1';
    const params: any[] = [req.user!.userId];

    if (certificationId) {
      query += ' AND certification_id = $2';
      params.push(certificationId);
    }

    const result = await pool.query(query, params);

    // Transform to camelCase and ensure numeric types
    // Accuracy is stored as decimal (0.0-1.0), convert to percentage (0-100)
    const progress = result.rows.map((row: any) => {
      let accuracy = 0;
      if (row.accuracy !== null && row.accuracy !== undefined) {
        if (typeof row.accuracy === 'number') {
          accuracy = row.accuracy;
        } else {
          accuracy = parseFloat(row.accuracy || '0');
        }
        // If accuracy is less than 1, it's a decimal (0.0-1.0), convert to percentage
        if (accuracy <= 1 && accuracy >= 0) {
          accuracy = accuracy * 100;
        }
      }
      
      return {
        id: row.id,
        userId: row.user_id,
        certificationId: row.certification_id,
        totalQuestionsAnswered: parseInt(row.total_questions_answered || '0', 10),
        correctAnswers: parseInt(row.correct_answers || '0', 10),
        accuracy: accuracy,
        lastActivityAt: row.last_activity_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    res.json({ progress });
  } catch (error) {
    next(error);
  }
}

export async function updateUserProgress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId, totalQuestionsAnswered, correctAnswers } = req.body;

    const accuracy = correctAnswers / totalQuestionsAnswered;

    const existing = await pool.query(
      'SELECT id FROM user_progress WHERE user_id = $1 AND certification_id = $2',
      [req.user!.userId, certificationId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE user_progress 
         SET total_questions_answered = $1,
             correct_answers = $2,
             accuracy = $3,
             last_activity_at = NOW(),
             updated_at = NOW()
         WHERE user_id = $4 AND certification_id = $5`,
        [totalQuestionsAnswered, correctAnswers, accuracy, req.user!.userId, certificationId]
      );
    } else {
      const id = uuidv4();
      await pool.query(
        `INSERT INTO user_progress (id, user_id, certification_id, total_questions_answered, correct_answers, accuracy, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [id, req.user!.userId, certificationId, totalQuestionsAnswered, correctAnswers, accuracy]
      );
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function recordAnswer(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { questionId, answerId } = req.body;

    // Get answer to check if correct
    const answerResult = await pool.query(
      'SELECT is_correct FROM answers WHERE id = $1',
      [answerId]
    );

    if (answerResult.rows.length === 0) {
      return next(new NotFoundError('Answer not found'));
    }

    const isCorrect = answerResult.rows[0].is_correct;
    const userAnswerId = uuidv4();

    await pool.query(
      `INSERT INTO user_answers (id, user_id, question_id, answer_id, is_correct, answered_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userAnswerId, req.user!.userId, questionId, answerId, isCorrect]
    );

    res.json({ isCorrect, userAnswerId });
  } catch (error) {
    next(error);
  }
}

export async function getPerformanceByKnowledgeArea(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    const result = await pool.query(
      `SELECT 
         ka.id as knowledge_area_id,
         ka.name as knowledge_area_name,
         COUNT(ua.id) as total_answered,
         SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct_answers,
         CASE 
           WHEN COUNT(ua.id) > 0 
           THEN (SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::float / COUNT(ua.id)::float * 100)
           ELSE 0 
         END as accuracy
       FROM knowledge_areas ka
       LEFT JOIN questions q ON ka.id = q.knowledge_area_id
       LEFT JOIN user_answers ua ON q.id = ua.question_id AND ua.user_id = $1
       WHERE ka.certification_id = $2
       GROUP BY ka.id, ka.name
       ORDER BY ka."order"`,
      [req.user!.userId, certificationId]
    );

    // Transform to camelCase and ensure numeric types
    // Accuracy is already calculated as percentage in the query (multiplied by 100)
    const performance = result.rows.map((row: any) => {
      let accuracy = parseFloat(row.accuracy || '0');
      // The query already multiplies by 100, so accuracy should be 0-100
      // But handle edge case if it's still a decimal
      if (accuracy > 0 && accuracy <= 1) {
        accuracy = accuracy * 100;
      }
      
      return {
        knowledgeAreaId: row.knowledge_area_id,
        knowledgeAreaName: row.knowledge_area_name,
        totalAnswered: parseInt(row.total_answered || '0', 10),
        correctAnswers: parseInt(row.correct_answers || '0', 10),
        accuracy: accuracy,
      };
    });

    res.json({ performance });
  } catch (error) {
    next(error);
  }
}


