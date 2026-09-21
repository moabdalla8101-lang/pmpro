/**
 * Pure lifecycle helpers mirrored from mobile for Jest coverage without RN tooling.
 * Keep behavior aligned with mobile/src/utils/examSubmitHelpers.ts
 */

export type ExamAnswerValue = {
  answerId?: string;
  answerIds?: string[];
  dragMatches?: { [leftId: string]: string };
};

export function toExamSubmitAnswer(questionId: string, value?: ExamAnswerValue) {
  const payload: {
    questionId: string;
    answerId?: string;
    answerIds?: string[];
    dragMatches?: { [leftId: string]: string };
  } = { questionId };
  if (!value) return payload;
  if (value.dragMatches && Object.keys(value.dragMatches).length > 0) {
    payload.dragMatches = value.dragMatches;
  } else if (value.answerIds && value.answerIds.length > 0) {
    payload.answerIds = value.answerIds;
    if (value.answerIds.length === 1) payload.answerId = value.answerIds[0];
  } else if (value.answerId) {
    payload.answerId = value.answerId;
  }
  return payload;
}

export function buildExamSubmitPayload(
  questionIds: string[],
  selectedAnswers: { [questionId: string]: ExamAnswerValue | undefined },
  opts?: { forceIncomplete?: boolean }
) {
  const incomplete = questionIds.filter((id) => {
    const value = selectedAnswers[id];
    if (!value) return true;
    if (value.dragMatches && Object.keys(value.dragMatches).length > 0) return false;
    if (value.answerIds && value.answerIds.length > 0) return false;
    if (value.answerId) return false;
    return true;
  });

  if (!opts?.forceIncomplete && incomplete.length > 0) {
    return { answers: [] as ReturnType<typeof toExamSubmitAnswer>[], blockedIncompleteCount: incomplete.length };
  }

  return {
    answers: questionIds.map((id) => toExamSubmitAnswer(id, selectedAnswers[id])),
    blockedIncompleteCount: 0,
  };
}

export function computeRemainingSeconds(
  startedAtMs: number,
  durationMinutes: number,
  nowMs: number = Date.now()
): number {
  const totalSec = durationMinutes * 60;
  const elapsed = Math.max(0, Math.floor((nowMs - startedAtMs) / 1000));
  return Math.max(0, totalSec - elapsed);
}

export function formatReviewYourAnswer(item: {
  unanswered?: boolean;
  questionType?: string;
  selectedDragMatches?: Array<{ leftLabel: string; rightLabel: string }>;
  answerLabels?: string[];
  answerText?: string;
}): string {
  if (item.unanswered) return 'No answer';
  if (item.questionType === 'drag_and_match') {
    if (!item.selectedDragMatches?.length) return 'No answer';
    return item.selectedDragMatches.map((m) => `${m.leftLabel} → ${m.rightLabel}`).join('\n');
  }
  if (item.answerLabels?.length) return item.answerLabels.join('\n');
  return item.answerText || 'No answer';
}

export function formatReviewCorrectAnswer(item: {
  correctDragMatches?: Array<{ leftLabel: string; rightLabel: string }>;
  correctAnswerLabels?: string[];
}): string | null {
  if (item.correctDragMatches?.length) {
    return item.correctDragMatches.map((m) => `${m.leftLabel} → ${m.rightLabel}`).join('\n');
  }
  if (item.correctAnswerLabels?.length) return item.correctAnswerLabels.join('\n');
  return null;
}
