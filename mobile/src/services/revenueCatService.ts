/**
 * RevenueCat Service
 * Handles all RevenueCat SDK operations for in-app purchases
 */

import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get API keys from environment
// Test keys work for both iOS and Android
const REVENUECAT_TEST_API_KEY = Constants.expoConfig?.extra?.revenueCatTestApiKey || 
  process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || '';
const REVENUECAT_IOS_API_KEY = Constants.expoConfig?.extra?.revenueCatIosApiKey || 
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
const REVENUECAT_ANDROID_API_KEY = Constants.expoConfig?.extra?.revenueCatAndroidApiKey || 
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '';

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Should be called when app starts, before any other RevenueCat operations
 */
export async function initializeRevenueCat(): Promise<void> {
  if (isInitialized) {
    console.log('RevenueCat already initialized');
    return;
  }

  try {
    // Use test key if available (works for both platforms), otherwise use platform-specific key
    let apiKey = REVENUECAT_TEST_API_KEY;
    if (!apiKey) {
      apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
    }
    
    if (!apiKey) {
      console.warn('RevenueCat API key not found. Please set EXPO_PUBLIC_REVENUECAT_TEST_API_KEY or platform-specific keys');
      return;
    }

    await Purchases.configure({ apiKey });
    isInitialized = true;
    console.log('RevenueCat initialized successfully');
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
  try {
    if (!isInitialized) {
      await initializeRevenueCat();
    }
    
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
  try {
    const { customerInfo } = await Purchases.logOut();
    console.log('RevenueCat user logged out');
    return customerInfo;
  } catch (error) {
    console.error('Failed to logout RevenueCat user:', error);
    throw error;
  }
}

/**
 * Get available offerings (subscription packages)
 */
export async function getOfferings() {
  try {
    if (!isInitialized) {
      await initializeRevenueCat();
    }
    
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
export async function purchasePackage(packageToPurchase: Purchases.Package) {
  try {
    if (!isInitialized) {
      await initializeRevenueCat();
    }
    
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
    if (!isInitialized) {
      await initializeRevenueCat();
    }
    
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
    if (!isInitialized) {
      await initializeRevenueCat();
    }
    
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
export function mapProductIdToTier(productId: string): string {
  const productIdMap: Record<string, string> = {
    'premium_monthly': 'premium_monthly',
    'premium_semi_annual': 'premium_semi_annual',
    'premium_annual': 'premium_annual',
    'cram_time': 'cram_time',
  };
  
  return productIdMap[productId.toLowerCase()] || 'free';
}

/**
 * Get subscription tier from customer info
 */
export function getSubscriptionTierFromCustomerInfo(customerInfo: Purchases.CustomerInfo): string {
  const activeEntitlements = customerInfo.entitlements.active;
  
  // Check for premium entitlement
  if (activeEntitlements['premium']) {
    const productId = activeEntitlements['premium'].productIdentifier;
    return mapProductIdToTier(productId);
  }
  
  return 'free';
}

/**
 * Get subscription expiration date from customer info
 */
export function getSubscriptionExpirationDate(customerInfo: Purchases.CustomerInfo): Date | null {
  const premiumEntitlement = customerInfo.entitlements.active['premium'];
  
  if (premiumEntitlement) {
    return new Date(premiumEntitlement.expirationDate);
  }
  
  return null;
}

/**
 * Check if user has active premium subscription
 */
export function hasActivePremium(customerInfo: Purchases.CustomerInfo): boolean {
  return !!customerInfo.entitlements.active['premium'];
}

/**
 * Sync subscription status with backend
 * This should be called after purchase or restore
 */
export async function syncSubscriptionWithBackend(
  customerInfo: Purchases.CustomerInfo,
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
