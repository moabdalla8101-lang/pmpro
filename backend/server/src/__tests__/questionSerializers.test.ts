import {
  serializeLearnerQuestion,
  serializeAdminQuestion,
  serializeAnsweredQuestionFeedback,
  findLearnerForbiddenFields,
  LEARNER_FORBIDDEN_KEYS,
  sanitizeLearnerQuestionMetadata,
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
  });
});
