import { Router } from 'express';
import { getProfile, updateProfile, getUserPreferences, updateUserPreferences } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);

export default router;




