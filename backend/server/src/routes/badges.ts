import { Router } from 'express';
import {
  getUserBadges,
  getUserStreak,
  updateStreak
} from '../controllers/badgeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getUserBadges);
router.get('/streak', getUserStreak);
router.post('/streak', updateStreak);

export default router;


