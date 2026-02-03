import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Purchases from 'react-native-purchases';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  getSubscriptionTierFromCustomerInfo,
  getSubscriptionExpirationDate,
} from '../../services/revenueCatService';

interface SubscriptionState {
  offerings: Purchases.Offerings | null;
  customerInfo: Purchases.CustomerInfo | null;
  isLoading: boolean;
  isPurchasing: boolean;
  error: string | null;
  lastSyncAt: Date | null;
}

const initialState: SubscriptionState = {
  offerings: null,
  customerInfo: null,
  isLoading: false,
  isPurchasing: false,
  error: null,
  lastSyncAt: null,
};

/**
 * Fetch available subscription offerings
 */
export const fetchOfferings = createAsyncThunk(
  'subscription/fetchOfferings',
  async (_, { rejectWithValue }) => {
    try {
      const offerings = await getOfferings();
      return offerings;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch offerings');
    }
  }
);

/**
 * Purchase a subscription package
 */
export const purchaseSubscription = createAsyncThunk(
  'subscription/purchase',
  async (packageToPurchase: Purchases.Package, { rejectWithValue, dispatch }) => {
    try {
      const customerInfo = await purchasePackage(packageToPurchase);
      
      // Sync with backend - import dynamically to avoid circular dependency
      const { subscriptionService } = await import('../../services/api/subscriptionService');
      const tier = getSubscriptionTierFromCustomerInfo(customerInfo);
      const expiresAt = getSubscriptionExpirationDate(customerInfo);
      
      await subscriptionService.syncSubscription(tier, expiresAt);
      
      // Refresh customer info
      dispatch(refreshCustomerInfo());
      
      return customerInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Purchase failed');
    }
  }
);

/**
 * Restore previous purchases
 */
export const restoreSubscription = createAsyncThunk(
  'subscription/restore',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const customerInfo = await restorePurchases();
      
      // Sync with backend - import dynamically to avoid circular dependency
      const { subscriptionService } = await import('../../services/api/subscriptionService');
      const tier = getSubscriptionTierFromCustomerInfo(customerInfo);
      const expiresAt = getSubscriptionExpirationDate(customerInfo);
      
      await subscriptionService.syncSubscription(tier, expiresAt);
      
      // Refresh customer info
      dispatch(refreshCustomerInfo());
      
      return customerInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to restore purchases');
    }
  }
);

/**
 * Refresh customer info from RevenueCat
 */
export const refreshCustomerInfo = createAsyncThunk(
  'subscription/refreshCustomerInfo',
  async (_, { rejectWithValue }) => {
    try {
      const customerInfo = await getCustomerInfo();
      return customerInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh customer info');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOfferings: (state, action: PayloadAction<Purchases.Offerings>) => {
      state.offerings = action.payload;
    },
    setCustomerInfo: (state, action: PayloadAction<Purchases.CustomerInfo>) => {
      state.customerInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch offerings
    builder
      .addCase(fetchOfferings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOfferings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offerings = action.payload;
      })
      .addCase(fetchOfferings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Purchase subscription
    builder
      .addCase(purchaseSubscription.pending, (state) => {
        state.isPurchasing = true;
        state.error = null;
      })
      .addCase(purchaseSubscription.fulfilled, (state, action) => {
        state.isPurchasing = false;
        state.customerInfo = action.payload;
        state.lastSyncAt = new Date();
      })
      .addCase(purchaseSubscription.rejected, (state, action) => {
        state.isPurchasing = false;
        state.error = action.payload as string;
      });

    // Restore subscription
    builder
      .addCase(restoreSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(restoreSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerInfo = action.payload;
        state.lastSyncAt = new Date();
      })
      .addCase(restoreSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh customer info
    builder
      .addCase(refreshCustomerInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshCustomerInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerInfo = action.payload;
        state.lastSyncAt = new Date();
      })
      .addCase(refreshCustomerInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setOfferings, setCustomerInfo } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
