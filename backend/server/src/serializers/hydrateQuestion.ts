import { pool } from '../db/connection';
import {
  serializeAdminQuestion,
  serializeLearnerQuestion,
  QuestionRow,
  AnswerRow,
} from '../serializers/questionSerializers';

export async function fetchAnswersForQuestion(questionId: string): Promise<AnswerRow[]> {
  const result = await pool.query(
    'SELECT * FROM answers WHERE question_id = $1 ORDER BY "order"',
    [questionId]
  );
  return result.rows;
}

export async function fetchKnowledgeAreaName(
  knowledgeAreaId: string | null | undefined
): Promise<string | null> {
  if (!knowledgeAreaId) return null;
  const result = await pool.query('SELECT name FROM knowledge_areas WHERE id = $1', [
    knowledgeAreaId,
  ]);
  return result.rows[0]?.name ?? null;
}

export async function hydrateQuestion(
  question: QuestionRow,
  options: { admin: boolean }
) {
  const answers = await fetchAnswersForQuestion(question.id);
  const knowledgeAreaName = await fetchKnowledgeAreaName(
    question.knowledge_area_id ?? question.knowledgeAreaId
  );

  if (options.admin) {
    return serializeAdminQuestion(question, answers, knowledgeAreaName);
  }
  return serializeLearnerQuestion(question, answers, knowledgeAreaName);
}

export async function hydrateQuestions(
  questions: QuestionRow[],
  options: { admin: boolean }
) {
  return Promise.all(questions.map((q) => hydrateQuestion(q, options)));
}
