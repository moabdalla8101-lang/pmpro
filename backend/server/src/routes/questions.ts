import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByKnowledgeArea
} from '../controllers/questionController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Public routes (authenticated users)
router.get('/', authenticate, getQuestions);
router.get('/:id', authenticate, getQuestion);
router.get('/knowledge-area/:knowledgeAreaId', authenticate, getQuestionsByKnowledgeArea);

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('certificationId').notEmpty(),
    body('knowledgeAreaId').notEmpty(),
    body('questionText').notEmpty(),
    body('difficulty').isIn(['easy', 'medium', 'hard']),
    validate
  ],
  createQuestion
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  [
    body('questionText').optional().notEmpty(),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    validate
  ],
  updateQuestion
);

router.delete('/:id', authenticate, requireAdmin, deleteQuestion);

export default router;


