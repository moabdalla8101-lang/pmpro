import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUserProgress,
  updateUserProgress,
  recordAnswer,
  getPerformanceByKnowledgeArea,
  getPerformanceByDomain,
  getAnsweredQuestionIds,
  getMissedQuestions,
  markMissedQuestionAsReviewed,
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/', getUserProgress);
router.get('/knowledge-area', getPerformanceByKnowledgeArea);
router.get('/domain', getPerformanceByDomain);
router.get('/answered-questions', getAnsweredQuestionIds);
router.get('/missed-questions', getMissedQuestions);
router.put(
  '/',
  [
    body('certificationId').notEmpty(),
    validate,
  ],
  updateUserProgress
);
router.post(
  '/answer',
  [
    body('questionId').notEmpty(),
    body('certificationId').notEmpty().withMessage('certificationId is required'),
    body().custom((_, { req }) => {
      const forbidden = [
        'isCorrect',
        'is_correct',
        'score',
        'correctAnswers',
        'accuracy',
        'subscriptionTier',
        'subscription_tier',
      ];
      for (const key of forbidden) {
        if (req.body?.[key] !== undefined) {
          throw new Error(`Client must not send ${key}`);
        }
      }
      const hasAnswer =
        req.body.answerId ||
        (Array.isArray(req.body.answerIds) && req.body.answerIds.length) ||
        (req.body.dragMatches && typeof req.body.dragMatches === 'object');
      if (!hasAnswer) {
        throw new Error('answerId, answerIds, or dragMatches is required');
      }
      const headerKey = req.headers?.['idempotency-key'];
      const idempotencyKey =
        (typeof headerKey === 'string' && headerKey.trim()) ||
        (typeof req.body?.idempotencyKey === 'string' && req.body.idempotencyKey.trim()) ||
        '';
      if (!idempotencyKey) {
        throw new Error('Idempotency-Key header (or idempotencyKey) is required');
      }
      return true;
    }),
    validate
  ],
  recordAnswer
);
router.post('/missed-questions/reviewed', markMissedQuestionAsReviewed);

export default router;


