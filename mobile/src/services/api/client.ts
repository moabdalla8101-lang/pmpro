import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { getApiUrl } from '../../utils/getApiUrl';
import { getApiErrorMessage } from '../../utils/apiError';
import { captureApiError, Sentry } from '../sentry';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getApiUrl();

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url || '');
      // Failed login/register must not wipe an existing session.
      const isAuthCredentialRequest =
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/register') ||
        url.includes('/api/auth/social-login');

      if (!isAuthCredentialRequest) {
        // Only clear session when an existing token was rejected.
        // Guests hitting protected endpoints should stay in browse mode.
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          DeviceEventEmitter.emit('auth:unauthorized');
        }
      }
    }

    // Normalize Axios "Request failed with status code NNN" into the API message
    // so every screen that reads error.message gets something meaningful.
    try {
      const friendly = getApiErrorMessage(error, error?.message || 'Something went wrong');
      if (friendly) {
        error.message = friendly;
      }
    } catch {
      // keep original error
    }

    const status = error.response?.status;
    const url = String(error.config?.url || '');
    if (!status || status >= 500) {
      Sentry.addBreadcrumb({
        category: 'api',
        message: `${error.config?.method?.toUpperCase() || 'REQ'} ${url}`,
        level: 'error',
        data: { status },
      });
      captureApiError(error, {
        url,
        method: error.config?.method,
        status,
      });
    }

    return Promise.reject(error);
  }
);

export default client;
