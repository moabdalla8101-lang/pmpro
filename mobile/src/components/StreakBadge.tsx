import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';

interface StreakBadgeProps {
  days: number;
  size?: 'small' | 'medium' | 'large';
}

export default function StreakBadge({ days, size = 'medium' }: StreakBadgeProps) {
  const iconSize = size === 'large' ? 32 : size === 'small' ? 20 : 24;
  const fontSize = size === 'large' ? 18 : size === 'small' ? 12 : 14;
  const containerSize = size === 'large' ? 80 : size === 'small' ? 50 : 64;
  
  return (
    <LinearGradient
      colors={['#ff6b00', '#ff9800', '#ffb300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        },
        shadows.md,
      ]}
    >
      <Icon name="fire" size={iconSize} color="#ffffff" />
      <Text style={[styles.days, { fontSize, marginTop: spacing.xs }]}>
        {days}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  days: {
    fontWeight: '700',
    color: '#ffffff',
  },
});

