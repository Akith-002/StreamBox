import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { setCredentials } from "../store/features/authSlice";
import { loginSchema } from "../utils/validationSchemas";
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { LoginCredentials } from "../types/Auth";
import { spacing, fontSizes } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { useLoginMutation } from "../api/backendApi";
import { saveToken, saveUser } from "../utils/secureStorage";

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const result = await login(data).unwrap();
      await saveToken(result.token);
      await saveUser(result.user);
      dispatch(setCredentials(result));
    } catch {
      // Handle login error
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

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
            <View style={styles.logoWrapper}>
              <Logo size={48} showText={false} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Let&apos;s sign you in.
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Welcome back. You&apos;ve been missed!
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              name="username"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email or Username"
                  placeholder="name@example.com"
                  icon="mail"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
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
                  secureTextEntry
                />
              )}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={[styles.forgotText, { color: colors.textLight }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? "Signing In..." : "Sign In"}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don&apos;t have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Register
              </Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl * 1.5,
  },
  logoWrapper: {
    marginBottom: spacing.lg,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: "500",
  },
  form: {
    gap: spacing.md,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  forgotText: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl * 2,
    gap: 6,
  },
  footerText: {
    fontSize: fontSizes.md,
  },
  footerLink: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
  },
});
