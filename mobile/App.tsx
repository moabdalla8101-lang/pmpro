import React, { useCallback, useEffect, useRef } from 'react';
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync().catch(() => {});
import { store, RootState, AppDispatch } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { colors, theme } from './src/theme';
import { CONTENT_MAX_WIDTH } from './src/utils/layout';
import {
  initializeRevenueCat,
  identifyUser,
  logoutUser,
  addCustomerInfoUpdateListener,
} from './src/services/revenueCatService';
import {
  logout,
  syncSubscription as syncBackendSubscription,
} from './src/store/slices/authSlice';
import { setSentryUser } from './src/services/sentry';

async function applyOtaUpdateIfAvailable() {
  if (__DEV__) return;
  try {
    const result = await Updates.checkForUpdateAsync();
    if (!result.isAvailable) return;
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch (error) {
    console.warn('OTA update check failed:', error);
  }
}

// Component to handle RevenueCat initialization
function RevenueCatInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const appState = useRef(AppState.currentState);
  const lastSyncAt = useRef(0);

  const syncPlan = useCallback(() => {
    if (!isAuthenticated) return;
    const now = Date.now();
    // Avoid hammering the API on rapid focus/resume events
    if (now - lastSyncAt.current < 1500) return;
    lastSyncAt.current = now;
    dispatch(syncBackendSubscription()).catch((error) => {
      console.error('Failed to sync backend subscription:', error);
    });
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Initialize RevenueCat when app starts
    initializeRevenueCat().catch((error) => {
      console.error('Failed to initialize RevenueCat:', error);
    });
  }, []);

  useEffect(() => {
    // Identify user with RevenueCat after login
    if (isAuthenticated && user?.id) {
      setSentryUser({ id: user.id, email: user.email });
      identifyUser(user.id).catch((error) => {
        console.error('Failed to identify RevenueCat user:', error);
      });
      syncPlan();
    } else if (!isAuthenticated) {
      setSentryUser(null);
      // Logout from RevenueCat when user logs out
      logoutUser().catch((error) => {
        console.error('Failed to logout RevenueCat user:', error);
      });
    }
  }, [isAuthenticated, user?.id, user?.email, syncPlan]);

  // Refresh plan when returning from background (e.g. after App Store plan change)
  useEffect(() => {
    const onAppStateChange = (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        syncPlan();
      }
      appState.current = nextState;
    };
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, [syncPlan]);

  // Refresh plan when RevenueCat pushes updated customer info
  useEffect(() => {
    if (!isAuthenticated) return;
    let remove: (() => void) | undefined;
    addCustomerInfoUpdateListener(() => {
      syncPlan();
    })
      .then((unsubscribe) => {
        remove = unsubscribe;
      })
      .catch(() => {});
    return () => remove?.();
  }, [isAuthenticated, syncPlan]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('auth:unauthorized', () => {
      dispatch(logout());
    });
    return () => subscription.remove();
  }, [dispatch]);

  return null;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(MaterialCommunityIcons.font);
  const { width } = useWindowDimensions();
  const isWide = width > CONTENT_MAX_WIDTH;

  useEffect(() => {
    applyOtaUpdateIfAvailable();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={[styles.column, isWide && styles.columnWide]}>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <RevenueCatInitializer />
              <AppNavigator />
            </NavigationContainer>
          </PaperProvider>
        </Provider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    backgroundColor: colors.gray50,
  },
  columnWide: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray200,
  },
});




