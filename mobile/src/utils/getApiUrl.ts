import { Platform } from 'react-native';

/**
 * Get the correct API URL based on the platform
 * iOS Simulator: localhost works
 * Android Emulator: need to use 10.0.2.2
 * Physical Device: use the computer's local IP
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

  // iOS simulator and web can use localhost
  return __DEV__ ? 'http://localhost:3001' : 'https://api.pmpapp.com';
};

