import { Router } from 'express';
import { body } from 'express-validator';
import {
  startExam,
  startDailyQuiz,
  getDailyQuizStatus,
  getWeeklyDailyQuizCompletions,
  submitExam,
  getExam,
  saveExamProgress,
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
router.put('/:id/progress', saveExamProgress);
router.get('/:id/review', getExamReview);
router.post(
  '/:id/submit',
  [
    body('answers').isArray(),
    body().custom((_, { req }) => {
      const forbidden = ['isCorrect', 'score', 'correctAnswers', 'accuracy', 'totalQuestions'];
      for (const key of forbidden) {
        if (req.body?.[key] !== undefined) {
          throw new Error(`Client must not send ${key}`);
        }
      }
      if (Array.isArray(req.body?.answers)) {
        for (const row of req.body.answers) {
          for (const key of forbidden) {
            if (row?.[key] !== undefined) {
              throw new Error(`Client must not send ${key} on answer entries`);
            }
          }
        }
      }
      return true;
    }),
    validate
  ],
  submitExam
);
router.delete('/:id', deleteExam);

export default router;


