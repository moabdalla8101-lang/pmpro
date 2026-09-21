import { gradeSelectedAnswers } from './gradeSelectedAnswers';

export type GradeQuestionInput = {
  questionType?: string | null;
  questionMetadata?: any;
  answers: Array<{ id: string; is_correct?: boolean; isCorrect?: boolean }>;
  answerId?: string;
  answerIds?: string[];
  dragMatches?: Record<string, string>;
};

export type GradeQuestionResult = {
  isCorrect: boolean;
  selectedIds: string[];
  responseJson: Record<string, unknown>;
};

function parseMetadata(metadata: any): any {
  if (metadata == null) return null;
  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  }
  return metadata;
}

function correctMatchesFromMetadata(metadata: any): Record<string, string> {
  const parsed = parseMetadata(metadata);
  if (!parsed || typeof parsed !== 'object') return {};

  let correctMatches: Record<string, string> =
    parsed.matches || parsed.correctMatches || parsed.correct_matches || {};

  if (
    Object.keys(correctMatches).length === 0 &&
    Array.isArray(parsed.dragDropPairs || parsed.drag_drop_pairs)
  ) {
    correctMatches = {};
    for (const pair of parsed.dragDropPairs || parsed.drag_drop_pairs) {
      const left = pair?.left_item ?? pair?.left ?? pair?.leftItem;
      const right = pair?.right_item ?? pair?.right ?? pair?.rightItem;
      if (left != null && right != null) {
        correctMatches[String(left)] = String(right);
      }
    }
  }

  return Object.fromEntries(
    Object.entries(correctMatches).map(([k, v]) => [String(k), String(v)])
  );
}

/**
 * Shared grader for practice and exam submissions.
 * Supports select_one / select_multiple (exact set) and drag_and_match (exact mapping).
 */
export function gradeQuestionResponse(input: GradeQuestionInput): GradeQuestionResult {
  const questionType = input.questionType || 'select_one';

  if (questionType === 'drag_and_match') {
    const dragMatches = input.dragMatches || {};
    const correctMatches = correctMatchesFromMetadata(input.questionMetadata);
    const leftKeys = Object.keys(correctMatches);
    const isCorrect =
      leftKeys.length > 0 &&
      leftKeys.every((key) => String(dragMatches[key]) === String(correctMatches[key])) &&
      Object.keys(dragMatches).length === leftKeys.length;

    return {
      isCorrect,
      selectedIds: [],
      responseJson: { dragMatches, questionType },
    };
  }

  const rawIds: string[] = Array.isArray(input.answerIds)
    ? input.answerIds
    : input.answerId
      ? [input.answerId]
      : [];

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
