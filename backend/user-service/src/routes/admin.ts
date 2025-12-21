import { Router } from 'express';
import { query } from 'express-validator';
import { getUsers, getUser } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get(
  '/users',
  [
    query('search').optional().trim(),
    query('subscriptionTier').optional().isIn(['free', 'premium_monthly', 'premium_semi_annual', 'cram_time']),
    validate
  ],
  getUsers
);

router.get('/users/:id', getUser);

export default router;

