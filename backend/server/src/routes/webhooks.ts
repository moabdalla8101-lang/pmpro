import { Router } from 'express';
import { handleRevenueCatWebhook } from '../controllers/webhookController';

const router = Router();

// RevenueCat webhook endpoint
// Note: This should be called with raw body for signature verification
// In production, you may need to configure Express to not parse JSON for this route
router.post('/revenuecat', handleRevenueCatWebhook);

export default router;
