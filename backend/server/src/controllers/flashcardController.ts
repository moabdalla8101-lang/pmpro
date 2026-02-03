import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function getFlashcards(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { knowledgeAreaIds, random } = req.query;
    
    let query = 'SELECT * FROM flashcards WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by knowledge areas if provided
    if (knowledgeAreaIds) {
      const areaIds = Array.isArray(knowledgeAreaIds) 
        ? knowledgeAreaIds 
        : (knowledgeAreaIds as string).split(',');
      
      if (areaIds.length > 0) {
        // Get knowledge area names from IDs
        const placeholders = areaIds.map((_, i) => `$${i + 1}`).join(',');
        const kaResult = await pool.query(
          `SELECT name FROM knowledge_areas WHERE id IN (${placeholders})`,
          areaIds
        );
        
        // Convert knowledge area names to match flashcard format (remove "Project" prefix)
        // Flashcards store names like "Schedule Management" but knowledge_areas has "Project Schedule Management"
        const kaNames = kaResult.rows.map((row: any) => {
          const name = row.name;
          // Remove "Project " prefix if present
          return name.replace(/^Project\s+/i, '').trim();
        });
        
        if (kaNames.length > 0) {
          const namePlaceholders = kaNames.map((_, i) => `$${paramIndex + i}`).join(',');
          query += ` AND knowledge_area IN (${namePlaceholders})`;
          params.push(...kaNames);
          paramIndex += kaNames.length;
        } else {
          // No matching knowledge areas found, return empty result
          console.log(`No knowledge areas found for IDs: ${areaIds.join(', ')}`);
          res.json({ flashcards: [] });
          return;
        }
      }
    }

    if (random === 'true') {
      query += ' ORDER BY RANDOM()';
    } else {
      query += ' ORDER BY id';
    }

    const result = await pool.query(query, params);

    // Get user progress for each flashcard
    const flashcards = await Promise.all(
      result.rows.map(async (row: any) => {
        const progressResult = await pool.query(
          'SELECT is_marked, times_reviewed, times_correct, times_incorrect FROM user_flashcard_progress WHERE user_id = $1 AND flashcard_id = $2',
          [req.user!.userId, row.id]
        );

        const progress = progressResult.rows[0] || null;

        return {
          id: row.id,
          frontFace: row.front_face,
          backFace: row.back_face,
          knowledgeArea: row.knowledge_area,
          isMarked: (progress && progress.is_marked) || false,
          timesReviewed: (progress && progress.times_reviewed) || 0,
          timesCorrect: (progress && progress.times_correct) || 0,
          timesIncorrect: (progress && progress.times_incorrect) || 0,
        };
      })
    );

    res.json({ flashcards });
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeAreas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      'SELECT DISTINCT knowledge_area FROM flashcards WHERE knowledge_area IS NOT NULL ORDER BY knowledge_area'
    );

    res.json({
      knowledgeAreas: result.rows.map((row: any) => row.knowledge_area),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMarkedFlashcards(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { random } = req.query;

    let query = `
      SELECT f.*, ufp.is_marked, ufp.times_reviewed, ufp.times_correct, ufp.times_incorrect
      FROM flashcards f
      INNER JOIN user_flashcard_progress ufp ON f.id = ufp.flashcard_id
      WHERE ufp.user_id = $1 AND ufp.is_marked = true
    `;
    
    const params: any[] = [req.user!.userId];

    if (random === 'true') {
      query += ' ORDER BY RANDOM()';
    } else {
      query += ' ORDER BY f.id';
    }

    const result = await pool.query(query, params);

    const flashcards = result.rows.map((row: any) => ({
      id: row.id,
      frontFace: row.front_face,
      backFace: row.back_face,
      knowledgeArea: row.knowledge_area,
      isMarked: row.is_marked,
      timesReviewed: row.times_reviewed || 0,
      timesCorrect: row.times_correct || 0,
      timesIncorrect: row.times_incorrect || 0,
    }));

    res.json({ flashcards });
  } catch (error) {
    next(error);
  }
}

export async function toggleMarkFlashcard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { flashcardId } = req.params;
    const { isMarked } = req.body;

    // Check if progress record exists
    const existing = await pool.query(
      'SELECT id FROM user_flashcard_progress WHERE user_id = $1 AND flashcard_id = $2',
      [req.user!.userId, flashcardId]
    );

    if (existing.rows.length > 0) {
      // Update existing record
      await pool.query(
        'UPDATE user_flashcard_progress SET is_marked = $1, updated_at = NOW() WHERE user_id = $2 AND flashcard_id = $3',
        [isMarked, req.user!.userId, flashcardId]
      );
    } else {
      // Create new record
      await pool.query(
        'INSERT INTO user_flashcard_progress (user_id, flashcard_id, is_marked) VALUES ($1, $2, $3)',
        [req.user!.userId, flashcardId, isMarked]
      );
    }

    res.json({ success: true, isMarked });
  } catch (error) {
    next(error);
  }
}

export async function recordFlashcardReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { flashcardId, isCorrect } = req.body;

    // Check if progress record exists
    const existing = await pool.query(
      'SELECT * FROM user_flashcard_progress WHERE user_id = $1 AND flashcard_id = $2',
      [req.user!.userId, flashcardId]
    );

    if (existing.rows.length > 0) {
      // Update existing record
      const progress = existing.rows[0];
      const newTimesReviewed = (progress.times_reviewed || 0) + 1;
      const newTimesCorrect = isCorrect 
        ? (progress.times_correct || 0) + 1 
        : (progress.times_correct || 0);
      const newTimesIncorrect = !isCorrect 
        ? (progress.times_incorrect || 0) + 1 
        : (progress.times_incorrect || 0);

      await pool.query(
        `UPDATE user_flashcard_progress 
         SET times_reviewed = $1, 
             times_correct = $2, 
             times_incorrect = $3, 
             last_reviewed_at = NOW(),
             updated_at = NOW() 
         WHERE user_id = $4 AND flashcard_id = $5`,
        [newTimesReviewed, newTimesCorrect, newTimesIncorrect, req.user!.userId, flashcardId]
      );
    } else {
      // Create new record
      await pool.query(
        `INSERT INTO user_flashcard_progress 
         (user_id, flashcard_id, times_reviewed, times_correct, times_incorrect, last_reviewed_at) 
         VALUES ($1, $2, 1, $3, $4, NOW())`,
        [req.user!.userId, flashcardId, isCorrect ? 1 : 0, isCorrect ? 0 : 1]
      );
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

