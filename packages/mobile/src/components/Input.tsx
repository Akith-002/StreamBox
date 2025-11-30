import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import {
  spacing,
  borderRadius,
  fontSizes,
  componentSizes,
  shadows,
} from "../constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Feather.glyphMap;
  touched?: boolean;
}

export default function Input({
  label,
  error,
  icon,
  touched,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();
  const hasError = touched && error;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: hasError ? colors.error : colors.border,
          },
          hasError && styles.inputContainerError,
        ]}
      >
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={hasError ? colors.error : colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            { color: colors.text },
          ]}
          placeholderTextColor={colors.textLight}
          {...textInputProps}
        />
      </View>

      {hasError && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    width: "100%",
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600" as const,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    height: componentSizes.inputHeight,
    paddingHorizontal: spacing.lg,
    ...shadows.small,
  },
  inputContainerError: {
    borderWidth: 2,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    height: "100%",
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
  errorText: {
    fontSize: fontSizes.xs,
    marginLeft: spacing.xs,
  },
});
