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
  primary: "#E50914",
  primaryDark: "#B20710",
  primaryLight: "#FF1F2E",

  // Background colors
  background: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",
  surface: "#FFFFFF",

  // Text colors
  text: "#000000",
  textSecondary: "#666666",
  textLight: "#999999",

  // Component colors
  card: "#FFFFFF",
  border: "#E0E0E0",
  inputBackground: "#F5F5F5",

  // Status colors
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",

  // Tab bar
  tabBarActive: "#E50914",
  tabBarInactive: "#999999",
  tabBarBackground: "#FFFFFF",
};

export const darkColors = {
  // Primary colors
  primary: "#E50914",
  primaryDark: "#B20710",
  primaryLight: "#FF1F2E",

  // Background colors
  background: "#121212",
  backgroundSecondary: "#1E1E1E",
  surface: "#2C2C2C",

  // Text colors
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textLight: "#808080",

  // Component colors
  card: "#1E1E1E",
  border: "#333333",
  inputBackground: "#2C2C2C",

  // Status colors
  success: "#66BB6A",
  error: "#EF5350",
  warning: "#FFA726",
  info: "#42A5F5",

  // Tab bar
  tabBarActive: "#E50914",
  tabBarInactive: "#808080",
  tabBarBackground: "#1E1E1E",
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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
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
