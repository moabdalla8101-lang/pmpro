import { Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function startExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId, totalQuestions } = req.body;

    const examId = uuidv4();

    await pool.query(
      `INSERT INTO mock_exams (id, user_id, certification_id, started_at, total_questions, correct_answers)
       VALUES ($1, $2, $3, NOW(), $4, 0)`,
      [examId, req.user!.userId, certificationId, totalQuestions]
    );

    res.status(201).json({ examId, startedAt: new Date() });
  } catch (error) {
    next(error);
  }
}

export async function submitExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    // Get exam
    const examResult = await pool.query(
      'SELECT * FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      return next(new NotFoundError('Exam not found'));
    }

    // Calculate score
    let correctCount = 0;
    for (const answer of answers) {
      const answerResult = await pool.query(
        'SELECT is_correct FROM answers WHERE id = $1',
        [answer.answerId]
      );

      if (answerResult.rows.length > 0 && answerResult.rows[0].is_correct) {
        correctCount++;
      }

      // Record answer
      const userAnswerId = uuidv4();
      await pool.query(
        `INSERT INTO user_answers (id, user_id, question_id, answer_id, is_correct, answered_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [
          userAnswerId,
          req.user!.userId,
          answer.questionId,
          answer.answerId,
          (answerResult.rows[0] && answerResult.rows[0].is_correct) || false
        ]
      );
    }

    const score = (correctCount / answers.length) * 100;

    // Update exam
    await pool.query(
      `UPDATE mock_exams 
       SET completed_at = NOW(),
           score = $1,
           correct_answers = $2
       WHERE id = $3`,
      [score, correctCount, id]
    );

    // Update user progress
    const exam = examResult.rows[0];
    const certificationId = exam.certification_id;
    
    // Get current progress totals
    const progressResult = await pool.query(
      `SELECT 
         COUNT(*) as total_answered,
         SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_count
       FROM user_answers
       WHERE user_id = $1`,
      [req.user!.userId]
    );

    const firstRow = progressResult.rows[0] || {};
    const totalAnswered = parseInt(firstRow.total_answered || '0', 10);
    const totalCorrect = parseInt(firstRow.correct_count || '0', 10);
    const overallAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) : 0;

    // Update or create user progress
    const existingProgress = await pool.query(
      'SELECT id FROM user_progress WHERE user_id = $1 AND certification_id = $2',
      [req.user!.userId, certificationId]
    );

    if (existingProgress.rows.length > 0) {
      await pool.query(
        `UPDATE user_progress 
         SET total_questions_answered = $1,
             correct_answers = $2,
             accuracy = $3,
             last_activity_at = NOW(),
             updated_at = NOW()
         WHERE user_id = $4 AND certification_id = $5`,
        [totalAnswered, totalCorrect, overallAccuracy, req.user!.userId, certificationId]
      );
    } else {
      const progressId = uuidv4();
      await pool.query(
        `INSERT INTO user_progress (id, user_id, certification_id, total_questions_answered, correct_answers, accuracy, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [progressId, req.user!.userId, certificationId, totalAnswered, totalCorrect, overallAccuracy]
      );
    }

    res.json({ examId: id, score, correctAnswers: correctCount, totalQuestions: answers.length });
  } catch (error) {
    next(error);
  }
}

export async function getExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('Exam not found'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function getUserExams(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      `SELECT * FROM mock_exams 
       WHERE user_id = $1 
       ORDER BY started_at DESC 
       LIMIT 50`,
      [req.user!.userId]
    );

    res.json({ exams: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getExamReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const examResult = await pool.query(
      'SELECT * FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      return next(new NotFoundError('Exam not found'));
    }

    // Get all answers for this exam
    const answersResult = await pool.query(
      `SELECT 
         ua.*,
         q.question_text,
         q.explanation,
         a.answer_text,
         a.is_correct
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.id
       JOIN answers a ON ua.answer_id = a.id
       WHERE ua.user_id = $1
       AND ua.answered_at >= (SELECT started_at FROM mock_exams WHERE id = $2)
       AND ua.answered_at <= COALESCE((SELECT completed_at FROM mock_exams WHERE id = $2), NOW())
       ORDER BY ua.answered_at`,
      [req.user!.userId, id]
    );

    res.json({
      exam: examResult.rows[0],
      answers: answersResult.rows
    });
  } catch (error) {
    next(error);
  }
}


