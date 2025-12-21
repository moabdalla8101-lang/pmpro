import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@pmp-app/shared';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function getCertifications(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await pool.query(
      'SELECT * FROM certifications WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json({ certifications: result.rows });
  } catch (error) {
    next(error);
  }
}

export async function getCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM certifications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('Certification not found'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function createCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, type, description } = req.body;
    const id = uuidv4();

    await pool.query(
      `INSERT INTO certifications (id, name, type, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, true, NOW(), NOW())`,
      [id, name, type, description || null]
    );

    const result = await pool.query(
      'SELECT * FROM certifications WHERE id = $1',
      [id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updateCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

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

    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount++}`);
      params.push(isActive);
    }

    if (updateFields.length === 0) {
      return res.json({ message: 'No fields to update' });
    }

    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    await pool.query(
      `UPDATE certifications SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      params
    );

    const result = await pool.query(
      'SELECT * FROM certifications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return next(new NotFoundError('Certification not found'));
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function deleteCertification(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM certifications WHERE id = $1', [id]);

    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    next(error);
  }
}

