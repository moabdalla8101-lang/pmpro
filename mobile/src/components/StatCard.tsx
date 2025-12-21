import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'default' | 'large';
}

export default function StatCard({
  title,
  value,
  icon,
  iconColor = colors.primary,
  subtitle,
  onPress,
  variant = 'default',
}: StatCardProps) {
  const isLarge = variant === 'large';
  
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, isLarge && styles.largeCard]}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: `${iconColor}15` }]}>
              <Icon name={icon} size={isLarge ? 32 : 24} color={iconColor} />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text variant={isLarge ? 'headlineMedium' : 'titleLarge'} style={styles.value}>
              {value}
            </Text>
            <Text variant="bodyMedium" style={styles.title}>
              {title}
            </Text>
            {subtitle && (
              <Text variant="bodySmall" style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  largeCard: {
    marginBottom: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  iconContainer: {
    marginRight: spacing.base,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});

