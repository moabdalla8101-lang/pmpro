import { Router } from 'express';
import { body } from 'express-validator';
import {
  getKnowledgeAreas,
  getKnowledgeArea,
  createKnowledgeArea,
  updateKnowledgeArea,
  deleteKnowledgeArea,
  getKnowledgeAreasByCertification
} from '../controllers/knowledgeAreaController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Public routes (authenticated users)
router.get('/', authenticate, getKnowledgeAreas);
router.get('/:id', authenticate, getKnowledgeArea);
router.get('/certification/:certificationId', authenticate, getKnowledgeAreasByCertification);

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('certificationId').notEmpty(),
    body('name').notEmpty(),
    body('order').isInt({ min: 0 }),
    validate
  ],
  createKnowledgeArea
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  [
    body('name').optional().notEmpty(),
    body('order').optional().isInt({ min: 0 }),
    validate
  ],
  updateKnowledgeArea
);

router.delete('/:id', authenticate, requireAdmin, deleteKnowledgeArea);

export default router;




