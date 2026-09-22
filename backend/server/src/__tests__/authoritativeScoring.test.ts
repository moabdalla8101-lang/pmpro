import {
  assertNoClientAuthoritativeScoreFields,
  assertScorableQuestionType,
  normalizeQuestionType,
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
    expect(() =>
      assertNoClientAuthoritativeScoreFields({ accuracy: 1 }, 'Practice')
    ).toThrow(/accuracy/);
    expect(() =>
      assertNoClientAuthoritativeScoreFields({ subscriptionTier: 'pro' }, 'Practice')
    ).toThrow(/subscriptionTier/);
  });

  it('allows legitimate answer payloads without score fields', () => {
    expect(() =>
      assertNoClientAuthoritativeScoreFields(
        { questionId: 'q', answerId: 'a', certificationId: 'c' },
        'Practice'
      )
    ).not.toThrow();
    expect(() =>
      assertNoClientAuthoritativeScoreFields(
        { answers: [{ questionId: 'q', answerId: 'a' }] },
        'Exam'
      )
    ).not.toThrow();
  });

  it('whitelists scorable types and fails closed otherwise', () => {
    expect(assertScorableQuestionType('select_one')).toBe('select_one');
    expect(assertScorableQuestionType('multiple_choice')).toBe('select_one');
    expect(assertScorableQuestionType('select_multiple')).toBe('select_multiple');
    expect(assertScorableQuestionType('drag_and_match')).toBe('drag_and_match');
    expect(() => assertScorableQuestionType('essay')).toThrow(/cannot be scored/);
    expect(() => assertScorableQuestionType('fill_blank')).toThrow(/cannot be scored/);
    // Missing type defaults to select_one (legacy rows without question_type).
    expect(assertScorableQuestionType(null)).toBe('select_one');
    expect(assertScorableQuestionType(undefined)).toBe('select_one');
  });

  it('normalizes legacy multiple_choice alias', () => {
    expect(normalizeQuestionType('multiple_choice')).toBe('select_one');
    expect(normalizeQuestionType('select_one')).toBe('select_one');
    expect(normalizeQuestionType(undefined)).toBe('select_one');
  });

  it('clamps scores and avoids division by zero', () => {
    expect(safeExamScore(3, 0)).toEqual({ correctAnswers: 0, totalQuestions: 0, score: 0 });
    expect(safeExamScore(-1, 10)).toEqual({ correctAnswers: 0, totalQuestions: 10, score: 0 });
    expect(safeExamScore(12, 10)).toEqual({ correctAnswers: 10, totalQuestions: 10, score: 100 });
    expect(safeExamScore(1, 4).score).toBe(25);
    expect(safeExamScore(NaN, 5)).toEqual({ correctAnswers: 0, totalQuestions: 5, score: 0 });
  });
});
