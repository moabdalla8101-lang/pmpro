import {
  serializeLearnerQuestion,
  serializeAdminQuestion,
  serializeAnsweredQuestionFeedback,
  findLearnerForbiddenFields,
  LEARNER_FORBIDDEN_KEYS,
  sanitizeLearnerQuestionMetadata,
  transformDragDropPairsForLearner,
  clampLearnerPageSize,
  MAX_LEARNER_QUESTION_PAGE_SIZE,
  DEFAULT_LEARNER_QUESTION_PAGE_SIZE,
} from '../serializers/questionSerializers';

const sampleQuestion = {
  id: 'q-1',
  question_id: 'ext-1',
  certification_id: 'cert-1',
  knowledge_area_id: 'ka-1',
  question_text: 'What is scope?',
  explanation: 'Secret teaching material',
  difficulty: 'medium',
  question_type: 'multiple_choice',
  domain: 'Process',
  task: null,
  pm_approach: null,
  question_metadata: {
    leftItems: [{ letter: 'A', text: 'Left' }],
    rightItems: [{ index: 1, text: 'Right' }],
    matches: { A: 1 },
  },
  question_images: [{ src: '/q.png' }],
  explanation_images: [{ src: '/e.png' }],
  is_active: true,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

const sampleAnswers = [
  {
    id: 'a-1',
    question_id: 'q-1',
    answer_text: 'Wrong',
    is_correct: false,
    order: 0,
    rationale: 'Not this one',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'a-2',
    question_id: 'q-1',
    answer_text: 'Right',
    is_correct: true,
    order: 1,
    rationale: 'Because PMI says so',
    created_at: '2026-01-01T00:00:00.000Z',
  },
];

/** Real bank variant: dragDropPairs with both sides of the answer key. */
const dragDropPairsCamel = [
  { left_item: 'Charter', right_item: 'Authorize the project' },
  { left_item: 'WBS', right_item: 'Decompose scope' },
];

const dragDropPairsSnake = [
  { left: 'Risk register', right: 'Track threats' },
  { left: 'Stakeholder register', right: 'Identify interests' },
];

describe('question serializers', () => {
  describe('LearnerQuestion', () => {
    it('omits correctness, explanations, rationales, and answer keys', () => {
      const learner = serializeLearnerQuestion(sampleQuestion, sampleAnswers, 'Scope');
      const leaks = findLearnerForbiddenFields(learner);
      expect(leaks).toEqual([]);

      for (const key of LEARNER_FORBIDDEN_KEYS) {
        expect(JSON.stringify(learner)).not.toContain(`"${key}"`);
      }

      expect(learner.answers).toHaveLength(2);
      expect(learner.answers[0]).toEqual({
        id: 'a-1',
        questionId: 'q-1',
        answerText: 'Wrong',
        order: 0,
      });
      expect(learner.questionMetadata?.matches).toBeUndefined();
      expect(learner.questionMetadata?.leftItems).toBeDefined();
    });

    it('strips dragDropPairs answer keys and exposes unpaired left/right items', () => {
      const question = {
        ...sampleQuestion,
        question_type: 'drag_and_match',
        question_metadata: { dragDropPairs: dragDropPairsCamel },
      };
      const learner = serializeLearnerQuestion(question, sampleAnswers, 'Communications');
      const leaks = findLearnerForbiddenFields(learner);
      expect(leaks).toEqual([]);
      expect(learner.questionMetadata?.dragDropPairs).toBeUndefined();
      expect(learner.questionMetadata?.drag_drop_pairs).toBeUndefined();
      expect(learner.questionMetadata?.leftItems).toEqual(
        expect.arrayContaining(['Charter', 'WBS'])
      );
      expect(learner.questionMetadata?.rightItems).toEqual(
        expect.arrayContaining(['Authorize the project', 'Decompose scope'])
      );
      // Pair relationships must not survive as objects with both sides
      const serialized = JSON.stringify(learner);
      expect(serialized).not.toMatch(/"left_item"\s*:/);
      expect(serialized).not.toMatch(/"right_item"\s*:/);
      expect(serialized).not.toMatch(/"dragDropPairs"\s*:/);
      expect(serialized).not.toMatch(/"drag_drop_pairs"\s*:/);
    });

    it('strips drag_drop_pairs snake_case alias used in exported bank', () => {
      const question = {
        ...sampleQuestion,
        question_type: 'drag_and_match',
        question_metadata: { drag_drop_pairs: dragDropPairsSnake },
      };
      const learner = serializeLearnerQuestion(question, [], 'Risk');
      expect(findLearnerForbiddenFields(learner)).toEqual([]);
      expect(learner.questionMetadata?.drag_drop_pairs).toBeUndefined();
      expect(learner.questionMetadata?.dragDropPairs).toBeUndefined();
      expect(learner.questionMetadata?.leftItems).toEqual(
        expect.arrayContaining(['Risk register', 'Stakeholder register'])
      );
    });

    it('recursively flags leaks if a nested forbidden field is present', () => {
      const dirty = {
        questions: [
          {
            id: 'q',
            answers: [{ id: 'a', isCorrect: true }],
            nested: { explanation: 'leak' },
          },
        ],
      };
      const leaks = findLearnerForbiddenFields(dirty);
      expect(leaks).toEqual(
        expect.arrayContaining([
          'questions[0].answers[0].isCorrect',
          'questions[0].nested.explanation',
        ])
      );
    });

    it('flags dragDropPairs as a learner leak when present in any container', () => {
      const dirty = {
        bookmarks: [
          {
            question: {
              questionMetadata: {
                dragDropPairs: [{ left_item: 'A', right_item: 'B' }],
              },
            },
          },
        ],
      };
      expect(findLearnerForbiddenFields(dirty)).toEqual(
        expect.arrayContaining(['bookmarks[0].question.questionMetadata.dragDropPairs'])
      );
    });
  });

  describe('AdminQuestion', () => {
    it('includes correctness and teaching material for editing', () => {
      const admin = serializeAdminQuestion(sampleQuestion, sampleAnswers, 'Scope');
      expect(admin.explanation).toBe('Secret teaching material');
      expect(admin.explanationImages).toEqual([{ src: '/e.png' }]);
      expect(admin.answers[1].isCorrect).toBe(true);
      expect(admin.answers[1].rationale).toBe('Because PMI says so');
      expect(admin.questionMetadata?.matches).toEqual({ A: 1 });
    });
  });

  describe('AnsweredQuestionFeedback', () => {
    it('returns correctness and explanation only after submission', () => {
      const feedback = serializeAnsweredQuestionFeedback(sampleQuestion, sampleAnswers, {
        isCorrect: true,
        userAnswerId: 'ua-1',
        userAnswerIds: ['ua-1'],
      });

      expect(feedback.isCorrect).toBe(true);
      expect(feedback.correctAnswerIds).toEqual(['a-2']);
      expect(feedback.explanation).toBe('Secret teaching material');
      expect(feedback.answers.find((a) => a.id === 'a-2')?.isCorrect).toBe(true);
      expect(feedback.correctMatches).toEqual({ A: 1 });
    });

    it('reconstructs correctMatches from dragDropPairs after submission', () => {
      const question = {
        ...sampleQuestion,
        question_type: 'drag_and_match',
        question_metadata: { dragDropPairs: dragDropPairsCamel },
      };
      const feedback = serializeAnsweredQuestionFeedback(question, sampleAnswers, {
        isCorrect: false,
        userAnswerIds: [],
      });
      expect(feedback.correctMatches).toEqual({
        Charter: 'Authorize the project',
        WBS: 'Decompose scope',
      });
    });
  });

  describe('sanitizeLearnerQuestionMetadata', () => {
    it('strips matches while keeping prompt items', () => {
      const safe = sanitizeLearnerQuestionMetadata({
        leftItems: ['A'],
        rightItems: ['B'],
        matches: { A: 'B' },
        correctMatches: { A: 'B' },
      });
      expect(safe).toEqual({ leftItems: ['A'], rightItems: ['B'] });
    });

    it('transforms dragDropPairs into unpaired lists without pair objects', () => {
      const safe = sanitizeLearnerQuestionMetadata({
        dragDropPairs: dragDropPairsCamel,
      });
      expect(safe.dragDropPairs).toBeUndefined();
      expect(safe.drag_drop_pairs).toBeUndefined();
      expect(safe.leftItems).toHaveLength(2);
      expect(safe.rightItems).toHaveLength(2);
    });
  });

  describe('transformDragDropPairsForLearner', () => {
    it('returns left and right items without preserving pair index alignment as objects', () => {
      const { leftItems, rightItems } = transformDragDropPairsForLearner(dragDropPairsCamel);
      expect(leftItems).toHaveLength(2);
      expect(rightItems).toHaveLength(2);
      expect(leftItems).toEqual(expect.arrayContaining(['Charter', 'WBS']));
      expect(rightItems).toEqual(
        expect.arrayContaining(['Authorize the project', 'Decompose scope'])
      );
    });
  });

  describe('clampLearnerPageSize', () => {
    it('defaults and caps learner page size', () => {
      expect(clampLearnerPageSize(undefined)).toBe(DEFAULT_LEARNER_QUESTION_PAGE_SIZE);
      expect(clampLearnerPageSize('1000')).toBe(MAX_LEARNER_QUESTION_PAGE_SIZE);
      expect(clampLearnerPageSize(10)).toBe(10);
      expect(clampLearnerPageSize(0)).toBe(DEFAULT_LEARNER_QUESTION_PAGE_SIZE);
      expect(clampLearnerPageSize(-5)).toBe(DEFAULT_LEARNER_QUESTION_PAGE_SIZE);
    });
  });
});
