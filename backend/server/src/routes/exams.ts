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
import { authenticate, AuthRequest } from '../middleware/auth';
import { requirePremium } from '../middleware/subscription';
import { validate } from '../middleware/validate';
import { Response, NextFunction } from 'express';

const router = Router();

router.use(authenticate);

const FREE_PRACTICE_QUESTION_CAP = 10;

/**
 * Free users may start short practice sessions; mock/mini stay premium.
 * Legacy clients omit examType — treat ≤10 questions as practice so
 * already-shipped TestFlight builds keep working without a new binary.
 */
function requirePremiumUnlessPractice(req: AuthRequest, res: Response, next: NextFunction) {
  const rawType = req.body?.examType;
  const examType = String(rawType || '').toLowerCase();
  if (examType === 'practice') {
    return next();
  }
  if (!rawType) {
    const count = parseInt(String(req.body?.totalQuestions), 10);
    if (Number.isFinite(count) && count > 0 && count <= FREE_PRACTICE_QUESTION_CAP) {
      req.body.examType = 'practice';
      return next();
    }
  }
  return requirePremium(req, res, next);
}

router.post(
  '/start',
  [
    requirePremiumUnlessPractice,
    body('certificationId').notEmpty(),
    body('totalQuestions').isInt({ min: 1 }),
    body('examType').optional().isIn(['practice', 'mock_exam', 'mock', 'mini']),
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


