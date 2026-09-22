/**
 * Supported learner-scorable item types.
 * Unknown types must fail closed — never fall through to single-select grading.
 */
export const SCORABLE_QUESTION_TYPES = [
  'select_one',
  'multiple_choice', // legacy alias treated as select_one
  'select_multiple',
  'drag_and_match',
] as const;

export type ScorableQuestionType = (typeof SCORABLE_QUESTION_TYPES)[number];

export function normalizeQuestionType(raw?: string | null): string {
  const t = (raw || 'select_one').trim();
  if (t === 'multiple_choice') return 'select_one';
  return t;
}

export function assertScorableQuestionType(raw?: string | null): string {
  const t = normalizeQuestionType(raw);
  if (t !== 'select_one' && t !== 'select_multiple' && t !== 'drag_and_match') {
    throw new Error(
      `Question type "${raw || 'unknown'}" cannot be scored by this endpoint`
    );
  }
  return t;
}

/** Client must never supply derived scoring fields as authoritative input. */
const FORBIDDEN_CLIENT_SCORE_KEYS = [
  'isCorrect',
  'is_correct',
  'score',
  'correctAnswers',
  'correct_answers',
  'correctCount',
  'totalQuestions',
  'total_questions',
  'accuracy',
  'subscriptionTier',
  'subscription_tier',
];

export function assertNoClientAuthoritativeScoreFields(body: any, context: string): void {
  if (!body || typeof body !== 'object') return;
  for (const key of FORBIDDEN_CLIENT_SCORE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      throw new Error(`${context} must not include client-authored "${key}"`);
    }
  }
  if (Array.isArray(body.answers)) {
    for (const row of body.answers) {
      if (!row || typeof row !== 'object') continue;
      for (const key of FORBIDDEN_CLIENT_SCORE_KEYS) {
        if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== undefined) {
          throw new Error(`${context} answer entries must not include client-authored "${key}"`);
        }
      }
    }
  }
}

export function safeExamScore(correctCount: number, totalQuestions: number): {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
} {
  const total = Math.max(0, Math.floor(Number(totalQuestions) || 0));
  const correct = Math.max(0, Math.min(total, Math.floor(Number(correctCount) || 0)));
  if (total === 0) {
    return { correctAnswers: 0, totalQuestions: 0, score: 0 };
  }
  const score = Math.min(100, Math.max(0, (correct / total) * 100));
  return { correctAnswers: correct, totalQuestions: total, score };
}
