import { gradeSelectedAnswers } from '../utils/gradeSelectedAnswers';

describe('gradeSelectedAnswers', () => {
  const correct = ['c1', 'c2'];

  it('requires exact set equality for multi-select', () => {
    expect(gradeSelectedAnswers(['c1', 'c2'], correct).isCorrect).toBe(true);
    expect(gradeSelectedAnswers(['c2', 'c1'], correct).isCorrect).toBe(true);
  });

  it('treats partial correct sets as incorrect', () => {
    expect(gradeSelectedAnswers(['c1'], correct).isCorrect).toBe(false);
  });

  it('treats mixed correct+wrong sets as incorrect', () => {
    expect(gradeSelectedAnswers(['c1', 'w1'], correct).isCorrect).toBe(false);
  });

  it('detects duplicate answer IDs', () => {
    const result = gradeSelectedAnswers(['c1', 'c1', 'c2'], correct);
    expect(result.hasDuplicates).toBe(true);
    expect(result.isCorrect).toBe(false);
  });

  it('rejects supersets of the correct answers', () => {
    expect(gradeSelectedAnswers(['c1', 'c2', 'w1'], correct).isCorrect).toBe(false);
  });
});
