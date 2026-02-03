import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connection';
import crypto from 'crypto';

interface RevenueCatWebhookEvent {
  event: {
    id: string;
    type: string;
    app_user_id: string;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number | null;
    environment: string;
    entitlement_ids: string[];
    presented_offering_id?: string;
  };
}

/**
 * Verify RevenueCat webhook signature
 */
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Map RevenueCat product ID to subscription tier
 */
function mapProductIdToTier(productId: string): string {
  const productIdMap: Record<string, string> = {
    'premium_monthly': 'premium_monthly',
    'premium_semi_annual': 'premium_semi_annual',
    'premium_annual': 'premium_annual',
    'cram_time': 'cram_time',
  };
  
  // Try exact match first
  if (productIdMap[productId.toLowerCase()]) {
    return productIdMap[productId.toLowerCase()];
  }
  
  // Try partial match
  const lowerProductId = productId.toLowerCase();
  for (const [key, value] of Object.entries(productIdMap)) {
    if (lowerProductId.includes(key.replace('_', '')) || lowerProductId.includes(key)) {
      return value;
    }
  }
  
  // Default to free if no match
  return 'free';
}

/**
 * Update user subscription in database
 */
async function updateUserSubscription(
  userId: string,
  tier: string,
  expiresAt: Date | null
): Promise<void> {
  await pool.query(
    `UPDATE users 
     SET subscription_tier = $1, 
         subscription_expires_at = $2,
         updated_at = NOW()
     WHERE id = $3`,
    [tier, expiresAt, userId]
  );
}

/**
 * Handle RevenueCat webhook events
 */
export async function handleRevenueCatWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('RevenueCat webhook secret not configured');
      // Continue without verification in development
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Webhook secret not configured' });
      }
    }

    // Verify webhook signature if secret is configured
    const signature = req.headers['authorization'] as string;
    const rawBody = JSON.stringify(req.body);
    
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event: RevenueCatWebhookEvent = req.body;
    const { type, app_user_id, product_id, expiration_at_ms } = event.event;

    // Map product ID to subscription tier
    const tier = mapProductIdToTier(product_id);
    
    // Calculate expiration date
    const expiresAt = expiration_at_ms 
      ? new Date(expiration_at_ms) 
      : null;

    console.log('Processing RevenueCat webhook:', {
      type,
      userId: app_user_id,
      productId: product_id,
      tier,
      expiresAt,
    });

    // Handle different event types
    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        // Activate or renew subscription
        await updateUserSubscription(app_user_id, tier, expiresAt);
        console.log(`Subscription ${type.toLowerCase()}: ${app_user_id} -> ${tier}`);
        break;

      case 'CANCELLATION':
        // Keep subscription active until expiration
        // Don't change tier, just log the cancellation
        console.log(`Subscription cancelled: ${app_user_id}, expires at ${expiresAt}`);
        break;

      case 'EXPIRATION':
        // Subscription expired, set to free
        await updateUserSubscription(app_user_id, 'free', null);
        console.log(`Subscription expired: ${app_user_id}`);
        break;

      case 'BILLING_ISSUE':
        // Payment failed, but subscription still active until grace period
        console.log(`Billing issue for: ${app_user_id}`);
        break;

      case 'UNCANCELLATION':
        // User reactivated cancelled subscription
        await updateUserSubscription(app_user_id, tier, expiresAt);
        console.log(`Subscription reactivated: ${app_user_id} -> ${tier}`);
        break;

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing RevenueCat webhook:', error);
    next(error);
  }
}
