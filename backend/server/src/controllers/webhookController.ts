import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connection';
import crypto from 'crypto';

interface RevenueCatWebhookEvent {
  event: {
    id: string;
    type: string;
    app_user_id: string;
    product_id: string;
    /** Present on PRODUCT_CHANGE — the product the user switched to */
    new_product_id?: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number | null;
    environment: string;
    entitlement_ids: string[];
    presented_offering_id?: string;
  };
}

/**
 * Verify the static Authorization value configured in RevenueCat.
 */
function verifyWebhookAuthorization(
  authorization: string,
  expectedAuthorization: string
): boolean {
  if (!authorization || !expectedAuthorization) {
    return false;
  }

  const provided = Buffer.from(authorization);
  const expected = Buffer.from(expectedAuthorization);
  if (provided.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    provided,
    expected
  );
}

/**
 * Map RevenueCat product ID to subscription tier
 */
function mapProductIdToTier(productId: string | null | undefined): string {
  if (!productId || typeof productId !== 'string') {
    return 'free';
  }

  const productIdMap: Record<string, string> = {
    'premium_monthly': 'premium_monthly',
    'premium_monthly11': 'premium_monthly',
    'premium_semi_annual': 'premium_semi_annual',
    'premium_annual': 'premium_annual',
    'yearly': 'premium_annual',
    'cram_time': 'cram_time',
    'weekly': 'cram_time',
    '$rc_weekly': 'cram_time',
  };

  const lowerProductId = productId.toLowerCase();

  // Try exact match first
  if (productIdMap[lowerProductId]) {
    return productIdMap[lowerProductId];
  }

  // Try partial match (order matters: semi/annual before monthly)
  if (lowerProductId.includes('cram') || lowerProductId.includes('weekly')) {
    return 'cram_time';
  }
  if (lowerProductId.includes('semi') || lowerProductId.includes('six_month')) {
    return 'premium_semi_annual';
  }
  if (lowerProductId.includes('annual') || lowerProductId.includes('yearly')) {
    return 'premium_annual';
  }
  if (lowerProductId.includes('monthly')) {
    return 'premium_monthly';
  }

  for (const [key, value] of Object.entries(productIdMap)) {
    if (
      lowerProductId.includes(key.replace(/_/g, '')) ||
      lowerProductId.includes(key)
    ) {
      return value;
    }
  }

  return 'free';
}

/**
 * Update user subscription in database.
 * app_user_id is normally our user UUID after Purchases.logIn(userId).
 */
async function updateUserSubscription(
  userId: string,
  tier: string,
  expiresAt: Date | null
): Promise<boolean> {
  const result = await pool.query(
    `UPDATE users 
     SET subscription_tier = $1, 
         subscription_expires_at = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, email`,
    [tier, expiresAt, userId]
  );

  if (result.rowCount && result.rowCount > 0) {
    return true;
  }

  // Fallback: some older clients may still send email as the RC app user id
  if (userId.includes('@')) {
    const byEmail = await pool.query(
      `UPDATE users
       SET subscription_tier = $1,
           subscription_expires_at = $2,
           updated_at = NOW()
       WHERE LOWER(email) = LOWER($3)
       RETURNING id, email`,
      [tier, expiresAt, userId]
    );
    return Boolean(byEmail.rowCount && byEmail.rowCount > 0);
  }

  return false;
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

    // Verify the Authorization header if a value is configured.
    const authorization = req.headers['authorization'] as string;
    
    if (webhookSecret) {
      const isValid = verifyWebhookAuthorization(authorization, webhookSecret);
      if (!isValid) {
        console.error('Invalid RevenueCat webhook authorization');
        return res.status(401).json({ error: 'Invalid authorization' });
      }
    }

    const event: RevenueCatWebhookEvent = req.body;
    if (!event?.event) {
      console.warn('RevenueCat webhook missing event payload', {
        keys: event ? Object.keys(event) : null,
      });
      // Ack so RC does not retry forever on malformed test payloads
      return res.status(200).json({ received: true, ignored: true });
    }

    const {
      type,
      app_user_id,
      product_id,
      new_product_id,
      expiration_at_ms,
      entitlement_ids,
    } = event.event;

    // PRODUCT_CHANGE keeps product_id as the old plan; new_product_id is the target.
    const effectiveProductId =
      type === 'PRODUCT_CHANGE' && new_product_id ? new_product_id : product_id;
    const tier = mapProductIdToTier(effectiveProductId);

    // Calculate expiration date
    const expiresAt = expiration_at_ms ? new Date(expiration_at_ms) : null;

    console.log('Processing RevenueCat webhook:', {
      type,
      userId: app_user_id,
      productId: product_id,
      newProductId: new_product_id,
      effectiveProductId,
      entitlementIds: entitlement_ids,
      tier,
      expiresAt,
    });

    // Events without a product (TRANSFER, TEST, etc.) must not crash the webhook.
    const activatingTypes = new Set([
      'INITIAL_PURCHASE',
      'RENEWAL',
      'PRODUCT_CHANGE',
      'NON_RENEWING_PURCHASE',
      'UNCANCELLATION',
      'SUBSCRIPTION_EXTENDED',
    ]);

    if (activatingTypes.has(type)) {
      if (!app_user_id) {
        console.warn(`Subscription ${type} missing app_user_id — ignored`);
      } else if (!effectiveProductId) {
        console.warn(
          `Subscription ${type} for ${app_user_id} missing product_id — acknowledged without tier change`
        );
      } else if (tier === 'free') {
        console.warn(
          `Subscription ${type} for ${app_user_id} has unmapped product_id=${effectiveProductId}`
        );
      } else {
        const updated = await updateUserSubscription(
          app_user_id,
          tier,
          expiresAt
        );
        if (!updated) {
          console.error(
            `Subscription ${type}: no user row for app_user_id=${app_user_id} (tier=${tier})`
          );
        } else {
          console.log(`Subscription ${type}: ${app_user_id} -> ${tier}`);
        }
      }
    } else {
      switch (type) {
        case 'CANCELLATION':
          // Keep subscription active until expiration
          console.log(
            `Subscription cancelled: ${app_user_id}, expires at ${expiresAt}`
          );
          break;

        case 'EXPIRATION':
          if (app_user_id) {
            await updateUserSubscription(app_user_id, 'free', null);
            console.log(`Subscription expired: ${app_user_id}`);
          }
          break;

        case 'BILLING_ISSUE':
          console.log(`Billing issue for: ${app_user_id}`);
          break;

        default:
          console.log(`Unhandled webhook event type: ${type}`);
      }
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing RevenueCat webhook:', error);
    next(error);
  }
}
