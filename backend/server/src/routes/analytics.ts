import { Router } from 'express';
import { query } from 'express-validator';
import {
  getUserAnalytics,
  getAdminAnalytics,
  getUsageAnalytics,
  getRevenueReport
} from '../controllers/analyticsController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// User analytics
router.get('/user', getUserAnalytics);

// Admin analytics
router.get('/admin', requireAdmin, getAdminAnalytics);
router.get('/usage', requireAdmin, getUsageAnalytics);
router.get('/revenue', requireAdmin, getRevenueReport);

export default router;


