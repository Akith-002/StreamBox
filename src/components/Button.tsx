import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  lightColors,
  spacing,
  borderRadius,
  fontSizes,
  componentSizes,
  shadows,
} from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    fullWidth && styles.fullWidth,
    variant === "primary" && styles.primaryButton,
    variant === "secondary" && styles.secondaryButton,
    variant === "outline" && styles.outlineButton,
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    variant === "primary" && styles.primaryText,
    variant === "secondary" && styles.secondaryText,
    variant === "outline" && styles.outlineText,
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" ? lightColors.primary : lightColors.background
          }
        />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: componentSizes.buttonHeight,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    ...shadows.small,
  },
  fullWidth: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: lightColors.primary,
  },
  secondaryButton: {
    backgroundColor: lightColors.backgroundSecondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: lightColors.primary,
  },
  disabledButton: {
    backgroundColor: lightColors.border,
    opacity: 0.6,
  },
  text: {
    fontSize: fontSizes.md,
    fontWeight: "600" as "600",
  },
  primaryText: {
    color: lightColors.background,
  },
  secondaryText: {
    color: lightColors.text,
  },
  outlineText: {
    color: lightColors.primary,
  },
  disabledText: {
    color: lightColors.textLight,
  },
});
