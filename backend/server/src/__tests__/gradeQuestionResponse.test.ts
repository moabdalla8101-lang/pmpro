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

  it('grades drag_and_match by exact opaque-id mapping', () => {
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
        dragMatches: { L0: 'R0', L1: 'R1' },
      }).isCorrect
    ).toBe(true);
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: { L0: 'R0' },
      }).isCorrect
    ).toBe(false);
    // Display-text keys must not pass under the ID contract
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: { A: '1', B: '2' },
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

  it('rejects answer IDs that do not belong to the question options', () => {
    expect(() =>
      gradeQuestionResponse({
        questionType: 'select_one',
        answers,
        answerId: 'other-question-answer',
      })
    ).toThrow(/does not belong/);
  });

  it('rejects select_one with multiple answer IDs', () => {
    expect(() =>
      gradeQuestionResponse({
        questionType: 'select_one',
        answers: [
          { id: 'c1', is_correct: true },
          { id: 'w1', is_correct: false },
        ],
        answerIds: ['c1', 'w1'],
      })
    ).toThrow(/exactly one/);
  });

  it('fails closed for unknown question types', () => {
    expect(() =>
      gradeQuestionResponse({
        questionType: 'fill_in_blank',
        answers: [{ id: 'a1', is_correct: true }],
        answerId: 'a1',
      })
    ).toThrow(/cannot be scored/);
  });

  it('requires answers when allowUnanswered is false', () => {
    expect(() =>
      gradeQuestionResponse({
        questionType: 'select_one',
        answers: [{ id: 'a1', is_correct: true }],
      })
    ).toThrow(/required/);
  });
});
