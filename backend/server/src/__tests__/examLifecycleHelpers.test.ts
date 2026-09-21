import {
  buildExamSubmitPayload,
  computeRemainingSeconds,
  formatReviewCorrectAnswer,
  formatReviewYourAnswer,
  toExamSubmitAnswer,
} from '../utils/examLifecycleHelpers';

describe('exam lifecycle helpers', () => {
  describe('timeout / force-incomplete submit payload', () => {
    it('blocks manual submit when any question is unanswered', () => {
      const result = buildExamSubmitPayload(
        ['q1', 'q2'],
        { q1: { answerId: 'a1' } },
        { forceIncomplete: false }
      );
      expect(result.blockedIncompleteCount).toBe(1);
      expect(result.answers).toEqual([]);
    });

    it('includes unanswered questionId-only rows on forceIncomplete', () => {
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      const result = buildExamSubmitPayload(
        ['q1', 'q2', 'q3'],
        {
          q1: { answerId: 'a1' },
          q3: { answerIds: ['a2', 'a3'] },
        },
        { forceIncomplete: true }
      );

      expect(result.blockedIncompleteCount).toBe(0);
      expect(result.answers).toEqual([
        { questionId: 'q1', answerId: 'a1' },
        { questionId: 'q2' },
        { questionId: 'q3', answerIds: ['a2', 'a3'] },
      ]);

      // Complete expiry: remaining hits zero and payload still covers full assignment
      const remaining = computeRemainingSeconds(now - 15 * 60 * 1000, 15, now);
      expect(remaining).toBe(0);
      expect(result.answers).toHaveLength(3);

      jest.useRealTimers();
    });

    it('builds complete expiry payload when every question already answered', () => {
      const result = buildExamSubmitPayload(
        ['q1', 'q2'],
        {
          q1: { answerId: 'a1' },
          q2: { dragMatches: { A: '1' } },
        },
        { forceIncomplete: true }
      );
      expect(result.answers).toEqual([
        { questionId: 'q1', answerId: 'a1' },
        { questionId: 'q2', dragMatches: { A: '1' } },
      ]);
    });
  });

  describe('review card formatting', () => {
    it('formats select-one / select-multiple labels', () => {
      expect(
        formatReviewYourAnswer({
          questionType: 'select_multiple',
          answerLabels: ['A', 'C'],
        })
      ).toBe('A\nC');
      expect(
        formatReviewCorrectAnswer({
          correctAnswerLabels: ['A', 'B'],
        })
      ).toBe('A\nB');
    });

    it('formats drag mappings and unanswered', () => {
      expect(formatReviewYourAnswer({ unanswered: true })).toBe('No answer');
      expect(
        formatReviewYourAnswer({
          questionType: 'drag_and_match',
          selectedDragMatches: [
            { leftLabel: 'Spike', rightLabel: 'Timeboxed research' },
          ],
        })
      ).toBe('Spike → Timeboxed research');
      expect(
        formatReviewCorrectAnswer({
          correctDragMatches: [{ leftLabel: 'Spike', rightLabel: 'Timeboxed research' }],
        })
      ).toBe('Spike → Timeboxed research');
    });
  });

  it('toExamSubmitAnswer omits empty fields', () => {
    expect(toExamSubmitAnswer('q1')).toEqual({ questionId: 'q1' });
  });
});
