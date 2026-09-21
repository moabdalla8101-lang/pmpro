import { gradeSelectedAnswers } from './gradeSelectedAnswers';
import { normalizeDragMetadata } from './normalizeDragMetadata';

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
 */
export function gradeQuestionResponse(input: GradeQuestionInput): GradeQuestionResult {
  const questionType = input.questionType || 'select_one';

  if (questionType === 'drag_and_match') {
    const dragMatches = input.dragMatches || {};
    const normalized = normalizeDragMetadata(input.questionMetadata);

    if (Object.keys(dragMatches).length === 0) {
      return {
        isCorrect: false,
        selectedIds: [],
        unanswered: true,
        responseJson: { dragMatches: {}, questionType, unanswered: true },
      };
    }

    const leftKeys = Object.keys(normalized.correctMatches);
    const isCorrect =
      normalized.usable &&
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
    ? input.answerIds
    : input.answerId
      ? [input.answerId]
      : [];

  if (rawIds.length === 0) {
    return {
      isCorrect: false,
      selectedIds: [],
      unanswered: true,
      responseJson: { selectedAnswerIds: [], questionType, unanswered: true },
    };
  }

  const correctIds = input.answers
    .filter((a) => Boolean(a.is_correct ?? a.isCorrect))
    .map((a) => a.id);

  const graded = gradeSelectedAnswers(rawIds.map(String), correctIds);
  if (graded.hasDuplicates) {
    throw new Error('Duplicate answer IDs are not allowed');
  }

  return {
    isCorrect: graded.isCorrect,
    selectedIds: graded.uniqueSelectedIds,
    responseJson: { selectedAnswerIds: graded.uniqueSelectedIds, questionType },
  };
}
