import { normalizeDragMetadata, learnerDragPromptFromMetadata } from '../utils/normalizeDragMetadata';
import { gradeQuestionResponse } from '../utils/gradeQuestionResponse';

/** Real-bank shapes from questions_export (active drag_and_match records). */
const REAL_BANK_SHAPES: Array<{ id: string; metadata: any; expectUsable: boolean }> = [
  {
    id: '22',
    expectUsable: true,
    metadata: {
      matches: { A: 1, B: 2, C: 3, D: 4, E: 5 },
      leftItems: [
        { text: 'The list of key project stakeholders', letter: 'A' },
        { text: 'High-level requirements', letter: 'B' },
        { text: 'Summary milestone schedule', letter: 'C' },
        { text: 'Overall project risks', letter: 'D' },
        { text: 'Project purpose / justification', letter: 'E' },
      ],
      rightItems: [
        { text: 'Project charter', index: 1 },
        { text: 'Stakeholder register', index: 2 },
        { text: 'Requirements documentation', index: 3 },
        { text: 'Project schedule', index: 4 },
        { text: 'Risk register', index: 5 },
      ],
    },
  },
  {
    id: '2-object-letter-index',
    expectUsable: true,
    metadata: {
      matches: { A: 4, B: 1, C: 5, D: 2, E: 3 },
      leftItems: [
        { text: 'Timeboxed research or experiments', letter: 'A' },
        { text: 'Frequent integration of work', letter: 'B' },
        { text: 'Team decides how to do the work', letter: 'C' },
        { text: 'Work in progress limits', letter: 'D' },
        { text: 'Deliver working product frequently', letter: 'E' },
      ],
      rightItems: [
        { text: 'Continuous integration', index: 1 },
        { text: 'Kanban', index: 2 },
        { text: 'Incremental delivery', index: 3 },
        { text: 'Spike', index: 4 },
        { text: 'Self-organizing team', index: 5 },
      ],
    },
  },
  {
    id: '520999-string-lists',
    expectUsable: true,
    metadata: {
      matches: {
        '(Not applicable)': 'Business analysis',
        'Corrective actions regarding the cost': 'Cost control',
        'Forecast performance based on results': 'Earned value',
      },
      leftItems: [
        '(Not applicable)',
        'Corrective actions regarding the cost',
        'Forecast performance based on results',
      ],
      rightItems: ['Business analysis', 'Cost control', 'Earned value'],
    },
  },
  {
    id: 'INTEGRATION-1-pairs-and-lists',
    expectUsable: true,
    metadata: {
      matches: {
        'Software requiring timeboxed delivery of business value': 'Scrum',
        'Software application with a fixed deadline': 'Constraint-driven delivery',
      },
      leftItems: [
        'Software requiring timeboxed delivery of business value',
        'Software application with a fixed deadline',
      ],
      rightItems: ['Scrum', 'Constraint-driven delivery'],
      dragDropPairs: [
        {
          left_item: 'Software requiring timeboxed delivery of business value',
          right_item: 'Scrum',
        },
        {
          left_item: 'Software application with a fixed deadline',
          right_item: 'Constraint-driven delivery',
        },
      ],
    },
  },
  {
    id: 'pairs-only',
    expectUsable: true,
    metadata: {
      dragDropPairs: [
        { left_item: 'Charter', right_item: 'Authorize the project' },
        { left_item: 'WBS', right_item: 'Decompose scope' },
      ],
    },
  },
  {
    id: 'INTEGRATION-23-empty',
    expectUsable: false,
    metadata: { drag_drop_pairs: [] },
  },
  {
    id: 'RESOURCE-3-empty',
    expectUsable: false,
    metadata: { drag_drop_pairs: [] },
  },
];

describe('normalizeDragMetadata (real bank shapes)', () => {
  it.each(REAL_BANK_SHAPES)('$id usable=$expectUsable', ({ metadata, expectUsable }) => {
    const normalized = normalizeDragMetadata(metadata);
    expect(normalized.usable).toBe(expectUsable);
    if (expectUsable) {
      expect(normalized.leftItems.length).toBeGreaterThan(0);
      expect(normalized.rightItems.length).toBeGreaterThan(0);
      expect(Object.keys(normalized.correctMatches).length).toBe(normalized.leftItems.length);
      for (const item of [...normalized.leftItems, ...normalized.rightItems]) {
        expect(item).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            label: expect.any(String),
          })
        );
        expect(item.id).not.toBe('[object Object]');
        expect(item.label).not.toBe('[object Object]');
      }
    }
  });

  it('exposes opaque ids (not answer keys) to learners', () => {
    const prompt = learnerDragPromptFromMetadata(REAL_BANK_SHAPES[0].metadata);
    expect(prompt.usable).toBe(true);
    expect(prompt.leftItems).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'A', label: expect.any(String) })])
    );
    const serialized = JSON.stringify(prompt);
    expect(serialized).not.toMatch(/"matches"/);
    expect(serialized).not.toMatch(/"correctMatches"/);
  });

  it('grades object letter/index mappings by opaque ids', () => {
    const metadata = REAL_BANK_SHAPES[1].metadata;
    const normalized = normalizeDragMetadata(metadata);
    const result = gradeQuestionResponse({
      questionType: 'drag_and_match',
      questionMetadata: metadata,
      answers: [],
      dragMatches: { ...normalized.correctMatches },
    });
    expect(result.isCorrect).toBe(true);
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: { A: '1' },
      }).isCorrect
    ).toBe(false);
  });

  it('grades string-list mappings by opaque ids, not display text alone', () => {
    const metadata = REAL_BANK_SHAPES[2].metadata;
    const normalized = normalizeDragMetadata(metadata);
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: { ...normalized.correctMatches },
      }).isCorrect
    ).toBe(true);
    // Label-keyed payload must not grade correct under the ID contract
    expect(
      gradeQuestionResponse({
        questionType: 'drag_and_match',
        questionMetadata: metadata,
        answers: [],
        dragMatches: metadata.matches,
      }).isCorrect
    ).toBe(false);
  });

  it('marks empty-pair records unusable so exams can exclude them', () => {
    expect(normalizeDragMetadata({ drag_drop_pairs: [] }).usable).toBe(false);
    expect(normalizeDragMetadata({ dragDropPairs: [] }).usable).toBe(false);
  });

  it('treats unanswered drag as incorrect when allowUnanswered', () => {
    const result = gradeQuestionResponse({
      questionType: 'drag_and_match',
      questionMetadata: REAL_BANK_SHAPES[0].metadata,
      answers: [],
      allowUnanswered: true,
    });
    expect(result.isCorrect).toBe(false);
    expect(result.unanswered).toBe(true);
  });
});
