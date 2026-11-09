import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserPreferences,
  updateUserPreferences,
  deleteAccount,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/me', deleteAccount);
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);

export default router;
