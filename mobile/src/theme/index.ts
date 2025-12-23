import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Enhanced color palette with better contrast
export const colors = {
  primary: '#6200ee',
  primaryLight: '#9147ff',
  primaryDark: '#3700b3',
  secondary: '#03dac6',
  success: '#4caf50',
  successLight: '#81c784',
  error: '#f44336',
  errorLight: '#e57373',
  warning: '#ff9800',
  info: '#2196f3',
  
  // Neutral grays
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Text colors
  text: '#212121',
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#bdbdbd',
  
  // Additional colors
  white: '#ffffff',
  surface: '#ffffff',
  
  // Knowledge area colors
  knowledgeArea: {
    integration: '#6200ee',
    scope: '#2196f3',
    schedule: '#4caf50',
    cost: '#ff9800',
    quality: '#9c27b0',
    resource: '#f44336',
    communications: '#00bcd4',
    risk: '#ff5722',
    procurement: '#009688',
    stakeholder: '#8bc34a',
  },
  
  // Domain colors (People, Process, Business)
  domain: {
    people: '#e91e63',
    process: '#3f51b5',
    business: '#009688',
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    error: colors.error,
    success: colors.success,
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: colors.gray100,
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onError: '#ffffff',
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    outline: colors.gray300,
  },
  roundness: 12, // Enhanced border radius
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    primaryContainer: colors.primaryDark,
    secondary: colors.secondary,
    error: '#cf6679',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2c2c2c',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    outline: colors.gray700,
  },
  roundness: 12,
};


