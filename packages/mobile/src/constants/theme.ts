import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Breakpoints for responsive design
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const isSmallScreen = width < 375;
export const isMediumScreen = width >= 375 && width < 768;
export const isLargeScreen = width >= 768;

// Color palette
export const lightColors = {
  // Primary colors
  primary: "#6366F1",
  accent: "#EC4899",
  primaryDark: "#4F46E5",
  primaryLight: "#818CF8",

  // Background colors
  background: "#F1F5F9",
  backgroundSecondary: "#E2E8F0",
  surface: "#FFFFFF",

  // Text colors
  text: "#1E293B",
  textSecondary: "#64748B",
  textLight: "#94A3B8",

  // Component colors
  card: "#FFFFFF",
  border: "#CBD5E1",
  inputBackground: "#F8FAFC",

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Tab bar
  tabBarActive: "#6366F1",
  tabBarInactive: "#94A3B8",
  tabBarBackground: "#FFFFFF",
};

export const darkColors = {
  // Primary colors
  primary: "#6366F1",
  accent: "#EC4899",
  primaryDark: "#4F46E5",
  primaryLight: "#818CF8",

  // Background colors
  background: "#0F172A",
  backgroundSecondary: "#1E293B",
  surface: "#1E293B",

  // Text colors
  text: "#F1F5F9",
  textSecondary: "#CBD5E1",
  textLight: "#94A3B8",

  // Component colors
  card: "#1E293B",
  border: "#334155",
  inputBackground: "#0F172A",

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Tab bar
  tabBarActive: "#6366F1",
  tabBarInactive: "#64748B",
  tabBarBackground: "#1E293B",
};

// Typography
export const fonts = {
  regular: "System",
  medium: "System",
  bold: "System",
  semiBold: "System",
};

export const fontSizes = {
  xs: isSmallScreen ? 10 : 12,
  sm: isSmallScreen ? 12 : 14,
  md: isSmallScreen ? 14 : 16,
  lg: isSmallScreen ? 16 : 18,
  xl: isSmallScreen ? 20 : 24,
  xxl: isSmallScreen ? 24 : 28,
  xxxl: isSmallScreen ? 28 : 32,
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Component sizes
export const componentSizes = {
  buttonHeight: isSmallScreen ? 48 : 56,
  inputHeight: isSmallScreen ? 48 : 56,
  iconSize: isSmallScreen ? 20 : 24,
  tabIconSize: isSmallScreen ? 22 : 24,
};
