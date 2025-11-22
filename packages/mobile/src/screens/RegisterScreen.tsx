import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Feather } from "@expo/vector-icons";
import { registerSchema } from "../utils/validationSchemas";
import Input from "../components/Input";
import Button from "../components/Button";
import { RegisterData } from "../types/Auth";
import { useTheme } from "../hooks/useTheme";
import {
  spacing,
  fontSizes,
  borderRadius,
  SCREEN_HEIGHT,
} from "../constants/theme";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Registration Successful",
        "Your account has been created. Please sign in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>
            Back
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: `${colors.primary}20` },
            ]}
          >
            <Feather name="film" size={40} color={colors.primary} />
          </View>

          <Text style={[styles.appName, { color: colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Join StreamBox and discover amazing movies
          </Text>
        </View>

        {/* Info Banner */}
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: `${colors.warning}10`,
              borderColor: colors.warning,
            },
          ]}
        >
          <View style={styles.infoIconContainer}>
            <Feather name="alert-circle" size={18} color={colors.warning} />
          </View>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            This is a demo. Registration data won't be saved.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.form}>
            {/* Name Row */}
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="John"
                      icon="user"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      touched={touchedFields.firstName}
                      autoCapitalize="words"
                    />
                  )}
                />
              </View>

              <View style={styles.halfWidth}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      icon="user"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                      touched={touchedFields.lastName}
                      autoCapitalize="words"
                    />
                  )}
                />
              </View>
            </View>

            {/* Username Field */}
            <Controller
              name="username"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username"
                  placeholder="johndoe"
                  icon="at-sign"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  touched={touchedFields.username}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  icon="mail"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  touched={touchedFields.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="At least 6 characters"
                  icon="lock"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  touched={touchedFields.password}
                  secureTextEntry
                  autoCapitalize="none"
                />
              )}
            />

            {/* Create Account Button */}
            <Button
              title={loading ? "Creating Account..." : "Create Account"}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.border }]}
          />
          <Text style={[styles.dividerText, { color: colors.textLight }]}>
            or
          </Text>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.border }]}
          />
        </View>

        {/* Sign In Link */}
        <View style={styles.signInSection}>
          <Text style={[styles.signInText, { color: colors.textSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={[styles.signInLink, { color: colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: SCREEN_HEIGHT * 0.95,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  backButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  infoBanner: {
    flexDirection: "row",
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  infoIconContainer: {
    marginRight: spacing.md,
  },
  infoText: {
    fontSize: fontSizes.sm,
    flex: 1,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
  signInSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  signInText: {
    fontSize: fontSizes.md,
  },
  signInLink: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: spacing.lg,
  },
});
