import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { colors } from '../theme';
import { spacing } from '../utils/styles';
import { cancelPendingPracticeAuth } from '../utils/practiceTestDraft';

const Stack = createStackNavigator();

function AuthDismissBar() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const routeParams = (route.params as {
    allowDismiss?: boolean;
    params?: { allowDismiss?: boolean; reason?: string };
    screen?: string;
  }) || {};

  // Root Auth route: { screen, params: { reason, allowDismiss } }
  // Nested screens may also carry allowDismiss directly.
  const nested = routeParams.params;
  const allowDismiss =
    routeParams.allowDismiss !== false && nested?.allowDismiss !== false;

  if (!allowDismiss) {
    return null;
  }

  const handleDismiss = async () => {
    await cancelPendingPracticeAuth();
    const parent = navigation.getParent();
    if (parent?.canGoBack?.()) {
      parent.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.dismissBar}>
      <TouchableOpacity onPress={handleDismiss} accessibilityRole="button">
        <Text style={styles.dismissText}>Continue browsing as guest</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AuthNavigator() {
  return (
    <View style={styles.shell}>
      <AuthDismissBar />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  dismissBar: {
    paddingTop: spacing.base,
    paddingHorizontal: spacing.base,
    alignItems: 'flex-end',
  },
  dismissText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
