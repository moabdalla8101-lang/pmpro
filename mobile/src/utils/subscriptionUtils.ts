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
 * Normalize store / RC product ids and legacy labels to our tier keys.
 */
export function normalizeSubscriptionTier(
  subscriptionTier: string | null | undefined
): string {
  if (!subscriptionTier) return SubscriptionTier.FREE;
  const id = subscriptionTier.toLowerCase().trim();
  if (!id || id === 'free') return SubscriptionTier.FREE;
  if (id.includes('cram') || id.includes('weekly') || id === '$rc_weekly') {
    return SubscriptionTier.CRAM_TIME;
  }
  if (id.includes('semi') || id.includes('six_month') || id === '$rc_six_month') {
    return SubscriptionTier.PREMIUM_SEMI_ANNUAL;
  }
  if (id.includes('annual') || id.includes('yearly') || id === '$rc_annual') {
    return SubscriptionTier.PREMIUM_ANNUAL;
  }
  if (id.includes('monthly') || id === '$rc_monthly') {
    return SubscriptionTier.PREMIUM_MONTHLY;
  }
  if (id === 'premium') return 'premium';
  return id;
}

/**
 * Check if user has premium subscription
 */
export function hasPremiumAccess(subscriptionTier: string | null | undefined): boolean {
  const tier = normalizeSubscriptionTier(subscriptionTier);
  if (tier === SubscriptionTier.FREE) return false;

  const premiumTiers = [
    SubscriptionTier.PREMIUM_MONTHLY,
    SubscriptionTier.PREMIUM_SEMI_ANNUAL,
    SubscriptionTier.PREMIUM_ANNUAL,
    SubscriptionTier.CRAM_TIME,
    'premium', // Legacy support
  ];

  return premiumTiers.includes(tier);
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
 * Rank plans for upgrade/downgrade (higher = longer commitment / better value).
 */
export function getPlanRank(identifier: string | null | undefined): number {
  if (!identifier) return -1;
  const id = identifier.toLowerCase();
  if (id === 'free') return -1;
  if (id.includes('cram') || id.includes('weekly') || id === '$rc_weekly') return 0;
  if (id.includes('monthly') || id === '$rc_monthly') return 1;
  if (id.includes('semi') || id.includes('six_month') || id === '$rc_six_month') return 2;
  if (id.includes('annual') || id.includes('yearly') || id === '$rc_annual') return 3;
  return 99;
}

/**
 * Whether a store product / package matches the user's current subscription tier.
 * Only treats the user as "already on this plan" when they actually have premium access.
 */
export function matchesSubscriptionTier(
  identifier: string | null | undefined,
  subscriptionTier: string | null | undefined,
  expiresAt?: Date | string | null
): boolean {
  if (!identifier || !isSubscriptionActive(subscriptionTier, expiresAt)) return false;
  return (
    getPlanRank(identifier) ===
    getPlanRank(normalizeSubscriptionTier(subscriptionTier))
  );
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
    'domain_practice',
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

/** True when a paid plan name is still stored but its end date has passed. */
export function planHasEnded(
  subscriptionTier: string | null | undefined,
  expiresAt?: Date | string | null
): boolean {
  return hasPremiumAccess(subscriptionTier) && !isSubscriptionActive(subscriptionTier, expiresAt);
}

export function formatSubscriptionEndDate(expiresAt?: Date | string | null): string | null {
  if (!expiresAt) return null;
  const date = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function userHasActivePremium(
  user?: {
    subscriptionTier?: string | null;
    subscriptionExpiresAt?: Date | string | null;
  } | null
): boolean {
  if (!user) return false;
  return isSubscriptionActive(user.subscriptionTier, user.subscriptionExpiresAt);
}

/** Check if user has reached a free tier limit. */
export function hasReachedFreeLimit(
  limitType: keyof typeof FREE_TIER_LIMITS,
  currentCount: number,
  subscriptionTier: string | null | undefined,
  expiresAt?: Date | string | null
): boolean {
  if (isSubscriptionActive(subscriptionTier, expiresAt)) return false;
  
  const limit = FREE_TIER_LIMITS[limitType];
  return currentCount >= limit;
}
