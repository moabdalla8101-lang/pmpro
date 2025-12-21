import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '@pmp-app/shared';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function getQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const { certificationId, knowledgeAreaId, difficulty, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM questions WHERE is_active = true';
    const params: any[] = [];
    let paramCount = 1;

    if (certificationId) {
      query += ` AND certification_id = $${paramCount++}`;
      params.push(certificationId);
    }

    if (knowledgeAreaId) {
      query += ` AND knowledge_area_id = $${paramCount++}`;
      params.push(knowledgeAreaId);
    }

    if (difficulty) {
      query += ` AND difficulty = $${paramCount++}`;
      params.push(difficulty);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get answers for each question
    const questions = await Promise.all(
      result.rows.map(async (question) => {
        const answersResult = await pool.query(
          'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
          [question.id]
        );
        return {
          ...question,
          answers: answersResult.rows
        };
      })
    );

    res.json({ questions, total: result.rows.length });
  } catch (error) {
    next(error);
  }
}

export async function getQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const questionResult = await pool.query(
      'SELECT * FROM questions WHERE id = $1',
      [id]
    );

    if (questionResult.rows.length === 0) {
      return next(new NotFoundError('Question not found'));
    }

    const question = questionResult.rows[0];

    const answersResult = await pool.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
      [id]
    );

    res.json({
      ...question,
      answers: answersResult.rows
    });
  } catch (error) {
    next(error);
  }
}

export async function createQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { certificationId, knowledgeAreaId, questionText, explanation, difficulty, answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length < 2) {
      return next(new ValidationError('At least 2 answers are required'));
    }

    const hasCorrectAnswer = answers.some((a: any) => a.isCorrect);
    if (!hasCorrectAnswer) {
      return next(new ValidationError('At least one correct answer is required'));
    }

    const questionId = uuidv4();

    // Create question
    await pool.query(
      `INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
      [questionId, certificationId, knowledgeAreaId, questionText, explanation || null, difficulty]
    );

    // Create answers
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const answerId = uuidv4();
      await pool.query(
        `INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [answerId, questionId, answer.answerText, answer.isCorrect, i]
      );
    }

    const questionResult = await pool.query(
      'SELECT * FROM questions WHERE id = $1',
      [questionId]
    );

    const answersResult = await pool.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
      [questionId]
    );

    res.status(201).json({
      ...questionResult.rows[0],
      answers: answersResult.rows
    });
  } catch (error) {
    next(error);
  }
}

export async function updateQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { questionText, explanation, difficulty, isActive } = req.body;

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

    if (updateFields.length === 0) {
      return next(new ValidationError('No fields to update'));
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    await pool.query(
      `UPDATE questions SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      params
    );

    const result = await pool.query(
      'SELECT * FROM questions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('Question not found'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function deleteQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM answers WHERE question_id = $1', [id]);
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getQuestionsByKnowledgeArea(req: Request, res: Response, next: NextFunction) {
  try {
    const { knowledgeAreaId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM questions 
       WHERE knowledge_area_id = $1 AND is_active = true 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [knowledgeAreaId, limit, offset]
    );

    const questions = await Promise.all(
      result.rows.map(async (question) => {
        const answersResult = await pool.query(
          'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
          [question.id]
        );
        return {
          ...question,
          answers: answersResult.rows
        };
      })
    );

    res.json({ questions, total: questions.length });
  } catch (error) {
    next(error);
  }
}


