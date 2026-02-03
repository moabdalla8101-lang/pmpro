import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUserProgress,
  updateUserProgress,
  recordAnswer,
  getPerformanceByKnowledgeArea
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/', getUserProgress);
router.get('/knowledge-area', getPerformanceByKnowledgeArea);
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

export default router;




