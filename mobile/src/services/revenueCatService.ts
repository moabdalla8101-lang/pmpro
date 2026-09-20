/**
 * RevenueCat Service
 * Handles all RevenueCat SDK operations for in-app purchases
 */

import type {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Get API keys from environment
// Test keys work for both iOS and Android
const REVENUECAT_TEST_API_KEY = Constants.expoConfig?.extra?.revenueCatTestApiKey || 
  process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || '';
const REVENUECAT_IOS_API_KEY = Constants.expoConfig?.extra?.revenueCatIosApiKey || 
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
const REVENUECAT_ANDROID_API_KEY = Constants.expoConfig?.extra?.revenueCatAndroidApiKey || 
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '';

let isInitialized = false;
let purchasesModule: typeof import('react-native-purchases').default | null = null;

const isRevenueCatUnavailable =
  Platform.OS === 'web' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

function getRevenueCatApiKey(): string {
  // Always prefer store SDK keys for TestFlight / App Store / Play builds.
  // Test Store keys are rejected by RevenueCat in release builds.
  const platformKey =
    Platform.OS === 'ios' ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;

  if (platformKey) {
    return platformKey;
  }

  // Fallback for local/dev builds that only have a Test Store key configured.
  return REVENUECAT_TEST_API_KEY;
}

export function isRevenueCatAvailable(): boolean {
  return !isRevenueCatUnavailable;
}

export function isRevenueCatConfigured(): boolean {
  return isRevenueCatAvailable() && Boolean(getRevenueCatApiKey());
}

async function getPurchases() {
  if (isRevenueCatUnavailable) {
    throw new Error(
      'Subscriptions are unavailable in Expo Go. Use a development build to test purchases.'
    );
  }

  if (!purchasesModule) {
    purchasesModule = (await import('react-native-purchases')).default;
  }

  return purchasesModule;
}

/**
 * Initialize RevenueCat SDK
 * Should be called when app starts, before any other RevenueCat operations
 */
export async function initializeRevenueCat(): Promise<boolean> {
  if (isRevenueCatUnavailable) {
    console.info('Skipping RevenueCat initialization in this runtime');
    return false;
  }

  if (isInitialized) {
    return true;
  }

  try {
    const apiKey = getRevenueCatApiKey();
    
    if (!apiKey) {
      console.info(
        'RevenueCat is disabled until a public SDK key is configured.'
      );
      return false;
    }

    const Purchases = await getPurchases();
    Purchases.configure({ apiKey });
    isInitialized = true;
    console.log('RevenueCat initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
}

/**
 * Identify user with RevenueCat
 * Links the RevenueCat user to your app's user ID
 * Should be called after user logs in
 */
export async function identifyUser(userId: string): Promise<void> {
  if (isRevenueCatUnavailable) {
    return;
  }

  try {
    if (!isInitialized && !(await initializeRevenueCat())) {
      return;
    }
    
    const Purchases = await getPurchases();
    await Purchases.logIn(userId);
    console.log(`RevenueCat user identified: ${userId}`);
  } catch (error) {
    console.error('Failed to identify RevenueCat user:', error);
    throw error;
  }
}

/**
 * Log out current user from RevenueCat
 * Should be called when user logs out
 */
export async function logoutUser(): Promise<void> {
  if (isRevenueCatUnavailable || !isInitialized) {
    return;
  }

  try {
    const Purchases = await getPurchases();
    await Purchases.logOut();
    console.log('RevenueCat user logged out');
  } catch (error) {
    console.error('Failed to logout RevenueCat user:', error);
    throw error;
  }
}

/**
 * Get available offerings (subscription packages)
 */
export async function getOfferings(): Promise<PurchasesOfferings> {
  try {
    if (!isInitialized && !(await initializeRevenueCat())) {
      throw new Error(
        'RevenueCat is not configured. Add a public SDK key to mobile/.env.'
      );
    }
    
    const Purchases = await getPurchases();
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    throw error;
  }
}

/**
 * Purchase a subscription package
 */
export async function purchasePackage(packageToPurchase: PurchasesPackage) {
  try {
    if (!isInitialized && !(await initializeRevenueCat())) {
      throw new Error(
        'RevenueCat is not configured. Add a public SDK key to mobile/.env.'
      );
    }
    
    const Purchases = await getPurchases();
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error: any) {
    // Handle user cancellation
    if (error.userCancelled) {
      throw new Error('Purchase cancelled by user');
    }
    
    // Handle other errors
    console.error('Purchase failed:', error);
    throw error;
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases() {
  try {
    if (!isInitialized && !(await initializeRevenueCat())) {
      throw new Error(
        'RevenueCat is not configured. Add a public SDK key to mobile/.env.'
      );
    }
    
    const Purchases = await getPurchases();
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
}

/**
 * Get current customer info (subscription status)
 */
export async function getCustomerInfo() {
  try {
    if (!isInitialized && !(await initializeRevenueCat())) {
      throw new Error(
        'RevenueCat is not configured. Add a public SDK key to mobile/.env.'
      );
    }
    
    const Purchases = await getPurchases();
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    throw error;
  }
}

/**
 * Map RevenueCat product ID to subscription tier
 */
const PREMIUM_ENTITLEMENT_IDS = ['premium', 'PMPrp app Pro'] as const;

function getPremiumEntitlement(customerInfo: CustomerInfo) {
  const active = customerInfo.entitlements.active;
  for (const id of PREMIUM_ENTITLEMENT_IDS) {
    if (active[id]) {
      return active[id];
    }
  }
  return null;
}

export function mapProductIdToTier(productId: string): string {
  const productIdMap: Record<string, string> = {
    'premium_monthly': 'premium_monthly',
    'premium_semi_annual': 'premium_semi_annual',
    'premium_annual': 'premium_annual',
    'yearly': 'premium_annual',
    'cram_time': 'cram_time',
  };
  
  return productIdMap[productId.toLowerCase()] || 'free';
}

/**
 * Get subscription tier from customer info
 */
export function getSubscriptionTierFromCustomerInfo(customerInfo: CustomerInfo): string {
  const premiumEntitlement = getPremiumEntitlement(customerInfo);
  if (premiumEntitlement) {
    return mapProductIdToTier(premiumEntitlement.productIdentifier);
  }
  
  return 'free';
}

/**
 * Get subscription expiration date from customer info
 */
export function getSubscriptionExpirationDate(customerInfo: CustomerInfo): Date | null {
  const premiumEntitlement = getPremiumEntitlement(customerInfo);
  
  if (premiumEntitlement?.expirationDate) {
    return new Date(premiumEntitlement.expirationDate);
  }
  
  return null;
}

/**
 * Check if user has active premium subscription
 */
export function hasActivePremium(customerInfo: CustomerInfo): boolean {
  return !!getPremiumEntitlement(customerInfo);
}

/**
 * Sync subscription status with backend
 * This should be called after purchase or restore
 */
export async function syncSubscriptionWithBackend(
  customerInfo: CustomerInfo,
  syncApiCall: (tier: string, expiresAt: Date | null) => Promise<void>
): Promise<void> {
  try {
    const tier = getSubscriptionTierFromCustomerInfo(customerInfo);
    const expiresAt = getSubscriptionExpirationDate(customerInfo);
    
    await syncApiCall(tier, expiresAt);
    console.log('Subscription synced with backend:', { tier, expiresAt });
  } catch (error) {
    console.error('Failed to sync subscription with backend:', error);
    throw error;
  }
}
