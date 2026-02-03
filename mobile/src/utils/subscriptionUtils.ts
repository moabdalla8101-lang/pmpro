/**
 * Subscription utility functions for feature gating
 */

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM_MONTHLY = 'premium_monthly',
  PREMIUM_SEMI_ANNUAL = 'premium_semi_annual',
  PREMIUM_ANNUAL = 'premium_annual',
  CRAM_TIME = 'cram_time',
}

export interface SubscriptionStatus {
  tier: string;
  isActive: boolean;
  expiresAt?: Date | string | null;
}

/**
 * Check if user has premium subscription
 */
export function hasPremiumAccess(subscriptionTier: string | null | undefined): boolean {
  if (!subscriptionTier) return false;
  
  const premiumTiers = [
    SubscriptionTier.PREMIUM_MONTHLY,
    SubscriptionTier.PREMIUM_SEMI_ANNUAL,
    SubscriptionTier.PREMIUM_ANNUAL,
    SubscriptionTier.CRAM_TIME,
    'premium', // Legacy support
  ];
  
  return premiumTiers.includes(subscriptionTier.toLowerCase());
}

/**
 * Check if subscription is active (not expired)
 */
export function isSubscriptionActive(
  subscriptionTier: string | null | undefined,
  expiresAt?: Date | string | null
): boolean {
  if (!hasPremiumAccess(subscriptionTier)) return false;
  
  if (!expiresAt) return true; // No expiration = lifetime
  
  const expirationDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expirationDate > new Date();
}

/**
 * Get subscription tier display name
 */
export function getSubscriptionDisplayName(tier: string | null | undefined): string {
  if (!tier) return 'Free';
  
  const tierMap: Record<string, string> = {
    [SubscriptionTier.FREE]: 'Free',
    [SubscriptionTier.PREMIUM_MONTHLY]: 'Premium Monthly',
    [SubscriptionTier.PREMIUM_SEMI_ANNUAL]: 'Premium (6 Months)',
    [SubscriptionTier.PREMIUM_ANNUAL]: 'Premium Annual',
    [SubscriptionTier.CRAM_TIME]: 'Cram Time',
    'premium': 'Premium', // Legacy
  };
  
  return tierMap[tier.toLowerCase()] || tier;
}

/**
 * Check if feature requires premium
 */
export function requiresPremium(feature: string, subscriptionTier: string | null | undefined): boolean {
  const premiumFeatures = [
    'unlimited_questions',
    'mock_exams',
    'bookmarks',
    'missed_questions',
    'advanced_analytics',
    'offline_mode',
    'study_materials',
  ];
  
  if (!premiumFeatures.includes(feature)) return false;
  
  return !hasPremiumAccess(subscriptionTier);
}

/**
 * Get free tier limits
 */
export const FREE_TIER_LIMITS = {
  MAX_PRACTICE_QUESTIONS: 50,
  MAX_MOCK_EXAMS_PER_MONTH: 1,
  MAX_BOOKMARKS: 0,
  MAX_MISSED_QUESTIONS_REVIEW: 0,
};

/**
 * Check if user has reached free tier limit
 */
export function hasReachedFreeLimit(
  limitType: keyof typeof FREE_TIER_LIMITS,
  currentCount: number,
  subscriptionTier: string | null | undefined
): boolean {
  if (hasPremiumAccess(subscriptionTier)) return false;
  
  const limit = FREE_TIER_LIMITS[limitType];
  return currentCount >= limit;
}
