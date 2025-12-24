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

export async function getMissedQuestions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { knowledgeAreaId, reviewed, certificationId } = req.query;
    
    // Get all incorrect answers from practice sessions
    // For now, we'll get all incorrect answers (exam exclusion can be added later if needed)
    let query = `
      WITH missed_question_ids AS (
        SELECT DISTINCT q.id as question_id
        FROM user_answers ua
        JOIN questions q ON ua.question_id = q.id
        WHERE ua.user_id = $1
        AND ua.is_correct = false
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
        (SELECT MAX(answered_at) FROM user_answers 
         WHERE user_id = $1 
         AND question_id = q.id 
         AND is_correct = false) as answered_at,
        (SELECT answer_id FROM user_answers 
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
      const reviewedValue = reviewed === 'true' || reviewed === true;
      const reviewedFalse = reviewed === 'false' || reviewed === false;
      
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
    
    // Get answers for each question
    const missedQuestions = await Promise.all(
      result.rows.map(async (row: any) => {
        const answersResult = await pool.query(
          'SELECT id, answer_text, is_correct, "order" FROM answers WHERE question_id = $1 ORDER BY "order"',
          [row.question_id]
        );
        
        return {
          questionId: row.question_id,
          question: {
            id: row.question_id,
            questionText: row.question_text,
            question_text: row.question_text,
            difficulty: row.difficulty,
            explanation: row.explanation,
            knowledgeAreaId: row.knowledge_area_id,
            knowledgeAreaName: row.knowledge_area_name,
            knowledge_area_name: row.knowledge_area_name,
            answers: answersResult.rows.map((ans: any) => ({
              id: ans.id,
              answerText: ans.answer_text,
              answer_text: ans.answer_text,
              isCorrect: ans.is_correct,
              is_correct: ans.is_correct,
              order: ans.order,
            })),
          },
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

export async function getPerformanceByDomain(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

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
    const result = await pool.query(
      `WITH normalized_domains AS (
        SELECT 
          q.id,
          q.certification_id,
          COALESCE(
            CASE 
              -- Normalize domain values with prefixes (e.g., "1. People" -> "People", "3. Business Environment" -> "Business")
              WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*People' OR TRIM(q.domain) = 'People' THEN 'People'
              WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*Process' OR TRIM(q.domain) = 'Process' THEN 'Process'
              WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*Business' OR TRIM(q.domain) IN ('Business', 'Business Environment') THEN 'Business'
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
          AND COALESCE(
            CASE 
              WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*People' OR TRIM(q.domain) = 'People' THEN 'People'
              WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*Process' OR TRIM(q.domain) = 'Process' THEN 'Process'
              WHEN TRIM(q.domain) ~ '^[0-9]+\.\s*Business' OR TRIM(q.domain) IN ('Business', 'Business Environment') THEN 'Business'
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
        COUNT(DISTINCT ua.id) as total_answered,
        SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) as correct_answers,
        CASE 
          WHEN COUNT(DISTINCT ua.id) > 0 
          THEN (SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::float / COUNT(DISTINCT ua.id)::float * 100)
          ELSE 0 
        END as accuracy
      FROM normalized_domains nd
      LEFT JOIN user_answers ua ON nd.id = ua.question_id AND ua.user_id = $1
      GROUP BY nd.domain
      ORDER BY nd.domain`,
      [req.user!.userId, certificationId]
    );

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
  } catch (error) {
    next(error);
  }
}


