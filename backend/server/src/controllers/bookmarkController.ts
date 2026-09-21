import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { hydrateQuestions } from '../serializers/hydrateQuestion';
import { assertNoLearnerLeaks } from '../serializers/questionSerializers';
import { mapBookmarkRows } from '../utils/mapBookmarkRows';

export async function getBookmarks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { knowledgeAreaId } = req.query;

    // Alias bookmark columns so q.* cannot overwrite bookmark id / question_id / created_at.
    let query = `
      SELECT
        b.id AS bookmark_id,
        b.user_id AS bookmark_user_id,
        b.question_id AS bookmarked_question_id,
        b.created_at AS bookmarked_at,
        q.id AS question_pk,
        to_jsonb(q) AS question_row
      FROM bookmarks b
      JOIN questions q ON b.question_id = q.id
      WHERE b.user_id = $1
        AND q.is_active = true
    `;

    const params: any[] = [req.user!.userId];

    if (knowledgeAreaId) {
      query += ' AND q.knowledge_area_id = $2';
      params.push(knowledgeAreaId);
    }

    query += ' ORDER BY b.created_at DESC';

    const result = await pool.query(query, params);
    const questionRows = result.rows.map((row: any) => row.question_row);
    const questions = await hydrateQuestions(questionRows, { admin: false });
    const bookmarks = mapBookmarkRows(result.rows, questions);

    const payload = { bookmarks };
    assertNoLearnerLeaks(payload, 'getBookmarks');
    res.json(payload);
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
