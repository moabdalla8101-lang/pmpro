import React, { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { store, RootState, AppDispatch } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { initializeRevenueCat, identifyUser, logoutUser } from './src/services/revenueCatService';
import {
  logout,
  syncSubscription as syncBackendSubscription,
} from './src/store/slices/authSlice';

// Component to handle RevenueCat initialization
function RevenueCatInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initialize RevenueCat when app starts
    initializeRevenueCat().catch((error) => {
      console.error('Failed to initialize RevenueCat:', error);
    });
  }, []);

  useEffect(() => {
    // Identify user with RevenueCat after login
    if (isAuthenticated && user?.id) {
      identifyUser(user.id).catch((error) => {
        console.error('Failed to identify RevenueCat user:', error);
      });
      dispatch(syncBackendSubscription()).catch((error) => {
        console.error('Failed to sync backend subscription:', error);
      });
    } else if (!isAuthenticated) {
      // Logout from RevenueCat when user logs out
      logoutUser().catch((error) => {
        console.error('Failed to logout RevenueCat user:', error);
      });
    }
  }, [dispatch, isAuthenticated, user?.id]);

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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RevenueCatInitializer />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}




