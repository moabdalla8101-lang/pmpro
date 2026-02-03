import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme';
import { spacing, borderRadius } from '../utils/styles';

interface CategoryBadgeProps {
  label: string;
  color?: string;
  onPress?: () => void;
  selected?: boolean;
  variant?: 'default' | 'pill' | 'outlined';
}

const getKnowledgeAreaColor = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes('integration')) return colors.knowledgeArea.integration;
  if (lower.includes('scope')) return colors.knowledgeArea.scope;
  if (lower.includes('schedule') || lower.includes('time')) return colors.knowledgeArea.schedule;
  if (lower.includes('cost')) return colors.knowledgeArea.cost;
  if (lower.includes('quality')) return colors.knowledgeArea.quality;
  if (lower.includes('resource') || lower.includes('team')) return colors.knowledgeArea.resource;
  if (lower.includes('communication')) return colors.knowledgeArea.communications;
  if (lower.includes('risk')) return colors.knowledgeArea.risk;
  if (lower.includes('procurement')) return colors.knowledgeArea.procurement;
  if (lower.includes('stakeholder')) return colors.knowledgeArea.stakeholder;
  return colors.primary;
};

const getDifficultyColor = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower === 'easy') return colors.success;
  if (lower === 'medium') return colors.warning;
  if (lower === 'hard') return colors.error;
  return colors.gray500;
};

export default function CategoryBadge({
  label,
  color,
  onPress,
  selected = false,
  variant = 'default',
}: CategoryBadgeProps) {
  const badgeColor = color || getKnowledgeAreaColor(label) || getDifficultyColor(label);
  const isPill = variant === 'pill';
  const isOutlined = variant === 'outlined';
  
  const Component = onPress ? TouchableOpacity : View;
  
  const badgeStyle = [
    styles.badge,
    isPill && styles.pill,
    isOutlined && styles.outlined,
    selected && { backgroundColor: badgeColor },
    !selected && !isOutlined && { backgroundColor: `${badgeColor}15` },
    isOutlined && { borderColor: badgeColor },
  ];
  
  const textStyle = [
    styles.text,
    selected && styles.textSelected,
    isOutlined && { color: badgeColor },
  ];

  return (
    <Component onPress={onPress} activeOpacity={0.7} style={badgeStyle}>
      <Text variant="labelSmall" style={textStyle}>
        {label}
      </Text>
    </Component>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  pill: {
    borderRadius: borderRadius.pill,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textSelected: {
    color: '#ffffff',
  },
});



