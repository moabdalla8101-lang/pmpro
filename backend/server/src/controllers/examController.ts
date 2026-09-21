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
      `INSERT INTO mock_exams (id, user_id, certification_id, started_at, total_questions, correct_answers, exam_type)
       VALUES ($1, $2, $3, NOW(), $4, 0, 'mock_exam')`,
      [examId, req.user!.userId, certificationId, totalQuestions]
    );

    res.status(201).json({ examId, startedAt: new Date() });
  } catch (error) {
    next(error);
  }
}

export async function startDailyQuiz(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.body;
    const DAILY_QUIZ_QUESTIONS = 10;

    // Check if user has already taken today's quiz
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingQuiz = await pool.query(
      `SELECT id, completed_at FROM mock_exams 
       WHERE user_id = $1 
       AND certification_id = $2 
       AND exam_type = 'daily_quiz'
       AND started_at >= $3 
       AND started_at <= $4
       ORDER BY started_at DESC
       LIMIT 1`,
      [req.user!.userId, certificationId, todayStart, todayEnd]
    );

    if (existingQuiz.rows.length > 0 && existingQuiz.rows[0].completed_at) {
      // User has already completed today's quiz
      return res.status(400).json({ 
        error: 'Daily quiz already completed',
        examId: existingQuiz.rows[0].id 
      });
    }

    // Get 10 random questions
    const questionsResult = await pool.query(
      `SELECT id FROM questions 
       WHERE certification_id = $1 
       AND is_active = true 
       ORDER BY RANDOM() 
       LIMIT $2`,
      [certificationId, DAILY_QUIZ_QUESTIONS]
    );

    if (questionsResult.rows.length < DAILY_QUIZ_QUESTIONS) {
      return res.status(400).json({ error: 'Not enough questions available for daily quiz' });
    }

    const examId = uuidv4();

    await pool.query(
      `INSERT INTO mock_exams (id, user_id, certification_id, started_at, total_questions, correct_answers, exam_type)
       VALUES ($1, $2, $3, NOW(), $4, 0, 'daily_quiz')`,
      [examId, req.user!.userId, certificationId, DAILY_QUIZ_QUESTIONS]
    );

    const questionIds = questionsResult.rows.map((row: any) => row.id);

    res.status(201).json({ 
      examId, 
      startedAt: new Date(),
      questionIds,
      totalQuestions: DAILY_QUIZ_QUESTIONS
    });
  } catch (error) {
    next(error);
  }
}

export async function getDailyQuizStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const result = await pool.query(
      `SELECT id, started_at, completed_at, score, correct_answers, total_questions
       FROM mock_exams 
       WHERE user_id = $1 
       AND certification_id = $2 
       AND exam_type = 'daily_quiz'
       AND started_at >= $3 
       AND started_at <= $4
       ORDER BY started_at DESC
       LIMIT 1`,
      [req.user!.userId, certificationId, todayStart, todayEnd]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        hasTakenToday: false,
        canTake: true 
      });
    }

    const quiz = result.rows[0];
    const hasCompleted = quiz.completed_at !== null;

    res.json({
      hasTakenToday: true,
      canTake: !hasCompleted,
      examId: quiz.id,
      startedAt: quiz.started_at,
      completedAt: quiz.completed_at,
      score: quiz.score,
      correctAnswers: quiz.correct_answers,
      totalQuestions: quiz.total_questions
    });
  } catch (error) {
    next(error);
  }
}

export async function getWeeklyDailyQuizCompletions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId, startDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Get completions from multiple sources:
    // 1. Completed exams (daily quiz, practice tests, mock exams)
    // 2. Days with user answers (any practice activity)
    const [examCompletions, answerCompletions] = await Promise.all([
      pool.query(
        `SELECT DATE(completed_at) as date
         FROM mock_exams 
         WHERE user_id = $1 
         AND certification_id = $2 
         AND completed_at IS NOT NULL
         AND completed_at >= $3 
         AND completed_at <= $4
         GROUP BY DATE(completed_at)`,
        [req.user!.userId, certificationId, start, end]
      ),
      pool.query(
        `SELECT DATE(ua.answered_at) as date
         FROM user_answers ua
         JOIN questions q ON ua.question_id = q.id
         WHERE ua.user_id = $1 
         AND q.certification_id = $2
         AND ua.answered_at >= $3 
         AND ua.answered_at <= $4
         GROUP BY DATE(ua.answered_at)`,
        [req.user!.userId, certificationId, start, end]
      )
    ]);

    // Combine and deduplicate dates
    const allDates = new Set<string>();
    
    examCompletions.rows.forEach((row: any) => {
      const date = row.date instanceof Date ? row.date : new Date(row.date);
      allDates.add(date.toISOString().split('T')[0]);
    });
    
    answerCompletions.rows.forEach((row: any) => {
      const date = row.date instanceof Date ? row.date : new Date(row.date);
      allDates.add(date.toISOString().split('T')[0]);
    });

    res.json({
      completions: Array.from(allDates).map(date => ({ date })).sort(),
    });
  } catch (error) {
    next(error);
  }
}

export async function submitExam(req: AuthRequest, res: Response, next: NextFunction) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return next(new ValidationError('answers are required'));
    }

    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS question_attempts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        is_correct BOOLEAN NOT NULL,
        selected_answer_ids UUID[] NOT NULL DEFAULT '{}',
        response_json JSONB,
        answered_at TIMESTAMP NOT NULL DEFAULT NOW(),
        exam_id UUID REFERENCES mock_exams(id) ON DELETE SET NULL
      )
    `);
    await client.query(`
      ALTER TABLE question_attempts
        ADD COLUMN IF NOT EXISTS exam_id UUID REFERENCES mock_exams(id) ON DELETE SET NULL
    `);

    const examResult = await client.query(
      'SELECT * FROM mock_exams WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return next(new NotFoundError('Exam not found'));
    }

    let correctCount = 0;
    for (const answer of answers) {
      const answerResult = await client.query(
        'SELECT is_correct FROM answers WHERE id = $1 AND question_id = $2',
        [answer.answerId, answer.questionId]
      );

      const isCorrect = Boolean(answerResult.rows[0]?.is_correct);
      if (isCorrect) {
        correctCount++;
      }

      const attemptId = uuidv4();
      await client.query(
        `INSERT INTO question_attempts
           (id, user_id, question_id, is_correct, selected_answer_ids, response_json, answered_at, exam_id)
         VALUES ($1, $2, $3, $4, $5::uuid[], $6::jsonb, NOW(), $7)`,
        [
          attemptId,
          req.user!.userId,
          answer.questionId,
          isCorrect,
          [answer.answerId],
          JSON.stringify({
            selectedAnswerIds: [answer.answerId],
            examId: id,
          }),
          id,
        ]
      );

      const userAnswerId = uuidv4();
      await client.query(
        `INSERT INTO user_answers (id, user_id, question_id, answer_id, is_correct, answered_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [userAnswerId, req.user!.userId, answer.questionId, answer.answerId, isCorrect]
      );
    }

    const score = (correctCount / answers.length) * 100;

    await client.query(
      `UPDATE mock_exams
       SET completed_at = NOW(),
           score = $1,
           correct_answers = $2
       WHERE id = $3`,
      [score, correctCount, id]
    );

    const exam = examResult.rows[0];
    const certificationId = exam.certification_id;

    const progressResult = await client.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT
         COUNT(*) as total_answered,
         SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_count
       FROM learner_attempts
       WHERE user_id = $1
         AND question_id IN (
           SELECT id FROM questions WHERE certification_id = $2
         )`,
      [req.user!.userId, certificationId]
    );

    const firstRow = progressResult.rows[0] || {};
    const totalAnswered = parseInt(firstRow.total_answered || '0', 10);
    const totalCorrect = parseInt(firstRow.correct_count || '0', 10);
    const overallAccuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

    const existingProgress = await client.query(
      'SELECT id FROM user_progress WHERE user_id = $1 AND certification_id = $2',
      [req.user!.userId, certificationId]
    );

    if (existingProgress.rows.length > 0) {
      await client.query(
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
      await client.query(
        `INSERT INTO user_progress (id, user_id, certification_id, total_questions_answered, correct_answers, accuracy, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [progressId, req.user!.userId, certificationId, totalAnswered, totalCorrect, overallAccuracy]
      );
    }

    await client.query('COMMIT');
    res.json({ examId: id, score, correctAnswers: correctCount, totalQuestions: answers.length });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // ignore
    }
    next(error);
  } finally {
    client.release();
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

    // Transform to camelCase for API response
    const exam = result.rows[0];
    res.json({
      id: exam.id,
      userId: exam.user_id,
      certificationId: exam.certification_id,
      startedAt: exam.started_at,
      completedAt: exam.completed_at,
      totalQuestions: exam.total_questions,
      correctAnswers: exam.correct_answers,
      score: exam.score,
    });
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

    // Transform to camelCase for API response
    const exams = result.rows.map((exam: any) => ({
      id: exam.id,
      userId: exam.user_id,
      certificationId: exam.certification_id,
      startedAt: exam.started_at,
      completedAt: exam.completed_at,
      totalQuestions: exam.total_questions || 0,
      correctAnswers: exam.correct_answers || 0,
      // Ensure score is a number, default to 0 if null
      score: exam.score !== null && exam.score !== undefined 
        ? (typeof exam.score === 'number' ? exam.score : parseFloat(exam.score) || 0)
        : null,
    }));

    res.json({ exams });
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

    const exam = examResult.rows[0];

    // Do not leak correctness/explanations until the exam is completed
    if (!exam.completed_at) {
      return res.status(403).json({
        error: 'Exam review is available only after the exam is submitted',
      });
    }

    // Get all answers for this exam with knowledge area information
    const answersResult = await pool.query(
      `SELECT 
         ua.*,
         q.question_text,
         q.explanation,
         q.difficulty,
         q.knowledge_area_id,
         ka.name as knowledge_area_name,
         a.answer_text,
         a.is_correct
       FROM user_answers ua
       JOIN questions q ON ua.question_id = q.id
       LEFT JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
       JOIN answers a ON ua.answer_id = a.id
       WHERE ua.user_id = $1
       AND ua.answered_at >= $2
       AND ua.answered_at <= $3
       ORDER BY ua.answered_at`,
      [req.user!.userId, exam.started_at, exam.completed_at]
    );

    // Transform to camelCase for API response
    const answers = answersResult.rows.map((answer: any) => ({
      id: answer.id,
      userId: answer.user_id,
      questionId: answer.question_id,
      answerId: answer.answer_id,
      isCorrect: answer.is_correct,
      answeredAt: answer.answered_at,
      questionText: answer.question_text,
      explanation: answer.explanation,
      answerText: answer.answer_text,
      knowledgeAreaId: answer.knowledge_area_id,
      knowledgeAreaName: answer.knowledge_area_name,
      difficulty: answer.difficulty,
    }));

    res.json({
      exam: {
        id: exam.id,
        userId: exam.user_id,
        certificationId: exam.certification_id,
        startedAt: exam.started_at,
        completedAt: exam.completed_at,
        totalQuestions: exam.total_questions,
        correctAnswers: exam.correct_answers,
        score: exam.score,
      },
      answers
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Verify the exam exists and belongs to the user
    const examResult = await pool.query(
      'SELECT id FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      return next(new NotFoundError('Exam not found'));
    }

    // Delete the exam (cascade will handle related records if foreign keys are set up)
    await pool.query(
      'DELETE FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
}


