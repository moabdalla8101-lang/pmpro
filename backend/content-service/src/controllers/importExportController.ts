import { Request, Response, NextFunction } from 'express';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export async function importQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    const records = await parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    const imported = [];
    const errors = [];

    for (const record of records) {
      try {
        const questionId = uuidv4();
        
        // Create question
        await pool.query(
          `INSERT INTO questions (id, certification_id, knowledge_area_id, question_text, explanation, difficulty, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
          [
            questionId,
            record.certificationId,
            record.knowledgeAreaId,
            record.questionText,
            record.explanation || null,
            record.difficulty || 'medium'
          ]
        );

        // Parse and create answers
        const answers = JSON.parse(record.answers || '[]');
        for (let i = 0; i < answers.length; i++) {
          const answer = answers[i];
          const answerId = uuidv4();
          await pool.query(
            `INSERT INTO answers (id, question_id, answer_text, is_correct, "order", created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [answerId, questionId, answer.answerText, answer.isCorrect, i]
          );
        }

        imported.push(questionId);
      } catch (error: any) {
        errors.push({ row: record, error: error.message });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors
    });
  } catch (error) {
    next(error);
  }
}

export async function exportQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const { certificationId } = req.query;

    let query = `
      SELECT q.*, 
             json_agg(
               json_build_object(
                 'answerText', a.answer_text,
                 'isCorrect', a.is_correct,
                 'order', a."order"
               ) ORDER BY a."order"
             ) as answers
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
    `;

    const params: any[] = [];
    if (certificationId) {
      query += ' WHERE q.certification_id = $1';
      params.push(certificationId);
    }

    query += ' GROUP BY q.id';

    const result = await pool.query(query, params);

    const records = result.rows.map((row: any) => ({
      certificationId: row.certification_id,
      knowledgeAreaId: row.knowledge_area_id,
      questionText: row.question_text,
      explanation: row.explanation,
      difficulty: row.difficulty,
      answers: JSON.stringify(row.answers)
    }));

    const csv = await new Promise<string>((resolve, reject) => {
      stringify(records, { header: true }, (err, output) => {
        if (err) reject(err);
        else resolve(output);
      });
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=questions.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
}


