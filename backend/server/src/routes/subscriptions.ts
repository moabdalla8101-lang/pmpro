import { Router } from 'express';
import { getSubscription, updateSubscription, cancelSubscription, syncSubscription } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSubscription);
router.put('/', updateSubscription);
router.post('/sync', syncSubscription);
router.delete('/', cancelSubscription);

export default router;


