import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function getKnowledgeAreas(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      'SELECT * FROM knowledge_areas ORDER BY "order"'
    );
    res.json({ 
      knowledgeAreas: result.rows.map((ka: any) => ({
        id: ka.id,
        certificationId: ka.certification_id,
        name: ka.name,
        description: ka.description,
        order: ka.order,
        createdAt: ka.created_at,
        updatedAt: ka.updated_at
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeArea(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM knowledge_areas WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('Knowledge area not found'));
    }

    const ka = result.rows[0];
    res.json({
      id: ka.id,
      certificationId: ka.certification_id,
      name: ka.name,
      description: ka.description,
      order: ka.order,
      createdAt: ka.created_at,
      updatedAt: ka.updated_at
    });
  } catch (error) {
    next(error);
  }
}

export async function createKnowledgeArea(req: Request, res: Response, next: NextFunction) {
  try {
    const { certificationId, name, description, order } = req.body;
    const id = uuidv4();

    await pool.query(
      `INSERT INTO knowledge_areas (id, certification_id, name, description, "order", created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [id, certificationId, name, description || null, order]
    );

    const result = await pool.query(
      'SELECT * FROM knowledge_areas WHERE id = $1',
      [id]
    );

    const ka = result.rows[0];
    res.status(201).json({
      id: ka.id,
      certificationId: ka.certification_id,
      name: ka.name,
      description: ka.description,
      order: ka.order,
      createdAt: ka.created_at,
      updatedAt: ka.updated_at
    });
  } catch (error) {
    next(error);
  }
}

export async function updateKnowledgeArea(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description, order } = req.body;

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      params.push(name);
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      params.push(description);
    }

    if (order !== undefined) {
      updateFields.push(`"order" = $${paramCount++}`);
      params.push(order);
    }

    if (updateFields.length === 0) {
      return res.json({ message: 'No fields to update' });
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    await pool.query(
      `UPDATE knowledge_areas SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      params
    );

    const result = await pool.query(
      'SELECT * FROM knowledge_areas WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('Knowledge area not found'));
    }

    const ka = result.rows[0];
    res.json({
      id: ka.id,
      certificationId: ka.certification_id,
      name: ka.name,
      description: ka.description,
      order: ka.order,
      createdAt: ka.created_at,
      updatedAt: ka.updated_at
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteKnowledgeArea(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM knowledge_areas WHERE id = $1', [id]);

    res.json({ message: 'Knowledge area deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeAreasByCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.params;

    const result = await pool.query(
      'SELECT * FROM knowledge_areas WHERE certification_id = $1 ORDER BY "order"',
      [certificationId]
    );

    res.json({ 
      knowledgeAreas: result.rows.map((ka: any) => ({
        id: ka.id,
        certificationId: ka.certification_id,
        name: ka.name,
        description: ka.description,
        order: ka.order,
        createdAt: ka.created_at,
        updatedAt: ka.updated_at
      }))
    });
  } catch (error) {
    next(error);
  }
}


