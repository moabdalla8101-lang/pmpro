export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM_MONTHLY = 'premium_monthly',
  PREMIUM_SEMI_ANNUAL = 'premium_semi_annual',
  CRAM_TIME = 'cram_time'
}

export enum CertificationType {
  PMP = 'pmp'
}

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  studyGoals?: string[];
  notificationsEnabled?: boolean;
}

export interface Question {
  id: string;
  certificationId: string;
  knowledgeAreaId: string;
  questionText: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  questionId: string;
  answerText: string;
  isCorrect: boolean;
  order: number;
}

export interface KnowledgeArea {
  id: string;
  certificationId: string;
  name: string;
  description?: string;
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  type: CertificationType;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  certificationId: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  lastActivityAt: Date;
  updatedAt: Date;
}

export interface UserAnswer {
  id: string;
  userId: string;
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  answeredAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  questionId: string;
  createdAt: Date;
}

export interface MockExam {
  id: string;
  userId: string;
  certificationId: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface Badge {
  id: string;
  userId: string;
  badgeType: string;
  earnedAt: Date;
}

export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}


