import { Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import { LEARNER_ATTEMPTS_CTE } from '../utils/learnerAttempts';
import { hydrateQuestions } from '../serializers/hydrateQuestion';
import { assertNoLearnerLeaks } from '../serializers/questionSerializers';
import { gradeQuestionResponse } from '../utils/gradeQuestionResponse';

async function ensureExamSchema(client: { query: (sql: string, params?: any[]) => Promise<any> }) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS question_attempts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      is_correct BOOLEAN NOT NULL,
      selected_answer_ids UUID[] NOT NULL DEFAULT '{}',
      response_json JSONB,
      answered_at TIMESTAMP NOT NULL DEFAULT NOW(),
      exam_id UUID REFERENCES mock_exams(id) ON DELETE CASCADE
    )
  `);
  await client.query(`
    ALTER TABLE question_attempts
      ADD COLUMN IF NOT EXISTS exam_id UUID REFERENCES mock_exams(id) ON DELETE CASCADE
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS exam_questions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      exam_id UUID NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
      question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      UNIQUE (exam_id, question_id),
      UNIQUE (exam_id, position)
    )
  `);
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_exam_question
      ON question_attempts(exam_id, question_id)
      WHERE exam_id IS NOT NULL
  `);
}

async function selectRandomQuestionRows(certificationId: string, limit: number) {
  const result = await pool.query(
    `SELECT * FROM questions
     WHERE certification_id = $1
       AND is_active = true
     ORDER BY RANDOM()
     LIMIT $2`,
    [certificationId, limit]
  );
  return result.rows;
}

async function persistExamQuestions(
  client: { query: (sql: string, params?: any[]) => Promise<any> },
  examId: string,
  questionRows: any[]
) {
  for (let i = 0; i < questionRows.length; i++) {
    await client.query(
      `INSERT INTO exam_questions (id, exam_id, question_id, position)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (exam_id, question_id) DO NOTHING`,
      [uuidv4(), examId, questionRows[i].id, i]
    );
  }
}

async function loadAssignedQuestionRows(examId: string) {
  const result = await pool.query(
    `SELECT q.*
     FROM exam_questions eq
     JOIN questions q ON q.id = eq.question_id
     WHERE eq.exam_id = $1
     ORDER BY eq.position ASC`,
    [examId]
  );
  return result.rows;
}

async function sealedExamQuestionsPayload(questionRows: any[]) {
  const questions = await hydrateQuestions(questionRows, { admin: false });
  const payload = { questions };
  assertNoLearnerLeaks(payload, 'exam questions');
  return questions;
}

function mapExam(exam: any) {
  return {
    id: exam.id,
    userId: exam.user_id,
    certificationId: exam.certification_id,
    startedAt: exam.started_at,
    completedAt: exam.completed_at,
    totalQuestions: exam.total_questions,
    correctAnswers: exam.correct_answers,
    score: exam.score,
    examType: exam.exam_type,
  };
}

export async function startExam(req: AuthRequest, res: Response, next: NextFunction) {
  const client = await pool.connect();
  try {
    const { certificationId, totalQuestions, questionIds } = req.body;
    const count = parseInt(String(totalQuestions), 10);

    if (!certificationId || !Number.isFinite(count) || count <= 0) {
      return next(new ValidationError('certificationId and totalQuestions are required'));
    }

    let questionRows: any[];
    if (Array.isArray(questionIds) && questionIds.length > 0) {
      const uniqueIds = [...new Set(questionIds.map(String))];
      if (uniqueIds.length !== count) {
        return next(
          new ValidationError('questionIds length must match totalQuestions and be unique')
        );
      }
      const result = await pool.query(
        `SELECT * FROM questions
         WHERE certification_id = $1
           AND is_active = true
           AND id = ANY($2::uuid[])`,
        [certificationId, uniqueIds]
      );
      if (result.rows.length !== uniqueIds.length) {
        return next(new ValidationError('One or more questionIds are invalid for this certification'));
      }
      const byId = new Map(result.rows.map((q: any) => [q.id, q]));
      questionRows = uniqueIds.map((id) => byId.get(id));
    } else {
      questionRows = await selectRandomQuestionRows(certificationId, count);
      if (questionRows.length < count) {
        return next(
          new ValidationError(
            `Not enough questions available (requested ${count}, found ${questionRows.length})`
          )
        );
      }
    }

    await client.query('BEGIN');
    await ensureExamSchema(client);

    const examId = uuidv4();
    await client.query(
      `INSERT INTO mock_exams (id, user_id, certification_id, started_at, total_questions, correct_answers, exam_type)
       VALUES ($1, $2, $3, NOW(), $4, 0, 'mock_exam')`,
      [examId, req.user!.userId, certificationId, questionRows.length]
    );

    await persistExamQuestions(client, examId, questionRows);
    await client.query('COMMIT');

    const questions = await sealedExamQuestionsPayload(questionRows);
    res.status(201).json({
      examId,
      startedAt: new Date(),
      totalQuestions: questions.length,
      questions,
    });
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

export async function startDailyQuiz(req: AuthRequest, res: Response, next: NextFunction) {
  const client = await pool.connect();
  try {
    const { certificationId } = req.body;
    const DAILY_QUIZ_QUESTIONS = 10;

    if (!certificationId) {
      return next(new ValidationError('certificationId is required'));
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingQuiz = await pool.query(
      `SELECT * FROM mock_exams
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
      return res.status(400).json({
        error: 'Daily quiz already completed',
        examId: existingQuiz.rows[0].id,
      });
    }

    // Resume incomplete quiz with its persisted assignment
    if (existingQuiz.rows.length > 0 && !existingQuiz.rows[0].completed_at) {
      const exam = existingQuiz.rows[0];
      const assigned = await loadAssignedQuestionRows(exam.id);
      if (assigned.length > 0) {
        const questions = await sealedExamQuestionsPayload(assigned);
        return res.status(200).json({
          examId: exam.id,
          startedAt: exam.started_at,
          questionIds: questions.map((q: any) => q.id),
          totalQuestions: questions.length,
          questions,
          resumed: true,
        });
      }
    }

    const questionRows = await selectRandomQuestionRows(certificationId, DAILY_QUIZ_QUESTIONS);
    if (questionRows.length < DAILY_QUIZ_QUESTIONS) {
      return res.status(400).json({ error: 'Not enough questions available for daily quiz' });
    }

    await client.query('BEGIN');
    await ensureExamSchema(client);

    const examId = uuidv4();
    await client.query(
      `INSERT INTO mock_exams (id, user_id, certification_id, started_at, total_questions, correct_answers, exam_type)
       VALUES ($1, $2, $3, NOW(), $4, 0, 'daily_quiz')`,
      [examId, req.user!.userId, certificationId, DAILY_QUIZ_QUESTIONS]
    );
    await persistExamQuestions(client, examId, questionRows);
    await client.query('COMMIT');

    const questions = await sealedExamQuestionsPayload(questionRows);
    res.status(201).json({
      examId,
      startedAt: new Date(),
      questionIds: questions.map((q: any) => q.id),
      totalQuestions: questions.length,
      questions,
    });
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
        canTake: true,
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
      totalQuestions: quiz.total_questions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getWeeklyDailyQuizCompletions(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { certificationId, startDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

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
      ),
    ]);

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
      completions: Array.from(allDates).map((date) => ({ date })).sort(),
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
    await ensureExamSchema(client);

    const examResult = await client.query(
      'SELECT * FROM mock_exams WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return next(new NotFoundError('Exam not found'));
    }

    const exam = examResult.rows[0];
    if (exam.completed_at) {
      await client.query('ROLLBACK');
      return next(new ValidationError('Exam has already been submitted'));
    }

    const assignedResult = await client.query(
      `SELECT eq.question_id, eq.position, q.question_type, q.question_metadata
       FROM exam_questions eq
       JOIN questions q ON q.id = eq.question_id
       WHERE eq.exam_id = $1
       ORDER BY eq.position ASC`,
      [id]
    );

    if (assignedResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return next(new ValidationError('Exam has no assigned questions'));
    }

    const assignedIds = assignedResult.rows.map((r: any) => r.question_id as string);
    const assignedSet = new Set(assignedIds);
    const assignedMeta = new Map(
      assignedResult.rows.map((r: any) => [
        r.question_id,
        { questionType: r.question_type, questionMetadata: r.question_metadata },
      ])
    );

    const seenQuestionIds = new Set<string>();
    for (const answer of answers) {
      if (!answer?.questionId) {
        await client.query('ROLLBACK');
        return next(new ValidationError('Each answer requires questionId'));
      }
      if (seenQuestionIds.has(answer.questionId)) {
        await client.query('ROLLBACK');
        return next(new ValidationError('Duplicate question IDs are not allowed'));
      }
      seenQuestionIds.add(answer.questionId);
      if (!assignedSet.has(answer.questionId)) {
        await client.query('ROLLBACK');
        return next(new ValidationError(`Question ${answer.questionId} is not part of this exam`));
      }
    }

    if (seenQuestionIds.size !== assignedIds.length) {
      await client.query('ROLLBACK');
      return next(
        new ValidationError(
          `Expected answers for ${assignedIds.length} questions, received ${seenQuestionIds.size}`
        )
      );
    }

    let correctCount = 0;

    for (const answer of answers) {
      const answersResult = await client.query(
        'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
        [answer.questionId]
      );
      const meta = assignedMeta.get(answer.questionId)!;

      let graded;
      try {
        graded = gradeQuestionResponse({
          questionType: meta.questionType,
          questionMetadata: meta.questionMetadata,
          answers: answersResult.rows,
          answerId: answer.answerId,
          answerIds: answer.answerIds,
          dragMatches: answer.dragMatches,
        });
      } catch (err: any) {
        await client.query('ROLLBACK');
        return next(new ValidationError(err.message || 'Invalid answer payload'));
      }

      if (graded.selectedIds.length > 0) {
        for (const selectedId of graded.selectedIds) {
          if (!answersResult.rows.some((a: any) => a.id === selectedId)) {
            await client.query('ROLLBACK');
            return next(new ValidationError('Answer does not belong to question'));
          }
        }
      }

      if (graded.isCorrect) {
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
          graded.isCorrect,
          graded.selectedIds,
          JSON.stringify({ ...graded.responseJson, examId: id }),
          id,
        ]
      );

      const auditAnswerId = graded.selectedIds[0] || answersResult.rows[0]?.id;
      if (auditAnswerId) {
        await client.query(
          `INSERT INTO user_answers (id, user_id, question_id, answer_id, is_correct, answered_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [uuidv4(), req.user!.userId, answer.questionId, auditAnswerId, graded.isCorrect]
        );
      }
    }

    const totalQuestions = assignedIds.length;
    const score = (correctCount / totalQuestions) * 100;

    await client.query(
      `UPDATE mock_exams
       SET completed_at = NOW(),
           score = $1,
           correct_answers = $2,
           total_questions = $3
       WHERE id = $4`,
      [score, correctCount, totalQuestions, id]
    );

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
      await client.query(
        `INSERT INTO user_progress (id, user_id, certification_id, total_questions_answered, correct_answers, accuracy, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [uuidv4(), req.user!.userId, certificationId, totalAnswered, totalCorrect, overallAccuracy]
      );
    }

    await client.query('COMMIT');
    res.json({
      examId: id,
      score,
      correctAnswers: correctCount,
      totalQuestions,
    });
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

    const exam = result.rows[0];
    const payload: any = mapExam(exam);

    if (!exam.completed_at) {
      const assigned = await loadAssignedQuestionRows(id);
      payload.questions = await sealedExamQuestionsPayload(assigned);
    }

    res.json(payload);
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

    const exams = result.rows.map((exam: any) => ({
      ...mapExam(exam),
      score:
        exam.score !== null && exam.score !== undefined
          ? typeof exam.score === 'number'
            ? exam.score
            : parseFloat(exam.score) || 0
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

    if (!exam.completed_at) {
      return res.status(403).json({
        error: 'Exam review is available only after the exam is submitted',
      });
    }

    const attemptsResult = await pool.query(
      `SELECT
         qa.id,
         qa.user_id,
         qa.question_id,
         qa.is_correct,
         qa.selected_answer_ids,
         qa.response_json,
         qa.answered_at,
         qa.exam_id,
         eq.position,
         q.question_text,
         q.explanation,
         q.difficulty,
         q.question_type,
         q.knowledge_area_id,
         ka.name as knowledge_area_name
       FROM question_attempts qa
       JOIN exam_questions eq ON eq.exam_id = qa.exam_id AND eq.question_id = qa.question_id
       JOIN questions q ON q.id = qa.question_id
       LEFT JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
       WHERE qa.exam_id = $1
         AND qa.user_id = $2
       ORDER BY eq.position ASC`,
      [id, req.user!.userId]
    );

    const answers = attemptsResult.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      questionId: row.question_id,
      answerId: row.selected_answer_ids?.[0] || null,
      answerIds: row.selected_answer_ids || [],
      responseJson: row.response_json,
      isCorrect: row.is_correct,
      answeredAt: row.answered_at,
      questionText: row.question_text,
      explanation: row.explanation,
      knowledgeAreaId: row.knowledge_area_id,
      knowledgeAreaName: row.knowledge_area_name,
      difficulty: row.difficulty,
      questionType: row.question_type,
      position: row.position,
    }));

    res.json({
      exam: mapExam(exam),
      answers,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const examResult = await pool.query(
      'SELECT id FROM mock_exams WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (examResult.rows.length === 0) {
      return next(new NotFoundError('Exam not found'));
    }

    // CASCADE removes exam_questions and question_attempts linked by exam_id
    await pool.query('DELETE FROM mock_exams WHERE id = $1 AND user_id = $2', [
      id,
      req.user!.userId,
    ]);

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
}
