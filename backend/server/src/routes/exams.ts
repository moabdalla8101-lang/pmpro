import { Router } from 'express';
import { body } from 'express-validator';
import {
  startExam,
  startDailyQuiz,
  getDailyQuizStatus,
  getWeeklyDailyQuizCompletions,
  submitExam,
  getExam,
  getUserExams,
  getExamReview,
  deleteExam
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

router.post(
  '/daily-quiz/start',
  [
    body('certificationId').notEmpty(),
    validate
  ],
  startDailyQuiz
);

router.get('/daily-quiz/status', getDailyQuizStatus);
router.get('/daily-quiz/weekly', getWeeklyDailyQuizCompletions);

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
router.delete('/:id', deleteExam);

export default router;


