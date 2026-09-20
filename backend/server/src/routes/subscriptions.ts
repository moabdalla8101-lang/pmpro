import { Router } from 'express';
import { getSubscription } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSubscription);

export default router;


