import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Get the correct API URL based on the platform
 * iOS Simulator: localhost works
 * Android Emulator: need to use 10.0.2.2
 * Physical Device: use the computer's local IP from Expo dev server
 */
export const getApiUrl = (): string => {
  // Check if explicitly set in environment
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Default based on platform
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine
    return __DEV__ ? 'http://10.0.2.2:3001' : 'https://api.pmpapp.com';
  }

  // For iOS: Check if running on physical device
  // Expo provides the dev server URL in Constants.expoConfig.hostUri
  // On physical device, this will be the computer's IP address
  if (__DEV__ && Platform.OS === 'ios') {
    // Check if we're on a physical device (hostUri will be IP address, not localhost)
    const hostUri = Constants.expoConfig?.hostUri;
    const isPhysicalDevice = hostUri && !hostUri.includes('localhost') && !hostUri.includes('127.0.0.1');
    
    if (isPhysicalDevice) {
      // Extract IP address from hostUri (format: "192.168.x.x:8081")
      const ipAddress = hostUri.split(':')[0];
      return `http://${ipAddress}:3001`;
    } else {
      // Simulator - use localhost
      return 'http://localhost:3001';
    }
  }

  // Fallback for web or production
  return __DEV__ ? 'http://localhost:3001' : 'https://api.pmpapp.com';
};

