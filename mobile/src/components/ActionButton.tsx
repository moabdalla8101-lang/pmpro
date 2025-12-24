import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function ActionButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ActionButtonProps) {
  // Ensure boolean props are actually booleans
  const isLoading = Boolean(loading);
  const isDisabled = Boolean(disabled);
  const isFullWidth = Boolean(fullWidth);
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutlined = variant === 'outlined';
  const isText = variant === 'text';
  
  const paddingVertical = size === 'large' ? spacing.md : size === 'small' ? spacing.sm : spacing.base;
  const paddingHorizontal = size === 'large' ? spacing.lg : size === 'small' ? spacing.base : spacing.lg;
  const fontSize = size === 'large' ? 16 : size === 'small' ? 14 : 15;
  
  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled || isLoading}
        activeOpacity={0.8}
        style={[isFullWidth && styles.fullWidth, isDisabled && styles.disabled]}
      >
        <LinearGradient
          colors={isDisabled ? [colors.gray400, colors.gray400] : [colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradientButton,
            { paddingVertical, paddingHorizontal },
            shadows.md,
          ]}
        >
          <View style={styles.buttonContent}>
            {icon && !isLoading && (
              <Icon name={icon} size={20} color="#ffffff" style={styles.icon} />
            )}
            {isLoading ? (
              <Text style={[styles.buttonText, { fontSize, color: '#ffffff' }]}>Loading...</Text>
            ) : (
              <Text style={[styles.buttonText, { fontSize, color: '#ffffff' }]}>
                {label}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  if (isSecondary) {
    return (
      <Button
        mode="contained"
        onPress={onPress}
        disabled={isDisabled || isLoading}
        loading={isLoading}
        icon={icon}
        buttonColor={colors.secondary}
        textColor="#000000"
        style={[styles.button, isFullWidth && styles.fullWidth]}
        labelStyle={{ fontSize, paddingVertical: spacing.xs }}
      >
        {label}
      </Button>
    );
  }
  
  if (isOutlined) {
    return (
      <Button
        mode="outlined"
        onPress={onPress}
        disabled={isDisabled || isLoading}
        loading={isLoading}
        icon={icon}
        buttonColor="transparent"
        textColor={colors.primary}
        style={[styles.button, isFullWidth && styles.fullWidth, { borderColor: colors.primary }]}
        labelStyle={{ fontSize, paddingVertical: spacing.xs }}
      >
        {label}
      </Button>
    );
  }
  
  // Text variant
  return (
    <Button
      mode="text"
      onPress={onPress}
      disabled={isDisabled || isLoading}
      loading={isLoading}
      icon={icon}
      textColor={colors.primary}
      style={[styles.button, isFullWidth && styles.fullWidth]}
      labelStyle={{ fontSize, paddingVertical: spacing.xs }}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  gradientButton: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  buttonText: {
    fontWeight: '600',
  },
  button: {
    borderRadius: borderRadius.lg,
  },
});

