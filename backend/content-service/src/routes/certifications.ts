import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification
} from '../controllers/certificationController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Public routes (authenticated users)
router.get('/', authenticate, getCertifications);
router.get('/:id', authenticate, getCertification);

// Admin routes
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').notEmpty(),
    body('type').isIn(['pmp']),
    validate
  ],
  createCertification
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  [
    body('name').optional().notEmpty(),
    body('isActive').optional().isBoolean(),
    validate
  ],
  updateCertification
);

router.delete('/:id', authenticate, requireAdmin, deleteCertification);

export default router;


