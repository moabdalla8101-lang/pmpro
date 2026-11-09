import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme';
import { spacing } from '../utils/styles';

/**
 * Uses React Native's ActivityIndicator (one ring).
 * react-native-paper's ActivityIndicator draws a track + arc and looks like two circles.
 */
export default function LoadingSpinner({
  label,
  size = 'large',
  style,
}: {
  label?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.wrap, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {label ? (
        <Text variant="bodyMedium" style={styles.label}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.base,
  },
  label: {
    marginTop: spacing.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
