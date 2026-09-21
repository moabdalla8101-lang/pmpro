import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getQuestions,
  getQuestionsByIds,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByKnowledgeArea
} from '../controllers/questionController';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Catalog GETs: learner shape by default; admin token gets full AdminQuestion
router.get('/', optionalAuthenticate, getQuestions);
router.get('/by-ids', optionalAuthenticate, getQuestionsByIds);
router.get('/:id', optionalAuthenticate, getQuestion);
router.get('/knowledge-area/:knowledgeAreaId', optionalAuthenticate, getQuestionsByKnowledgeArea);

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


