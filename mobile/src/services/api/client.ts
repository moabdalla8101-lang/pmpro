import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { getApiUrl } from '../../utils/getApiUrl';

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
      // Only clear session when an existing token was rejected.
      // Guests hitting protected endpoints should stay in browse mode.
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        DeviceEventEmitter.emit('auth:unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export default client;
