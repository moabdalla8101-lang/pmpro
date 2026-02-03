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
router.put('/', updateUserProgress);
router.post(
  '/answer',
  [
    body('questionId').notEmpty(),
    body('answerId').notEmpty(),
    validate
  ],
  recordAnswer
);
router.post('/missed-questions/reviewed', markMissedQuestionAsReviewed);

export default router;


