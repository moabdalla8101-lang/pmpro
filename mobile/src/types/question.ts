/** Learner-facing question (pre-answer). No correctness or explanations. */
export type LearnerAnswer = {
  id: string;
  questionId?: string;
  answerText: string;
  answer_text?: string;
  order: number;
};

export type LearnerQuestion = {
  id: string;
  questionId?: string;
  questionText: string;
  question_text?: string;
  difficulty: string;
  questionType?: string;
  question_type?: string;
  domain?: string;
  task?: string;
  pmApproach?: string;
  pm_approach?: string;
  questionMetadata?: any;
  question_metadata?: any;
  questionImages?: any;
  question_images?: any;
  knowledgeAreaName?: string;
  knowledge_area_name?: string;
  knowledgeAreaId?: string;
  certificationId?: string;
  answers: LearnerAnswer[];
};

/** Returned only after a successful practice submission. */
export type AnsweredQuestionFeedback = {
  questionId: string;
  userAnswerId?: string;
  userAnswerIds?: string[];
  isCorrect: boolean;
  correctAnswerIds: string[];
  explanation?: string | null;
  explanationImages?: any;
  answers: Array<{
    id: string;
    answerText: string;
    isCorrect: boolean;
    rationale?: string | null;
    order: number;
  }>;
  correctMatches?: Record<string, string> | null;
};
