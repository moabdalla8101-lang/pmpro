import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Get the correct API URL based on the platform
 * iOS Simulator: localhost works
 * Android Emulator: need to use 10.0.2.2
 * Physical Device: use the computer's local IP from Expo dev server
 */
export const getApiUrl = (): string => {
  const configuredUrl =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    '';

  if (configuredUrl) {
    return configuredUrl;
  }

  if (!__DEV__) {
    throw new Error(
      'EXPO_PUBLIC_API_URL is required in production and TestFlight builds.'
    );
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  if (Platform.OS === 'ios') {
    const hostUri = Constants.expoConfig?.hostUri;
    const isPhysicalDevice =
      hostUri &&
      !hostUri.includes('localhost') &&
      !hostUri.includes('127.0.0.1');

    if (isPhysicalDevice) {
      return `http://${hostUri.split(':')[0]}:3001`;
    }
  }

  return 'http://localhost:3001';
};

