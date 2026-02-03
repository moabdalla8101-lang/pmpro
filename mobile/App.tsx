import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { store, RootState, AppDispatch } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { initializeRevenueCat, identifyUser, logoutUser } from './src/services/revenueCatService';
import { loadUser } from './src/store/slices/authSlice';

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
    } else if (!isAuthenticated) {
      // Logout from RevenueCat when user logs out
      logoutUser().catch((error) => {
        console.error('Failed to logout RevenueCat user:', error);
      });
    }
  }, [isAuthenticated, user?.id]);

  // Load user from storage on mount
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return null;
}

export default function App() {
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




