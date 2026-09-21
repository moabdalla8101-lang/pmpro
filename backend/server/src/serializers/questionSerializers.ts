/**
 * Centralized question response contracts.
 * Learner pre-answer payloads must never leak correctness or teaching material.
 */

export type QuestionRow = Record<string, any>;
export type AnswerRow = Record<string, any>;

/** Fields that must never appear in learner pre-answer responses (any nesting). */
export const LEARNER_FORBIDDEN_KEYS = [
  'isCorrect',
  'is_correct',
  'correctAnswerId',
  'correctAnswerIds',
  'correct_answer_id',
  'correct_answer_ids',
  'correctAnswers',
  'correct_answers',
  'explanation',
  'explanationImages',
  'explanation_images',
  'rationale',
  'rationales',
  'score',
  'scoring',
  'matches', // drag_and_match answer key in question_metadata
  'correctMatches',
  'correct_matches',
  'dragDropPairs',
  'drag_drop_pairs',
] as const;

export const MAX_LEARNER_QUESTION_PAGE_SIZE = 50;
export const DEFAULT_LEARNER_QUESTION_PAGE_SIZE = 25;

export type LearnerAnswer = {
  id: string;
  questionId: string;
  answerText: string;
  order: number;
};

export type LearnerQuestion = {
  id: string;
  questionId?: string | null;
  certificationId: string;
  knowledgeAreaId: string;
  knowledgeAreaName?: string | null;
  questionText: string;
  difficulty: string;
  questionType?: string | null;
  question_type?: string | null;
  domain?: string | null;
  task?: string | null;
  pmApproach?: string | null;
  pm_approach?: string | null;
  questionMetadata?: any;
  question_metadata?: any;
  questionImages?: any;
  question_images?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  answers: LearnerAnswer[];
};

export type AdminAnswer = LearnerAnswer & {
  isCorrect: boolean;
  rationale?: string | null;
  createdAt?: string;
};

export type AdminQuestion = Omit<LearnerQuestion, 'answers' | 'questionMetadata' | 'question_metadata'> & {
  explanation?: string | null;
  explanationImages?: any;
  explanation_images?: any;
  questionMetadata?: any;
  question_metadata?: any;
  answers: AdminAnswer[];
};

export type AnsweredQuestionFeedback = {
  questionId: string;
  attemptId?: string;
  userAnswerId?: string;
  userAnswerIds?: string[];
  isCorrect: boolean;
  correctAnswerIds: string[];
  explanation?: string | null;
  explanationImages?: any;
  answers: Array<{
    id: string;
    answerText: string;
    isCorrect: boolean;
    rationale?: string | null;
    order: number;
  }>;
  /** Present for drag_and_match after submission */
  correctMatches?: Record<string, string> | null;
};

function parseJsonField(value: any): any {
  if (value == null) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Convert paired drag/drop answer keys into unpaired prompt lists.
 * Preserves left/right item text for UI without revealing which pairs match.
 */
export function transformDragDropPairsForLearner(pairs: any[]): {
  leftItems: string[];
  rightItems: string[];
} {
  const leftItems = pairs
    .map((pair) => pair?.left_item ?? pair?.left ?? pair?.leftItem)
    .filter((v) => v != null)
    .map(String);
  const rightItems = pairs
    .map((pair) => pair?.right_item ?? pair?.right ?? pair?.rightItem)
    .filter((v) => v != null)
    .map(String);

  return {
    leftItems: shuffleInPlace([...leftItems]),
    rightItems: shuffleInPlace([...rightItems]),
  };
}

/** Strip answer-key material from drag_and_match metadata for learners. */
export function sanitizeLearnerQuestionMetadata(metadata: any): any {
  const parsed = parseJsonField(metadata);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return parsed;
  }

  const {
    matches,
    correctMatches,
    correct_matches,
    dragDropPairs,
    drag_drop_pairs,
    ...rest
  } = parsed;

  const safe: Record<string, any> = { ...rest };
  const pairs = dragDropPairs ?? drag_drop_pairs;

  if (Array.isArray(pairs) && pairs.length > 0) {
    const { leftItems, rightItems } = transformDragDropPairsForLearner(pairs);
    // Prefer transformed unpaired lists; keep existing lists only if pairs absent
    if (!safe.leftItems && !safe.left_items) {
      safe.leftItems = leftItems;
      safe.left_items = leftItems;
    }
    if (!safe.rightItems && !safe.right_items) {
      safe.rightItems = rightItems;
      safe.right_items = rightItems;
    }
  }

  return safe;
}

export function serializeLearnerAnswer(answer: AnswerRow): LearnerAnswer {
  return {
    id: answer.id,
    questionId: answer.question_id ?? answer.questionId,
    answerText: answer.answer_text ?? answer.answerText,
    order: answer.order ?? 0,
  };
}

export function serializeAdminAnswer(answer: AnswerRow): AdminAnswer {
  return {
    ...serializeLearnerAnswer(answer),
    isCorrect: Boolean(answer.is_correct ?? answer.isCorrect),
    rationale: answer.rationale ?? answer.rationales ?? null,
    createdAt: answer.created_at ?? answer.createdAt,
  };
}

export function serializeLearnerQuestion(
  question: QuestionRow,
  answers: AnswerRow[],
  knowledgeAreaName?: string | null
): LearnerQuestion {
  const questionType = question.question_type ?? question.questionType ?? null;
  const metadata = sanitizeLearnerQuestionMetadata(
    question.question_metadata ?? question.questionMetadata
  );
  const images = parseJsonField(question.question_images ?? question.questionImages);

  return {
    id: question.id,
    questionId: question.question_id ?? question.questionId ?? null,
    certificationId: question.certification_id ?? question.certificationId,
    knowledgeAreaId: question.knowledge_area_id ?? question.knowledgeAreaId,
    knowledgeAreaName: knowledgeAreaName ?? null,
    questionText: question.question_text ?? question.questionText,
    difficulty: question.difficulty,
    questionType,
    question_type: questionType,
    domain: question.domain ?? null,
    task: question.task ?? null,
    pmApproach: question.pm_approach ?? question.pmApproach ?? null,
    pm_approach: question.pm_approach ?? question.pmApproach ?? null,
    questionMetadata: metadata,
    question_metadata: metadata,
    questionImages: images,
    question_images: images,
    isActive: Boolean(question.is_active ?? question.isActive ?? true),
    createdAt: question.created_at ?? question.createdAt,
    updatedAt: question.updated_at ?? question.updatedAt,
    answers: answers.map(serializeLearnerAnswer),
  };
}

export function serializeAdminQuestion(
  question: QuestionRow,
  answers: AnswerRow[],
  knowledgeAreaName?: string | null
): AdminQuestion {
  const questionType = question.question_type ?? question.questionType ?? null;
  const metadata = parseJsonField(question.question_metadata ?? question.questionMetadata);
  const images = parseJsonField(question.question_images ?? question.questionImages);
  const explanationImages = parseJsonField(
    question.explanation_images ?? question.explanationImages
  );

  return {
    id: question.id,
    questionId: question.question_id ?? question.questionId ?? null,
    certificationId: question.certification_id ?? question.certificationId,
    knowledgeAreaId: question.knowledge_area_id ?? question.knowledgeAreaId,
    knowledgeAreaName: knowledgeAreaName ?? null,
    questionText: question.question_text ?? question.questionText,
    explanation: question.explanation ?? null,
    difficulty: question.difficulty,
    questionType,
    question_type: questionType,
    domain: question.domain ?? null,
    task: question.task ?? null,
    pmApproach: question.pm_approach ?? question.pmApproach ?? null,
    pm_approach: question.pm_approach ?? question.pmApproach ?? null,
    questionMetadata: metadata,
    question_metadata: metadata,
    questionImages: images,
    question_images: images,
    explanationImages,
    explanation_images: explanationImages,
    isActive: Boolean(question.is_active ?? question.isActive ?? true),
    createdAt: question.created_at ?? question.createdAt,
    updatedAt: question.updated_at ?? question.updatedAt,
    answers: answers.map(serializeAdminAnswer),
  };
}

export function serializeAnsweredQuestionFeedback(
  question: QuestionRow,
  answers: AnswerRow[],
  options: {
    isCorrect: boolean;
    attemptId?: string;
    userAnswerId?: string;
    userAnswerIds?: string[];
  }
): AnsweredQuestionFeedback {
  const correctAnswerIds = answers
    .filter((a) => Boolean(a.is_correct ?? a.isCorrect))
    .map((a) => a.id);

  const explanationImages = parseJsonField(
    question.explanation_images ?? question.explanationImages
  );
  const metadata = parseJsonField(question.question_metadata ?? question.questionMetadata);
  let correctMatches: Record<string, string> | null = null;
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    correctMatches =
      metadata.matches ??
      metadata.correctMatches ??
      null;
    if (!correctMatches && Array.isArray(metadata.dragDropPairs ?? metadata.drag_drop_pairs)) {
      const pairs = metadata.dragDropPairs ?? metadata.drag_drop_pairs;
      correctMatches = {};
      for (const pair of pairs) {
        const left = pair?.left_item ?? pair?.left ?? pair?.leftItem;
        const right = pair?.right_item ?? pair?.right ?? pair?.rightItem;
        if (left != null && right != null) {
          correctMatches[String(left)] = String(right);
        }
      }
    }
  }

  return {
    questionId: question.id,
    attemptId: options.attemptId,
    userAnswerId: options.userAnswerId,
    userAnswerIds: options.userAnswerIds,
    isCorrect: options.isCorrect,
    correctAnswerIds,
    explanation: question.explanation ?? null,
    explanationImages,
    answers: answers.map((a) => ({
      id: a.id,
      answerText: a.answer_text ?? a.answerText,
      isCorrect: Boolean(a.is_correct ?? a.isCorrect),
      rationale: a.rationale ?? null,
      order: a.order ?? 0,
    })),
    correctMatches,
  };
}

/**
 * Recursively collect forbidden key paths present in a learner-facing payload.
 * Used by automated tests (and optional runtime asserts).
 */
export function findLearnerForbiddenFields(
  value: unknown,
  path: string = ''
): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) =>
      findLearnerForbiddenFields(item, path ? `${path}[${i}]` : `[${i}]`)
    );
  }
  if (typeof value !== 'object') return [];

  const hits: string[] = [];
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const childPath = path ? `${path}.${key}` : key;
    if ((LEARNER_FORBIDDEN_KEYS as readonly string[]).includes(key)) {
      hits.push(childPath);
    }
    hits.push(...findLearnerForbiddenFields(child, childPath));
  }
  return hits;
}

export function assertNoLearnerLeaks(payload: unknown, context: string): void {
  const leaks = findLearnerForbiddenFields(payload);
  if (leaks.length > 0) {
    throw new Error(
      `Learner payload leak in ${context}: ${leaks.slice(0, 20).join(', ')}`
    );
  }
}

export function clampLearnerPageSize(limit: unknown): number {
  const parsed = typeof limit === 'string' || typeof limit === 'number'
    ? parseInt(String(limit), 10)
    : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LEARNER_QUESTION_PAGE_SIZE;
  }
  return Math.min(parsed, MAX_LEARNER_QUESTION_PAGE_SIZE);
}
