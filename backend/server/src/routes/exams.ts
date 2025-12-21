import { Router } from 'express';
import { body } from 'express-validator';
import {
  startExam,
  submitExam,
  getExam,
  getUserExams,
  getExamReview
} from '../controllers/examController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.post(
  '/start',
  [
    body('certificationId').notEmpty(),
    body('totalQuestions').isInt({ min: 1 }),
    validate
  ],
  startExam
);

router.get('/', getUserExams);
router.get('/:id', getExam);
router.get('/:id/review', getExamReview);
router.post(
  '/:id/submit',
  [
    body('answers').isArray(),
    validate
  ],
  submitExam
);

export default router;


