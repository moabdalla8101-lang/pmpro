import { gradeSelectedAnswers } from './gradeSelectedAnswers';
import { normalizeDragMetadata } from './normalizeDragMetadata';
import { assertScorableQuestionType } from './authoritativeScoring';

export type GradeQuestionInput = {
  questionType?: string | null;
  questionMetadata?: any;
  answers: Array<{ id: string; is_correct?: boolean; isCorrect?: boolean }>;
  answerId?: string;
  answerIds?: string[];
  dragMatches?: Record<string, string>;
  /** When true, empty answers are recorded as incorrect instead of rejected. */
  allowUnanswered?: boolean;
};

export type GradeQuestionResult = {
  isCorrect: boolean;
  selectedIds: string[];
  responseJson: Record<string, unknown>;
  unanswered?: boolean;
};

/**
 * Shared grader for practice and exam submissions.
 * Supports select_one / select_multiple (exact set) and drag_and_match (exact ID mapping).
 * Unknown types fail closed — never scored as single-select.
 */
export function gradeQuestionResponse(input: GradeQuestionInput): GradeQuestionResult {
  const questionType = assertScorableQuestionType(input.questionType);

  if (questionType === 'drag_and_match') {
    const dragMatches = input.dragMatches || {};
    const normalized = normalizeDragMetadata(input.questionMetadata);

    if (Object.keys(dragMatches).length === 0) {
      if (!input.allowUnanswered) {
        throw new Error('dragMatches are required for drag_and_match questions');
      }
      return {
        isCorrect: false,
        selectedIds: [],
        unanswered: true,
        responseJson: { dragMatches: {}, questionType, unanswered: true },
      };
    }

    // Reject display-text-only payloads that don't use opaque ids when usable metadata exists
    if (!normalized.usable) {
      throw new Error('drag_and_match question metadata is not scorable');
    }

    const leftKeys = Object.keys(normalized.correctMatches);
    const isCorrect =
      leftKeys.length > 0 &&
      leftKeys.every((key) => String(dragMatches[key]) === String(normalized.correctMatches[key])) &&
      Object.keys(dragMatches).length === leftKeys.length;

    return {
      isCorrect,
      selectedIds: [],
      responseJson: {
        dragMatches,
        questionType,
      },
    };
  }

  const rawIds: string[] = Array.isArray(input.answerIds)
    ? input.answerIds.map(String)
    : input.answerId
      ? [String(input.answerId)]
      : [];

  if (rawIds.length === 0) {
    if (!input.allowUnanswered) {
      throw new Error('answerId or answerIds are required');
    }
    return {
      isCorrect: false,
      selectedIds: [],
      unanswered: true,
      responseJson: { selectedAnswerIds: [], questionType, unanswered: true },
    };
  }

  if (questionType === 'select_one' && rawIds.length !== 1) {
    throw new Error('select_one requires exactly one answerId');
  }

  if (questionType === 'select_multiple' && rawIds.length < 1) {
    throw new Error('select_multiple requires at least one answerId');
  }

  // Ownership is validated by the caller against options for this question only.
  const optionIds = new Set(input.answers.map((a) => String(a.id)));
  for (const id of rawIds) {
    if (!optionIds.has(id)) {
      throw new Error('Answer does not belong to question');
    }
  }

  const correctIds = input.answers
    .filter((a) => Boolean(a.is_correct ?? a.isCorrect))
    .map((a) => a.id);

  const graded = gradeSelectedAnswers(rawIds, correctIds);
  if (graded.hasDuplicates) {
    throw new Error('Duplicate answer IDs are not allowed');
  }

  return {
    isCorrect: graded.isCorrect,
    selectedIds: graded.uniqueSelectedIds,
    responseJson: { selectedAnswerIds: graded.uniqueSelectedIds, questionType },
  };
}
