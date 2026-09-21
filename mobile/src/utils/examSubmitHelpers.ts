/**
 * Pure helpers for timed-exam submission and review display.
 * Kept free of React Native so they can be unit-tested with Jest fake timers.
 */

export type ExamAnswerValue = {
  answerId?: string;
  answerIds?: string[];
  dragMatches?: { [leftId: string]: string };
};

export type ExamSubmitAnswer = {
  questionId: string;
  answerId?: string;
  answerIds?: string[];
  dragMatches?: { [leftId: string]: string };
};

export function toExamSubmitAnswer(
  questionId: string,
  value?: ExamAnswerValue
): ExamSubmitAnswer {
  const payload: ExamSubmitAnswer = { questionId };
  if (!value) return payload;

  if (value.dragMatches && Object.keys(value.dragMatches).length > 0) {
    payload.dragMatches = value.dragMatches;
  } else if (value.answerIds && value.answerIds.length > 0) {
    payload.answerIds = value.answerIds;
    if (value.answerIds.length === 1) {
      payload.answerId = value.answerIds[0];
    }
  } else if (value.answerId) {
    payload.answerId = value.answerId;
  }

  return payload;
}

/** Build a full-assignment payload; unanswered items are questionId-only. */
export function buildExamSubmitPayload(
  questionIds: string[],
  selectedAnswers: { [questionId: string]: ExamAnswerValue | undefined },
  opts?: { forceIncomplete?: boolean }
): { answers: ExamSubmitAnswer[]; blockedIncompleteCount: number } {
  const incomplete = questionIds.filter((id) => {
    const value = selectedAnswers[id];
    if (!value) return true;
    if (value.dragMatches && Object.keys(value.dragMatches).length > 0) return false;
    if (value.answerIds && value.answerIds.length > 0) return false;
    if (value.answerId) return false;
    return true;
  });

  if (!opts?.forceIncomplete && incomplete.length > 0) {
    return { answers: [], blockedIncompleteCount: incomplete.length };
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

export type ReviewAnswerCard = {
  unanswered?: boolean;
  questionType?: string;
  question_type?: string;
  selectedDragMatches?: Array<{ leftLabel: string; rightLabel: string }>;
  correctDragMatches?: Array<{ leftLabel: string; rightLabel: string }>;
  answerLabels?: string[];
  correctAnswerLabels?: string[];
  answerText?: string;
  answer_text?: string;
  options?: Array<{
    id: string;
    answerText: string;
    isCorrect?: boolean;
    selected?: boolean;
    rationale?: string | null;
  }>;
};

export function formatReviewYourAnswer(item: ReviewAnswerCard): string {
  if (item.unanswered) return 'No answer';
  const type = item.questionType || item.question_type;
  if (type === 'drag_and_match') {
    if (!item.selectedDragMatches?.length) return 'No answer';
    return item.selectedDragMatches.map((m) => `${m.leftLabel} → ${m.rightLabel}`).join('\n');
  }
  if (item.answerLabels?.length) return item.answerLabels.join('\n');
  return item.answerText || item.answer_text || 'No answer';
}

export function formatReviewCorrectAnswer(item: ReviewAnswerCard): string | null {
  if (item.correctDragMatches?.length) {
    return item.correctDragMatches.map((m) => `${m.leftLabel} → ${m.rightLabel}`).join('\n');
  }
  if (item.correctAnswerLabels?.length) {
    return item.correctAnswerLabels.join('\n');
  }
  return null;
}
