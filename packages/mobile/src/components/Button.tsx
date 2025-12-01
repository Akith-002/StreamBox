import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  spacing,
  borderRadius,
  fontSizes,
  componentSizes,
  shadows,
} from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

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
  const { colors } = useTheme();

  const containerStyle = [styles.button, fullWidth && styles.fullWidth, style];

  const textStyleCombined = [
    styles.text,
    variant === "primary" && styles.primaryText,
    variant === "secondary" && { color: colors.text },
    variant === "outline" && { color: colors.primary },
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  if (variant === "primary" && !disabled && !loading) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={containerStyle}
      >
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={textStyleCombined}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const buttonStyle = [
    styles.gradientButton,
    variant === "secondary" && { backgroundColor: colors.card },
    variant === "outline" && [
      styles.outlineButton,
      { borderColor: colors.primary },
    ],
    (disabled || loading) && styles.disabledButton,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={buttonStyle}>
        {loading ? (
          <ActivityIndicator
            color={variant === "outline" ? colors.primary : "#FFFFFF"}
          />
        ) : (
          <Text style={textStyleCombined}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.medium,
  },
  fullWidth: {
    width: "100%",
  },
  gradientButton: {
    height: componentSizes.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  outlineButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
  },
  disabledButton: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  text: {
    fontSize: fontSizes.md,
    fontWeight: "700" as const,
  },
  primaryText: {
    color: colors.white,
  },
  disabledText: {
    color: colors.textLight,
  },
});
