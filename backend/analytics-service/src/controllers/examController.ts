import { Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import { LEARNER_ATTEMPTS_CTE } from '../utils/learnerAttempts';

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

/**
 * Legacy microservice path — writes question_attempts only (no user_answers dual-write).
 * Prefer the monolith examController for full assignment/grading.
 */
export async function submitExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return next(new ValidationError('answers are required'));
    }

    const examResult = await pool.query(
      'SELECT * FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      return next(new NotFoundError('Exam not found'));
    }

    const exam = examResult.rows[0];
    if (exam.completed_at) {
      return res.json({
        examId: id,
        score: exam.score,
        correctAnswers: exam.correct_answers,
        totalQuestions: exam.total_questions,
        alreadySubmitted: true,
      });
    }

    let correctCount = 0;
    for (const answer of answers) {
      const answerResult = await pool.query(
        'SELECT is_correct FROM answers WHERE id = $1',
        [answer.answerId]
      );

      const isCorrect = Boolean(answerResult.rows[0]?.is_correct);
      if (isCorrect) correctCount++;

      const selectedIds = answer.answerId ? [answer.answerId] : [];
      await pool.query(
        `INSERT INTO question_attempts
           (id, user_id, question_id, is_correct, selected_answer_ids, response_json, answered_at, exam_id)
         VALUES ($1, $2, $3, $4, $5::uuid[], $6::jsonb, NOW(), $7)`,
        [
          uuidv4(),
          req.user!.userId,
          answer.questionId,
          isCorrect,
          selectedIds,
          JSON.stringify({ selectedAnswerIds: selectedIds, examId: id }),
          id,
        ]
      );
    }

    const score = (correctCount / answers.length) * 100;

    await pool.query(
      `UPDATE mock_exams 
       SET completed_at = NOW(),
           score = $1,
           correct_answers = $2
       WHERE id = $3`,
      [score, correctCount, id]
    );

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

    const answersResult = await pool.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT 
         la.*,
         q.question_text,
         q.explanation
       FROM learner_attempts la
       JOIN questions q ON la.question_id = q.id
       WHERE la.user_id = $1
         AND la.exam_id = $2
       ORDER BY la.answered_at`,
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
