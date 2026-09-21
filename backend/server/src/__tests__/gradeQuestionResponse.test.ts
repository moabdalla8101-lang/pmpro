import { gradeQuestionResponse } from '../utils/gradeQuestionResponse';

describe('gradeQuestionResponse', () => {
  const answers = [
    { id: 'a1', is_correct: true },
    { id: 'a2', is_correct: true },
    { id: 'a3', is_correct: false },
  ];

  it('grades select_one with exact single id', () => {
    const single = [
      { id: 'c1', is_correct: true },
      { id: 'w1', is_correct: false },
    ];
    expect(
      gradeQuestionResponse({
        questionType: 'select_one',
        answers: single,
        answerId: 'c1',
      }).isCorrect
    ).toBe(true);
    expect(
      gradeQuestionResponse({
        questionType: 'select_one',
        answers: single,
        answerId: 'w1',
      }).isCorrect
    ).toBe(false);
  });

  it('requires exact set for select_multiple', () => {
    expect(
      gradeQuestionResponse({
        questionType: 'select_multiple',
        answers,
        answerIds: ['a1'],
      }).isCorrect
    ).toBe(false);
    expect(
      gradeQuestionResponse({
        questionType: 'select_multiple',
        answers,
        answerIds: ['a1', 'a2'],
      }).isCorrect
    ).toBe(true);
    expect(
      gradeQuestionResponse({
        questionType: 'select_multiple',
        answers,
        answerIds: ['a1', 'a3'],
      }).isCorrect
    ).toBe(false);
  });

  it('grades drag_and_match by exact mapping', () => {
    const metadata = {
      dragDropPairs: [
        { left_item: 'A', right_item: '1' },
        { left_item: 'B', right_item: '2' },
      ],
    };
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: { A: '1', B: '2' },
      }).isCorrect
    ).toBe(true);
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: { A: '1' },
      }).isCorrect
    ).toBe(false);
  });

  it('rejects duplicate answer IDs', () => {
    expect(() =>
      gradeQuestionResponse({
        questionType: 'select_multiple',
        answers,
        answerIds: ['a1', 'a1'],
      })
    ).toThrow(/Duplicate/);
  });
});
