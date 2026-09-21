import { Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '@pmp-app/shared';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import { hydrateQuestion, hydrateQuestions } from '../serializers/hydrateQuestion';
import {
  assertNoLearnerLeaks,
  clampLearnerPageSize,
  MAX_LEARNER_QUESTION_PAGE_SIZE,
} from '../serializers/questionSerializers';
import { UserRole } from '@pmp-app/shared';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isAdminRequest(req: AuthRequest): boolean {
  return req.user?.role === UserRole.ADMIN || req.user?.role === 'admin';
}

/**
 * Append a domain predicate. Handles values like "People", "1. People",
 * and "Business Environment".
 */
function appendDomainFilter(
  query: string,
  params: any[],
  paramCount: number,
  domain: unknown
): { query: string; paramCount: number } {
  if (!domain || typeof domain !== 'string') {
    return { query, paramCount };
  }
  const normalized = domain.replace(/^\d+\.\s*/, '').trim();
  if (!normalized) {
    return { query, paramCount };
  }

  query += ` AND (
    TRIM(COALESCE(domain, '')) = $${paramCount}
    OR TRIM(COALESCE(domain, '')) = $${paramCount + 1}
    OR TRIM(COALESCE(domain, '')) ~ ('^[0-9]+\\.\\s*' || $${paramCount})
  )`;
  params.push(normalized, `${normalized} Environment`);
  return { query, paramCount: paramCount + 2 };
}

function buildActiveQuestionFilters(query: {
  certificationId?: unknown;
  knowledgeAreaId?: unknown;
  difficulty?: unknown;
  domain?: unknown;
}): { where: string; params: any[] } {
  let where = 'WHERE is_active = true';
  const params: any[] = [];
  let paramCount = 1;

  if (query.certificationId) {
    where += ` AND certification_id = $${paramCount++}`;
    params.push(query.certificationId);
  }
  if (query.knowledgeAreaId) {
    where += ` AND knowledge_area_id = $${paramCount++}`;
    params.push(query.knowledgeAreaId);
  }
  if (query.difficulty) {
    where += ` AND difficulty = $${paramCount++}`;
    params.push(query.difficulty);
  }

  const withDomain = appendDomainFilter(
    `SELECT 1 FROM questions ${where}`,
    params,
    paramCount,
    query.domain
  );
  const whereMatch = withDomain.query.match(/WHERE[\s\S]*$/i);
  return {
    where: whereMatch ? whereMatch[0] : where,
    params,
  };
}

async function respondWithQuestions(
  req: AuthRequest,
  res: Response,
  rows: any[],
  total?: number
) {
  const admin = isAdminRequest(req);
  const questions = await hydrateQuestions(rows, { admin });
  const payload = { questions, total: total ?? questions.length };
  if (!admin) {
    assertNoLearnerLeaks(payload, 'questions list');
  }
  res.json(payload);
}

export async function getQuestions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const {
      certificationId,
      knowledgeAreaId,
      difficulty,
      domain,
      limit,
      offset = 0,
      random,
      distributeByKnowledgeArea,
    } = req.query;
    const admin = isAdminRequest(req);
    const queryLimit = admin
      ? (limit ? parseInt(limit as string, 10) : 1000)
      : clampLearnerPageSize(limit);
    const queryOffset = Math.max(0, parseInt(String(offset), 10) || 0);
    const isRandom = random === 'true' || random === '1';
    const shouldDistribute =
      distributeByKnowledgeArea === 'true' ||
      distributeByKnowledgeArea === '1';

    if (shouldDistribute && certificationId && !knowledgeAreaId) {
      const knowledgeAreasResult = await pool.query(
        'SELECT id FROM knowledge_areas WHERE certification_id = $1 ORDER BY "order"',
        [certificationId]
      );

      const knowledgeAreaIds = knowledgeAreasResult.rows.map((row: any) => row.id);
      const questionsPerArea = Math.ceil(queryLimit / Math.max(knowledgeAreaIds.length, 1));
      const allQuestions: any[] = [];

      for (const kaId of knowledgeAreaIds) {
        let areaQuery =
          'SELECT * FROM questions WHERE is_active = true AND certification_id = $1 AND knowledge_area_id = $2';
        const areaParams: any[] = [certificationId, kaId];
        let areaParamCount = 3;

        if (difficulty) {
          areaQuery += ` AND difficulty = $${areaParamCount++}`;
          areaParams.push(difficulty);
        }

        const withDomain = appendDomainFilter(areaQuery, areaParams, areaParamCount, domain);
        areaQuery = withDomain.query;
        areaParamCount = withDomain.paramCount;

        areaQuery += isRandom
          ? ` ORDER BY RANDOM() LIMIT $${areaParamCount++}`
          : ` ORDER BY created_at DESC, id DESC LIMIT $${areaParamCount++}`;

        areaParams.push(questionsPerArea);

        const areaResult = await pool.query(areaQuery, areaParams);
        allQuestions.push(...areaResult.rows);
      }

      if (allQuestions.length < queryLimit) {
        const remaining = queryLimit - allQuestions.length;
        let fillQuery = 'SELECT * FROM questions WHERE is_active = true AND certification_id = $1';
        const fillParams: any[] = [certificationId];
        let fillParamCount = 2;

        if (allQuestions.length > 0) {
          const excludeIds = allQuestions.map((q: any) => q.id);
          fillQuery += ` AND id NOT IN (${excludeIds.map((_, i) => `$${fillParamCount + i}`).join(', ')})`;
          fillParams.push(...excludeIds);
          fillParamCount += excludeIds.length;
        }

        if (difficulty) {
          fillQuery += ` AND difficulty = $${fillParamCount++}`;
          fillParams.push(difficulty);
        }

        const withDomain = appendDomainFilter(fillQuery, fillParams, fillParamCount, domain);
        fillQuery = withDomain.query;
        fillParamCount = withDomain.paramCount;

        fillQuery += ` ORDER BY RANDOM() LIMIT $${fillParamCount++}`;
        fillParams.push(remaining);

        const fillResult = await pool.query(fillQuery, fillParams);
        allQuestions.push(...fillResult.rows);
      }

      let finalQuestions = allQuestions;
      if (isRandom && allQuestions.length > 1) {
        finalQuestions = allQuestions.sort(() => Math.random() - 0.5);
      }

      const page = finalQuestions.slice(0, queryLimit);
      await respondWithQuestions(req, res, page, page.length);
      return;
    }

    const { where, params } = buildActiveQuestionFilters({
      certificationId,
      knowledgeAreaId,
      difficulty,
      domain,
    });

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM questions ${where}`,
      params
    );
    const total = countResult.rows[0]?.total ?? 0;

    const listParams = [...params];
    let paramCount = listParams.length + 1;
    let query = `SELECT * FROM questions ${where}`;
    if (isRandom) {
      query += ` ORDER BY RANDOM() LIMIT $${paramCount++}`;
      listParams.push(queryLimit);
    } else {
      query += ` ORDER BY created_at DESC, id DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      listParams.push(queryLimit, queryOffset);
    }

    const result = await pool.query(query, listParams);
    await respondWithQuestions(req, res, result.rows, total);
  } catch (error) {
    next(error);
  }
}

export async function getQuestionsByIds(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ error: 'ids parameter is required' });
    }

    let questionIds: string[] = [];
    if (typeof ids === 'string') {
      questionIds = ids
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
    } else if (Array.isArray(ids)) {
      questionIds = ids.map((id) => String(id).trim()).filter(Boolean);
    } else {
      return res.status(400).json({ error: 'ids must be a comma-separated string or array' });
    }

    questionIds = [...new Set(questionIds)];

    if (questionIds.length === 0) {
      return res.json({ questions: [], total: 0 });
    }

    if (questionIds.length > MAX_LEARNER_QUESTION_PAGE_SIZE) {
      return next(
        new ValidationError(
          `ids may include at most ${MAX_LEARNER_QUESTION_PAGE_SIZE} unique question IDs`
        )
      );
    }

    for (const id of questionIds) {
      if (!UUID_RE.test(id)) {
        return next(new ValidationError(`Invalid question id: ${id}`));
      }
    }

    const placeholders = questionIds.map((_, index) => `$${index + 1}`).join(', ');
    const query = `SELECT * FROM questions WHERE id IN (${placeholders}) AND is_active = true`;
    const result = await pool.query(query, questionIds);

    const questionMap = new Map(result.rows.map((q: any) => [q.id, q]));
    const sortedQuestions = questionIds
      .map((id) => questionMap.get(id))
      .filter((q) => q !== undefined);

    await respondWithQuestions(req, res, sortedQuestions, sortedQuestions.length);
  } catch (error) {
    next(error);
  }
}

export async function getQuestion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const admin = isAdminRequest(req);

    const questionResult = await pool.query(
      admin
        ? 'SELECT * FROM questions WHERE id = $1'
        : 'SELECT * FROM questions WHERE id = $1 AND is_active = true',
      [id]
    );

    if (questionResult.rows.length === 0) {
      return next(new NotFoundError('Question not found'));
    }

    const payload = await hydrateQuestion(questionResult.rows[0], { admin });
    if (!admin) {
      assertNoLearnerLeaks(payload, 'getQuestion');
    }
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function createQuestion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { certificationId, knowledgeAreaId, questionText, explanation, difficulty, answers } =
      req.body;

    if (!answers || !Array.isArray(answers) || answers.length < 2) {
      return next(new ValidationError('At least 2 answers are required'));
    }

    const hasCorrectAnswer = answers.some((a: any) => a.isCorrect);
    if (!hasCorrectAnswer) {
      return next(new ValidationError('At least one correct answer is required'));
    }

    const questionId = uuidv4();

    await pool.query(
      `INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
      [questionId, certificationId, knowledgeAreaId, questionText, explanation || null, difficulty]
    );

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const answerId = uuidv4();
      await pool.query(
        `INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [answerId, questionId, answer.answerText, answer.isCorrect, i]
      );
    }

    const questionResult = await pool.query('SELECT * FROM questions WHERE id = $1', [questionId]);
    const payload = await hydrateQuestion(questionResult.rows[0], { admin: true });
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
}

export async function updateQuestion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { questionText, explanation, difficulty, isActive, questionImages, explanationImages } =
      req.body;

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (questionText !== undefined) {
      updateFields.push(`question_text = $${paramCount++}`);
      params.push(questionText);
    }

    if (explanation !== undefined) {
      updateFields.push(`explanation = $${paramCount++}`);
      params.push(explanation);
    }

    if (difficulty !== undefined) {
      updateFields.push(`difficulty = $${paramCount++}`);
      params.push(difficulty);
    }

    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount++}`);
      params.push(isActive);
    }

    if (questionImages !== undefined) {
      updateFields.push(`question_images = $${paramCount++}`);
      params.push(questionImages ? JSON.stringify(questionImages) : null);
    }

    if (explanationImages !== undefined) {
      updateFields.push(`explanation_images = $${paramCount++}`);
      params.push(explanationImages ? JSON.stringify(explanationImages) : null);
    }

    if (updateFields.length === 0) {
      return next(new ValidationError('No fields to update'));
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    await pool.query(
      `UPDATE questions SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      params
    );

    const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return next(new NotFoundError('Question not found'));
    }

    const payload = await hydrateQuestion(result.rows[0], { admin: true });
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function deleteQuestion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM answers WHERE question_id = $1', [id]);
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getQuestionsByKnowledgeArea(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { knowledgeAreaId } = req.params;
    const { limit, offset = 0 } = req.query;
    const admin = isAdminRequest(req);
    const queryLimit = admin
      ? (limit ? parseInt(limit as string, 10) : 1000)
      : clampLearnerPageSize(limit);
    const queryOffset = Math.max(0, parseInt(String(offset), 10) || 0);

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM questions
       WHERE knowledge_area_id = $1 AND is_active = true`,
      [knowledgeAreaId]
    );

    const result = await pool.query(
      `SELECT * FROM questions
       WHERE knowledge_area_id = $1 AND is_active = true
       ORDER BY created_at DESC, id DESC
       LIMIT $2 OFFSET $3`,
      [knowledgeAreaId, queryLimit, queryOffset]
    );

    await respondWithQuestions(req, res, result.rows, countResult.rows[0]?.total ?? 0);
  } catch (error) {
    next(error);
  }
}
