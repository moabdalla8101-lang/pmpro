import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function getBookmarks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { knowledgeAreaId } = req.query;
    
    let query = `
      SELECT 
        b.id,
        b.user_id,
        b.question_id,
        b.created_at,
        q.question_text,
        q.difficulty,
        q.explanation,
        q.knowledge_area_id,
        ka.name as knowledge_area_name
      FROM bookmarks b
      JOIN questions q ON b.question_id = q.id
      JOIN knowledge_areas ka ON q.knowledge_area_id = ka.id
      WHERE b.user_id = $1
    `;
    
    const params: any[] = [req.user!.userId];
    
    if (knowledgeAreaId) {
      query += ' AND q.knowledge_area_id = $2';
      params.push(knowledgeAreaId);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    const result = await pool.query(query, params);
    
    // Get answers for each question
    const bookmarks = await Promise.all(
      result.rows.map(async (row: any) => {
        const answersResult = await pool.query(
          'SELECT id, answer_text, is_correct, "order" FROM answers WHERE question_id = $1 ORDER BY "order"',
          [row.question_id]
        );
        
        return {
          id: row.id,
          userId: row.user_id,
          questionId: row.question_id,
          createdAt: row.created_at,
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
        };
      })
    );
    
    res.json({ bookmarks });
  } catch (error) {
    next(error);
  }
}

export async function addBookmark(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { questionId } = req.body;
    
    if (!questionId) {
      return res.status(400).json({ error: 'questionId is required' });
    }
    
    // Check if bookmark already exists
    const existing = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND question_id = $2',
      [req.user!.userId, questionId]
    );
    
    if (existing.rows.length > 0) {
      return res.json({ bookmark: existing.rows[0], message: 'Bookmark already exists' });
    }
    
    const result = await pool.query(
      'INSERT INTO bookmarks (user_id, question_id) VALUES ($1, $2) RETURNING *',
      [req.user!.userId, questionId]
    );
    
    res.status(201).json({
      bookmark: {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        questionId: result.rows[0].question_id,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeBookmark(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { questionId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND question_id = $2 RETURNING *',
      [req.user!.userId, questionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function checkBookmark(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { questionId } = req.params;
    
    const result = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND question_id = $2',
      [req.user!.userId, questionId]
    );
    
    res.json({ isBookmarked: result.rows.length > 0 });
  } catch (error) {
    next(error);
  }
}

