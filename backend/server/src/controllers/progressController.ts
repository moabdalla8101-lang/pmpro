import { Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import { serializeAnsweredQuestionFeedback, serializeAdminQuestion } from '../serializers/questionSerializers';
import { gradeQuestionResponse } from '../utils/gradeQuestionResponse';
import { LEARNER_ATTEMPTS_CTE } from '../utils/learnerAttempts';
import { assertNoClientAuthoritativeScoreFields } from '../utils/authoritativeScoring';

async function ensureQuestionAttemptsTable(client: { query: (sql: string) => Promise<any> }) {
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
}

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
    const { certificationId } = req.body;
    if (!certificationId) {
      return next(new ValidationError('certificationId is required'));
    }

    // Ignore any client-supplied counts/accuracy — recompute from authoritative attempts.
    try {
      assertNoClientAuthoritativeScoreFields(req.body, 'Progress update');
    } catch (err: any) {
      return next(new ValidationError(err.message));
    }

    const progressResult = await pool.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT
         COUNT(*)::int as total_answered,
         COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)::int as correct_count
       FROM learner_attempts
       WHERE user_id = $1
         AND question_id IN (SELECT id FROM questions WHERE certification_id = $2)`,
      [req.user!.userId, certificationId]
    );

    const totalAnswered = progressResult.rows[0]?.total_answered || 0;
    const totalCorrect = progressResult.rows[0]?.correct_count || 0;
    const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

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
        [totalAnswered, totalCorrect, accuracy, req.user!.userId, certificationId]
      );
    } else {
      await pool.query(
        `INSERT INTO user_progress (id, user_id, certification_id, total_questions_answered, correct_answers, accuracy, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [uuidv4(), req.user!.userId, certificationId, totalAnswered, totalCorrect, accuracy]
      );
    }

    res.json({
      message: 'Progress updated successfully',
      totalQuestionsAnswered: totalAnswered,
      correctAnswers: totalCorrect,
      accuracy: accuracy * 100,
    });
  } catch (error) {
    next(error);
  }
}

export async function recordAnswer(req: AuthRequest, res: Response, next: NextFunction) {
  const client = await pool.connect();
  try {
    const { questionId, answerId, answerIds, dragMatches, certificationId } = req.body;
    const idempotencyKey =
      (typeof req.headers['idempotency-key'] === 'string' && req.headers['idempotency-key'].trim()) ||
      (typeof req.body?.idempotencyKey === 'string' && req.body.idempotencyKey.trim()) ||
      null;

    try {
      assertNoClientAuthoritativeScoreFields(req.body, 'Practice answer');
    } catch (err: any) {
      return next(new ValidationError(err.message));
    }

    if (!questionId) {
      return next(new ValidationError('questionId is required'));
    }

    await client.query('BEGIN');
    await ensureQuestionAttemptsTable(client);
    await client.query(`
      ALTER TABLE question_attempts
        ADD COLUMN IF NOT EXISTS idempotency_key TEXT
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attempts_user_idempotency
        ON question_attempts (user_id, idempotency_key)
        WHERE idempotency_key IS NOT NULL
    `);

    if (idempotencyKey) {
      const existing = await client.query(
        `SELECT qa.*, q.question_text, q.explanation, q.question_type, q.question_metadata,
                q.explanation_images, q.id as qid
         FROM question_attempts qa
         JOIN questions q ON q.id = qa.question_id
         WHERE qa.user_id = $1 AND qa.idempotency_key = $2
         FOR UPDATE`,
        [req.user!.userId, idempotencyKey]
      );
      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        const answersResult = await client.query(
          'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
          [row.question_id]
        );
        await client.query('COMMIT');
        const feedback = serializeAnsweredQuestionFeedback(row, answersResult.rows, {
          isCorrect: row.is_correct,
          attemptId: row.id,
          userAnswerId: row.id,
          userAnswerIds: [row.id],
        });
        return res.json({ ...feedback, alreadyRecorded: true });
      }
    }

    let questionQuery = 'SELECT * FROM questions WHERE id = $1 AND is_active = true';
    const questionParams: any[] = [questionId];
    if (certificationId) {
      questionQuery += ' AND certification_id = $2';
      questionParams.push(certificationId);
    }

    const questionResult = await client.query(questionQuery, questionParams);
    if (questionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return next(new NotFoundError('Question not found'));
    }
    const question = questionResult.rows[0];

    const answersResult = await client.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
      [questionId]
    );
    const answers = answersResult.rows;

    let isCorrect = false;
    let selectedIds: string[] = [];
    let responseJson: any = null;

    try {
      const graded = gradeQuestionResponse({
        questionType: question.question_type,
        questionMetadata: question.question_metadata,
        answers,
        answerId,
        answerIds,
        dragMatches,
        allowUnanswered: false,
      });
      isCorrect = graded.isCorrect;
      selectedIds = graded.selectedIds;
      responseJson = graded.responseJson;
    } catch (err: any) {
      await client.query('ROLLBACK');
      return next(new ValidationError(err.message || 'Invalid answer payload'));
    }

    const attemptId = uuidv4();
    try {
      await client.query(
        `INSERT INTO question_attempts
           (id, user_id, question_id, is_correct, selected_answer_ids, response_json, answered_at, idempotency_key)
         VALUES ($1, $2, $3, $4, $5::uuid[], $6::jsonb, NOW(), $7)`,
        [
          attemptId,
          req.user!.userId,
          questionId,
          isCorrect,
          selectedIds,
          JSON.stringify(responseJson),
          idempotencyKey,
        ]
      );
    } catch (err: any) {
      // Concurrent retry with same idempotency key
      if (idempotencyKey && err?.code === '23505') {
        await client.query('ROLLBACK');
        const replay = await pool.query(
          `SELECT * FROM question_attempts WHERE user_id = $1 AND idempotency_key = $2`,
          [req.user!.userId, idempotencyKey]
        );
        if (replay.rows.length > 0) {
          const row = replay.rows[0];
          const opts = await pool.query(
            'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
            [row.question_id]
          );
          const q = await pool.query('SELECT * FROM questions WHERE id = $1', [row.question_id]);
          const feedback = serializeAnsweredQuestionFeedback(q.rows[0], opts.rows, {
            isCorrect: row.is_correct,
            attemptId: row.id,
            userAnswerId: row.id,
            userAnswerIds: [row.id],
          });
          return res.json({ ...feedback, alreadyRecorded: true });
        }
      }
      throw err;
    }

    // Recompute progress for this certification from attempts (server-authoritative).
    const certId = question.certification_id;
    const progressResult = await client.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT
         COUNT(*)::int as total_answered,
         COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)::int as correct_count
       FROM learner_attempts
       WHERE user_id = $1
         AND question_id IN (SELECT id FROM questions WHERE certification_id = $2)`,
      [req.user!.userId, certId]
    );
    const totalAnswered = progressResult.rows[0]?.total_answered || 0;
    const totalCorrect = progressResult.rows[0]?.correct_count || 0;
    const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

    const existingProgress = await client.query(
      'SELECT id FROM user_progress WHERE user_id = $1 AND certification_id = $2 FOR UPDATE',
      [req.user!.userId, certId]
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
        [totalAnswered, totalCorrect, accuracy, req.user!.userId, certId]
      );
    } else {
      await client.query(
        `INSERT INTO user_progress (id, user_id, certification_id, total_questions_answered, correct_answers, accuracy, last_activity_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [uuidv4(), req.user!.userId, certId, totalAnswered, totalCorrect, accuracy]
      );
    }

    await client.query('COMMIT');

    const feedback = serializeAnsweredQuestionFeedback(question, answers, {
      isCorrect,
      attemptId,
      userAnswerId: attemptId,
      userAnswerIds: [attemptId],
    });

    res.json(feedback);
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // ignore rollback errors
    }
    next(error);
  } finally {
    client.release();
  }
}

export async function getAnsweredQuestionIds(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    let query = `
      WITH ${LEARNER_ATTEMPTS_CTE}
      SELECT DISTINCT question_id
      FROM learner_attempts
      WHERE user_id = $1
    `;
    const params: any[] = [req.user!.userId];

    if (certificationId) {
      query += ` AND question_id IN (
        SELECT id FROM questions WHERE certification_id = $2
      )`;
      params.push(certificationId);
    }

    const result = await pool.query(query, params);
    res.json({
      questionIds: result.rows.map((row: any) => row.question_id),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMissedQuestions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { knowledgeAreaId, reviewed, certificationId } = req.query;
    
    // Get all incorrect answers from practice sessions
    // For now, we'll get all incorrect answers (exam exclusion can be added later if needed)
    let query = `
      WITH ${LEARNER_ATTEMPTS_CTE},
      missed_question_ids AS (
        SELECT DISTINCT q.id as question_id
        FROM learner_attempts qa
        JOIN questions q ON qa.question_id = q.id
        WHERE qa.user_id = $1
        AND qa.is_correct = false
    `;
    
    const params: any[] = [req.user!.userId];
    let paramIndex = 2;
    
    // Filter by certification if provided
    if (certificationId) {
      query += ` AND q.certification_id = $${paramIndex}`;
      params.push(certificationId);
      paramIndex++;
    }
    
    if (knowledgeAreaId) {
      query += ` AND q.knowledge_area_id = $${paramIndex}`;
      params.push(knowledgeAreaId);
      paramIndex++;
    }
    
    query += `
      )
      SELECT 
        q.id as question_id,
        q.question_text,
        q.difficulty,
        q.explanation,
        q.knowledge_area_id,
        ka.name as knowledge_area_name,
        (SELECT MAX(answered_at) FROM learner_attempts
         WHERE user_id = $1
         AND question_id = q.id
         AND is_correct = false) as answered_at,
        (SELECT selected_answer_ids[1] FROM learner_attempts
         WHERE user_id = $1
         AND question_id = q.id
         AND is_correct = false
         ORDER BY answered_at DESC
         LIMIT 1) as user_answer_id,
        CASE 
          WHEN mr.id IS NOT NULL THEN true 
          ELSE false 
        END as is_reviewed
      FROM missed_question_ids mqi
      JOIN questions q ON mqi.question_id = q.id
      JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
      LEFT JOIN missed_questions_reviewed mr ON mr.user_id = $1 AND mr.question_id = q.id
      WHERE 1=1
    `;
    
    // Handle reviewed filter - query params come as strings
    // If reviewed is explicitly 'false' or false, show only non-reviewed
    // If reviewed is explicitly 'true' or true, show only reviewed
    // If reviewed is undefined/null, show all (no filter)
    if (reviewed !== undefined && reviewed !== null) {
      const reviewedValue = reviewed === 'true';
      const reviewedFalse = reviewed === 'false';
      
      if (reviewedFalse) {
        query += ` AND mr.id IS NULL`;
      } else if (reviewedValue) {
        query += ` AND mr.id IS NOT NULL`;
      }
    }
    
    // Ensure the query executes even if missed_questions_reviewed table doesn't exist
    // The table will be created on first use via markMissedQuestionAsReviewed
    
    query += ` ORDER BY answered_at DESC NULLS LAST`;
    
    console.log('Missed Questions Query:', query);
    console.log('Missed Questions Params:', params);
    
    const result = await pool.query(query, params);
    
    console.log('Missed Questions Result Count:', result.rows.length);
    
    // Get answers for each question — post-answer review may include correctness
    const missedQuestions = await Promise.all(
      result.rows.map(async (row: any) => {
        const answersResult = await pool.query(
          'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
          [row.question_id]
        );

        const questionPayload = serializeAdminQuestion(
          {
            id: row.question_id,
            question_text: row.question_text,
            difficulty: row.difficulty,
            explanation: row.explanation,
            knowledge_area_id: row.knowledge_area_id,
            certification_id: null,
            is_active: true,
            created_at: row.answered_at,
            updated_at: row.answered_at,
          },
          answersResult.rows,
          row.knowledge_area_name
        );

        return {
          questionId: row.question_id,
          question: questionPayload,
          answeredAt: row.answered_at,
          isReviewed: row.is_reviewed || false,
          userAnswerId: row.user_answer_id,
        };
      })
    );
    
    res.json({ missedQuestions });
  } catch (error) {
    next(error);
  }
}

export async function markMissedQuestionAsReviewed(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { questionId } = req.body;
    
    if (!questionId) {
      return res.status(400).json({ error: 'questionId is required' });
    }
    
    // Check if already marked as reviewed
    const existing = await pool.query(
      'SELECT id FROM missed_questions_reviewed WHERE user_id = $1 AND question_id = $2',
      [req.user!.userId, questionId]
    );
    
    if (existing.rows.length > 0) {
      return res.json({ message: 'Already marked as reviewed' });
    }
    
    // Create table if it doesn't exist (for now, we'll assume it exists or create migration)
    // For now, let's use a simple approach - we'll track this in a separate table
    // But first, let me check if the table exists in the schema
    
    // Actually, let me create a simpler solution - we can use a JSONB column in user preferences
    // Or create the table. Let me check the schema first.
    
    // For now, I'll create the entry. If table doesn't exist, we'll need a migration.
    try {
      await pool.query(
        'INSERT INTO missed_questions_reviewed (user_id, question_id) VALUES ($1, $2)',
        [req.user!.userId, questionId]
      );
    } catch (error: any) {
      // If table doesn't exist, create it (for development)
      if (error.code === '42P01') {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS missed_questions_reviewed (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
            reviewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
            UNIQUE(user_id, question_id)
          )
        `);
        await pool.query(
          'INSERT INTO missed_questions_reviewed (user_id, question_id) VALUES ($1, $2)',
          [req.user!.userId, questionId]
        );
      } else {
        throw error;
      }
    }
    
    res.json({ message: 'Marked as reviewed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getPerformanceByKnowledgeArea(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    const result = await pool.query(
      `WITH ${LEARNER_ATTEMPTS_CTE}
       SELECT
         ka.id as knowledge_area_id,
         ka.name as knowledge_area_name,
         COUNT(qa.id) as total_answered,
         SUM(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) as correct_answers,
         CASE
           WHEN COUNT(qa.id) > 0
           THEN (SUM(CASE WHEN qa.is_correct THEN 1 ELSE 0 END)::float / COUNT(qa.id)::float * 100)
           ELSE 0
         END as accuracy
       FROM knowledge_areas ka
       LEFT JOIN questions q ON ka.id = q.knowledge_area_id
       LEFT JOIN learner_attempts qa ON q.id = qa.question_id AND qa.user_id = $1
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

export async function getPerformanceByDomain(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    if (!certificationId) {
      return res.status(400).json({ error: 'certificationId is required' });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // First, check if questions have domain values
    const domainCheck = await pool.query(
      `SELECT domain, COUNT(*) as count 
       FROM questions 
       WHERE certification_id = $1 
         AND domain IS NOT NULL 
         AND domain IN ('People', 'Process', 'Business')
       GROUP BY domain`,
      [certificationId]
    );
    console.log('Questions with domain values:', domainCheck.rows);

    // Get performance grouped by domain (People, Process, Business)
    // Normalize domain values: handle prefixes like "1. People", "2. Process", "3. Business Environment"
    // Map knowledge areas to domains if domain is NULL (fallback)
    // People: Resource Management, Communications Management, Stakeholder Management
    // Process: Integration, Scope, Schedule, Cost, Quality, Risk, Procurement
    // Business: (newer domain)
    let result;
    try {
      result = await pool.query(
        `WITH ${LEARNER_ATTEMPTS_CTE},
        normalized_domains AS (
          SELECT
            q.id,
            q.certification_id,
            COALESCE(
              CASE
                -- Normalize domain values with prefixes (e.g., "1. People" -> "People", "3. Business Environment" -> "Business")
                WHEN TRIM(COALESCE(q.domain, '')) ~ '^[0-9]+\.\s*People' OR TRIM(COALESCE(q.domain, '')) = 'People' THEN 'People'
                WHEN TRIM(COALESCE(q.domain, '')) ~ '^[0-9]+\.\s*Process' OR TRIM(COALESCE(q.domain, '')) = 'Process' THEN 'Process'
                WHEN TRIM(COALESCE(q.domain, '')) ~ '^[0-9]+\.\s*Business' OR TRIM(COALESCE(q.domain, '')) IN ('Business', 'Business Environment') THEN 'Business'
                WHEN q.domain IS NOT NULL AND TRIM(q.domain) IN ('People', 'Process', 'Business') THEN TRIM(q.domain)
                ELSE NULL
              END,
              CASE
                WHEN ka.name LIKE '%Resource Management%' OR
                     ka.name LIKE '%Communications Management%' OR
                     ka.name LIKE '%Stakeholder Management%'
                THEN 'People'
                WHEN ka.name LIKE '%Integration%' OR
                     ka.name LIKE '%Scope%' OR
                     ka.name LIKE '%Schedule%' OR
                     ka.name LIKE '%Cost%' OR
                     ka.name LIKE '%Quality%' OR
                     ka.name LIKE '%Risk%' OR
                     ka.name LIKE '%Procurement%'
                THEN 'Process'
                ELSE NULL
              END
            ) as domain
          FROM questions q
          LEFT JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
          WHERE q.certification_id = $2
            AND q.is_active = true
            AND COALESCE(
              CASE
                WHEN TRIM(COALESCE(q.domain, '')) ~ '^[0-9]+\.\s*People' OR TRIM(COALESCE(q.domain, '')) = 'People' THEN 'People'
                WHEN TRIM(COALESCE(q.domain, '')) ~ '^[0-9]+\.\s*Process' OR TRIM(COALESCE(q.domain, '')) = 'Process' THEN 'Process'
                WHEN TRIM(COALESCE(q.domain, '')) ~ '^[0-9]+\.\s*Business' OR TRIM(COALESCE(q.domain, '')) IN ('Business', 'Business Environment') THEN 'Business'
                WHEN q.domain IS NOT NULL AND TRIM(q.domain) IN ('People', 'Process', 'Business') THEN TRIM(q.domain)
                ELSE NULL
              END,
              CASE
                WHEN ka.name LIKE '%Resource Management%' OR
                     ka.name LIKE '%Communications Management%' OR
                     ka.name LIKE '%Stakeholder Management%'
                THEN 'People'
                WHEN ka.name LIKE '%Integration%' OR
                     ka.name LIKE '%Scope%' OR
                     ka.name LIKE '%Schedule%' OR
                     ka.name LIKE '%Cost%' OR
                     ka.name LIKE '%Quality%' OR
                     ka.name LIKE '%Risk%' OR
                     ka.name LIKE '%Procurement%'
                THEN 'Process'
                ELSE NULL
              END
            ) IN ('People', 'Process', 'Business')
        )
        SELECT
          nd.domain,
          COUNT(DISTINCT nd.id) as total_questions,
          COUNT(DISTINCT qa.id) as total_answered,
          SUM(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) as correct_answers,
          CASE
            WHEN COUNT(DISTINCT qa.id) > 0
            THEN (SUM(CASE WHEN qa.is_correct THEN 1 ELSE 0 END)::float / COUNT(DISTINCT qa.id)::float * 100)
            ELSE 0
          END as accuracy
        FROM normalized_domains nd
        LEFT JOIN learner_attempts qa ON nd.id = qa.question_id AND qa.user_id = $1
        GROUP BY nd.domain
        ORDER BY nd.domain`,
        [req.user!.userId, certificationId]
      );
    } catch (queryError: any) {
      console.error('SQL Query Error in getPerformanceByDomain:', queryError);
      console.error('Query Error Details:', {
        message: queryError.message,
        code: queryError.code,
        detail: queryError.detail,
        hint: queryError.hint
      });
      throw queryError;
    }

    // Debug logging
    console.log('Domain Performance Query Result:', {
      userId: req.user!.userId,
      certificationId,
      rowCount: result.rows.length,
      rows: result.rows
    });

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
        domain: row.domain,
        totalQuestions: parseInt(row.total_questions || '0', 10),
        totalAnswered: parseInt(row.total_answered || '0', 10),
        correctAnswers: parseInt(row.correct_answers || '0', 10),
        accuracy: accuracy,
      };
    });

    // Ensure we have entries for all three domains (People, Process, Business)
    // If a domain has no answers, it won't appear in the result, so we add it with 0 stats
    const domainMap: { [key: string]: any } = {};
    performance.forEach((perf: any) => {
      domainMap[perf.domain] = perf;
    });

    const allDomains = ['People', 'Process', 'Business'];
    const finalPerformance = await Promise.all(allDomains.map(async (domain) => {
      if (domainMap[domain]) {
        return domainMap[domain];
      }
      // If domain has no data, we need to get total questions for that domain
      // Include both direct domain matches (with normalization) and knowledge area mappings
      const domainTotalResult = await pool.query(
        `SELECT COUNT(*) as total_questions
         FROM questions q
         LEFT JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
         WHERE q.certification_id = $1
           AND (
             -- Normalized domain matches (handle prefixes like "1. People", "2. Process", "3. Business Environment")
             (CASE 
               WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*People' OR TRIM(q.domain) = 'People' THEN 'People'
               WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*Process' OR TRIM(q.domain) = 'Process' THEN 'Process'
               WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*Business' OR TRIM(q.domain) IN ('Business', 'Business Environment') THEN 'Business'
               WHEN q.domain IS NOT NULL AND TRIM(q.domain) IN ('People', 'Process', 'Business') THEN TRIM(q.domain)
               ELSE NULL
             END) = $2
             OR (
               -- Fallback to knowledge area mapping if domain is NULL
               q.domain IS NULL AND
               CASE 
                 WHEN $2 = 'People' AND (
                   ka.name LIKE '%Resource Management%' OR 
                   ka.name LIKE '%Communications Management%' OR 
                   ka.name LIKE '%Stakeholder Management%'
                 ) THEN true
                 WHEN $2 = 'Process' AND (
                   ka.name LIKE '%Integration%' OR 
                   ka.name LIKE '%Scope%' OR 
                   ka.name LIKE '%Schedule%' OR 
                   ka.name LIKE '%Cost%' OR 
                   ka.name LIKE '%Quality%' OR 
                   ka.name LIKE '%Risk%' OR 
                   ka.name LIKE '%Procurement%'
                 ) THEN true
                 ELSE false
               END
             )
           )`,
        [certificationId, domain]
      );
      const domainTotal = parseInt(
        (domainTotalResult.rows[0] && domainTotalResult.rows[0].total_questions) || '0',
        10
      );
      
      return {
        domain: domain,
        totalQuestions: domainTotal,
        totalAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
      };
    }));

    // Debug logging
    console.log('Final Performance before response:', finalPerformance);

    res.json({ performance: finalPerformance });
  } catch (error: any) {
    console.error('Error in getPerformanceByDomain:', error);
    console.error('Error stack:', error.stack);
    // Return a more detailed error response
    res.status(500).json({ 
      error: 'Failed to fetch performance by domain',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}


