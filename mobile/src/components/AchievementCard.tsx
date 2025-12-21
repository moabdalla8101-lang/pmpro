import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  unlocked: boolean;
  progress?: number; // 0-100 for locked achievements
  onPress?: () => void;
}

export default function AchievementCard({
  title,
  description,
  icon,
  iconColor = colors.primary,
  unlocked,
  progress = 0,
  onPress,
}: AchievementCardProps) {
  const Component = onPress ? TouchableOpacity : View;
  const opacity = unlocked ? 1 : 0.5;
  
  return (
    <Component onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { opacity }]}>
        <Card.Content style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <Icon
              name={unlocked ? icon : 'lock'}
              size={32}
              color={unlocked ? iconColor : colors.gray400}
            />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
            <Text variant="bodySmall" style={styles.description}>
              {description}
            </Text>
            {!unlocked && progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%`, backgroundColor: iconColor },
                    ]}
                  />
                </View>
                <Text variant="bodySmall" style={styles.progressText}>
                  {Math.round(progress)}%
                </Text>
              </View>
            )}
          </View>
          {unlocked && (
            <Icon name="check-circle" size={24} color={colors.success} />
          )}
        </Card.Content>
      </Card>
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

