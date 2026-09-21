import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useStore } from 'react-redux';
import { loadUser } from '../store/slices/authSlice';
import { RootState } from '../store';
import { cancelPendingPracticeAuth } from '../utils/practiceTestDraft';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';
import PaywallScreen from '../components/PaywallScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await dispatch(loadUser() as any);
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (isBootstrapping) {
    return <SplashScreen />;
  }

  // Guests can browse Main immediately. Auth and Paywall are on-demand modals.
  // Boot splash is local state so login/register never remount Main.
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ presentation: 'modal' }}
        listeners={{
          beforeRemove: () => {
            // Swipe/back dismiss without login must cancel auto-submit drafts.
            // Successful login sets isAuthenticated before goBack, so we keep those.
            if (!store.getState().auth.isAuthenticated) {
              cancelPendingPracticeAuth();
            }
          },
        }}
      />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
