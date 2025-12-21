import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';
import { spacing } from '../utils/styles';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 12,
  color = colors.primary,
  backgroundColor = colors.gray200,
  showPercentage = true,
  label,
}: ProgressRingProps) {
  // Ensure progress is always a number
  const safeProgress = typeof progress === 'number' && !isNaN(progress) ? progress : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeProgress / 100) * circumference;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[styles.overlay, { width: size, height: size }]}>
        {showPercentage && (
          <Text variant="headlineMedium" style={styles.percentage}>
            {Math.round(safeProgress)}%
          </Text>
        )}
        {label && (
          <Text variant="bodySmall" style={styles.label}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

