import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/api/authService';
import { subscriptionService } from '../../services/api/subscriptionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  subscriptionTier: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials.email, credentials.password);
    await AsyncStorage.setItem('token', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const response = await authService.register(data);
    await AsyncStorage.setItem('token', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
});

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const token = await AsyncStorage.getItem('token');
  const userStr = await AsyncStorage.getItem('user');
  if (token && userStr) {
    return { token, user: JSON.parse(userStr) };
  }
  return null;
});

/**
 * Sync subscription from RevenueCat and update user
 */
export const syncSubscription = createAsyncThunk(
  'auth/syncSubscription',
  async (_, { getState }) => {
    try {
      // Get subscription status from backend
      const subscription = await subscriptionService.getSubscription();
      
      // Update stored user data
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.subscriptionTier = subscription.tier;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return {
          subscriptionTier: subscription.tier,
          subscriptionExpiresAt: subscription.expiresAt,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to sync subscription:', error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      // Handle error clearing if needed
    },
    updateSubscriptionTier: (state, action: PayloadAction<{ tier: string; expiresAt?: string | null }>) => {
      if (state.user) {
        state.user.subscriptionTier = action.payload.tier;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(syncSubscription.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.user.subscriptionTier = action.payload.subscriptionTier;
        }
      });
  },
});

export const { clearError, updateSubscriptionTier } = authSlice.actions;
export default authSlice.reducer;


