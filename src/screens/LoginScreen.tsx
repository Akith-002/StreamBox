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
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { setCredentials } from "../store/features/authSlice";
import { loginSchema } from "../utils/validationSchemas";
import Input from "../components/Input";
import Button from "../components/Button";
import { LoginCredentials } from "../types/Auth";
import {
  spacing,
  fontSizes,
  borderRadius,
  SCREEN_HEIGHT,
} from "../constants/theme";

import { useTheme } from "../hooks/useTheme";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://dummyjson.com/auth/login",
        data,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      dispatch(
        setCredentials({
          user: response.data,
          token: response.data.token,
        })
      );
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response?.status === 400) {
        errorMessage = "Invalid username or password.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Connection timeout. Please check your internet.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: `${colors.primary}20` },
              ]}
            >
              <Feather name="film" size={56} color={colors.primary} />
            </View>
          </View>

          {/* Branding */}
          <Text style={[styles.appName, { color: colors.text }]}>
            StreamBox
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Discover a world of movies
          </Text>
        </View>

        {/* Demo Info Banner */}
        <View
          style={[
            styles.demoBanner,
            { backgroundColor: `${colors.info}10`, borderColor: colors.info },
          ]}
        >
          <View style={styles.demoIconContainer}>
            <Feather name="info" size={18} color={colors.info} />
          </View>
          <View style={styles.demoContent}>
            <Text style={[styles.demoTitle, { color: colors.text }]}>
              Demo Credentials
            </Text>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>
              username: <Text style={{ fontWeight: "bold" }}>emilys</Text>
            </Text>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>
              password: <Text style={{ fontWeight: "bold" }}>emilyspass</Text>
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            Sign In
          </Text>

          <View style={styles.form}>
            <Controller
              name="username"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  icon="user"
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

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
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

            <Button
              title={loading ? "Signing In..." : "Sign In"}
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

        {/* Sign Up Link */}
        <View style={styles.signUpSection}>
          <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={loading}
          >
            <Text style={[styles.signUpLink, { color: colors.primary }]}>
              Create Account
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
    paddingVertical: spacing.xl,
    minHeight: SCREEN_HEIGHT * 0.95,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: fontSizes.xxxl,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSizes.md,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  demoBanner: {
    flexDirection: "row",
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  demoIconContainer: {
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  demoText: {
    fontSize: fontSizes.xs,
    lineHeight: 18,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  formTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
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
  signUpSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  signUpText: {
    fontSize: fontSizes.md,
  },
  signUpLink: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: spacing.lg,
  },
});
