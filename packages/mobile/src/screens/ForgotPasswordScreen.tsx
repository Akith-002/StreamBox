import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"; // Using yup directly here for standalone functionality
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import { spacing, fontSizes } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

// Define schema locally or move to validationSchemas.ts
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordData = {
  email: string;
};

interface ForgotPasswordScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

export default function ForgotPasswordScreen({
  navigation,
}: ForgotPasswordScreenProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.warn("Reset email sent to:", data.email);

      Alert.alert(
        "Check your email",
        "We have sent password reset instructions to your email address.",
        [{ text: "Back to Login", onPress: () => navigation.navigate("Login") }]
      );
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Subtle Background Gradient */}
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, { borderColor: colors.border }]}
            >
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Reset Password
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Enter the email associated with your account and we will send an
                email with instructions to reset your password.
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              name="email"
              control={control}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error, isTouched },
              }) => (
                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  icon="mail"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error?.message || errors.email?.message}
                  touched={isTouched}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={
                  isLoading ? "Sending Instructions..." : "Send Instructions"
                }
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerTextContainer: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontWeight: "500",
    lineHeight: 24,
  },
  form: {
    gap: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
});
