import {
  assertNoClientAuthoritativeScoreFields,
  assertScorableQuestionType,
  safeExamScore,
} from '../utils/authoritativeScoring';

describe('authoritativeScoring helpers', () => {
  it('rejects client-authored score fields', () => {
    expect(() =>
      assertNoClientAuthoritativeScoreFields({ isCorrect: true }, 'Practice')
    ).toThrow(/isCorrect/);
    expect(() =>
      assertNoClientAuthoritativeScoreFields(
        { answers: [{ questionId: 'q', score: 100 }] },
        'Exam'
      )
    ).toThrow(/score/);
  });

  it('whitelists scorable types and fails closed otherwise', () => {
    expect(assertScorableQuestionType('select_one')).toBe('select_one');
    expect(assertScorableQuestionType('multiple_choice')).toBe('select_one');
    expect(assertScorableQuestionType('select_multiple')).toBe('select_multiple');
    expect(() => assertScorableQuestionType('essay')).toThrow(/cannot be scored/);
  });

  it('clamps scores and avoids division by zero', () => {
    expect(safeExamScore(3, 0)).toEqual({ correctAnswers: 0, totalQuestions: 0, score: 0 });
    expect(safeExamScore(-1, 10)).toEqual({ correctAnswers: 0, totalQuestions: 10, score: 0 });
    expect(safeExamScore(12, 10)).toEqual({ correctAnswers: 10, totalQuestions: 10, score: 100 });
    expect(safeExamScore(1, 4).score).toBe(25);
  });
});
