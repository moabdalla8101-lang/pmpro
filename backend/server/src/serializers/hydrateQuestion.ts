import { pool } from '../db/connection';
import {
  serializeAdminQuestion,
  serializeLearnerQuestion,
  QuestionRow,
  AnswerRow,
} from '../serializers/questionSerializers';

export async function fetchAnswersForQuestions(
  questionIds: string[]
): Promise<Map<string, AnswerRow[]>> {
  const map = new Map<string, AnswerRow[]>();
  if (questionIds.length === 0) return map;

  const result = await pool.query(
    `SELECT * FROM answers
     WHERE question_id = ANY($1::uuid[])
     ORDER BY question_id, "order"`,
    [questionIds]
  );

  for (const row of result.rows) {
    const list = map.get(row.question_id) || [];
    list.push(row);
    map.set(row.question_id, list);
  }
  return map;
}

export async function fetchKnowledgeAreaNames(
  knowledgeAreaIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(knowledgeAreaIds.filter(Boolean))];
  if (unique.length === 0) return map;

  const result = await pool.query(
    `SELECT id, name FROM knowledge_areas WHERE id = ANY($1::uuid[])`,
    [unique]
  );
  for (const row of result.rows) {
    map.set(row.id, row.name);
  }
  return map;
}

export async function hydrateQuestion(
  question: QuestionRow,
  options: { admin: boolean }
) {
  const [answersMap, kaMap] = await Promise.all([
    fetchAnswersForQuestions([question.id]),
    fetchKnowledgeAreaNames([
      question.knowledge_area_id ?? question.knowledgeAreaId,
    ].filter(Boolean)),
  ]);

  const answers = answersMap.get(question.id) || [];
  const knowledgeAreaName =
    kaMap.get(question.knowledge_area_id ?? question.knowledgeAreaId) ?? null;

  if (options.admin) {
    return serializeAdminQuestion(question, answers, knowledgeAreaName);
  }
  return serializeLearnerQuestion(question, answers, knowledgeAreaName);
}

/** Set-based hydration: 2 queries total regardless of page size. */
export async function hydrateQuestions(
  questions: QuestionRow[],
  options: { admin: boolean }
) {
  if (questions.length === 0) return [];

  const questionIds = questions.map((q) => q.id);
  const kaIds = questions
    .map((q) => q.knowledge_area_id ?? q.knowledgeAreaId)
    .filter(Boolean);

  const [answersMap, kaMap] = await Promise.all([
    fetchAnswersForQuestions(questionIds),
    fetchKnowledgeAreaNames(kaIds),
  ]);

  return questions.map((question) => {
    const answers = answersMap.get(question.id) || [];
    const knowledgeAreaName =
      kaMap.get(question.knowledge_area_id ?? question.knowledgeAreaId) ?? null;
    if (options.admin) {
      return serializeAdminQuestion(question, answers, knowledgeAreaName);
    }
    return serializeLearnerQuestion(question, answers, knowledgeAreaName);
  });
}
