import { Router } from 'express';
import { getSubscription, updateSubscription, cancelSubscription } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSubscription);
router.put('/', updateSubscription);
router.delete('/', cancelSubscription);

export default router;


