import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  KeyboardTypeOptions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  lightColors,
  spacing,
  borderRadius,
  fontSizes,
  componentSizes,
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
  const hasError = touched && error;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[styles.inputContainer, hasError && styles.inputContainerError]}
      >
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={hasError ? lightColors.error : lightColors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholderTextColor={lightColors.textLight}
          {...textInputProps}
        />
      </View>

      {hasError && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={lightColors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: "100%",
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600" as "600",
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.inputBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: lightColors.border,
    height: componentSizes.inputHeight,
    paddingHorizontal: spacing.md,
  },
  inputContainerError: {
    borderColor: lightColors.error,
    borderWidth: 1.5,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    color: lightColors.text,
    height: "100%",
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: lightColors.error,
    marginLeft: spacing.xs,
  },
});
