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
import axios from "axios";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { setCredentials } from "../store/features/authSlice";
import { loginSchema } from "../utils/validationSchemas";
import Input from "../components/Input";
import Button from "../components/Button";
import { LoginCredentials } from "../types/Auth";
import {
  lightColors,
  spacing,
  fontSizes,
  SCREEN_HEIGHT,
  borderRadius,
} from "../constants/theme";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch();
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="film" size={48} color={lightColors.primary} />
          </View>
          <Text style={styles.title}>StreamBox</Text>
          <Text style={styles.subtitle}>
            Sign in to explore trending movies
          </Text>
        </View>

        {/* Demo credentials info */}
        <View style={styles.demoInfo}>
          <Feather name="info" size={16} color={lightColors.info} />
          <View style={styles.demoTextContainer}>
            <Text style={styles.demoText}>Demo: username: emilys</Text>
            <Text style={styles.demoText}>password: emilyspass</Text>
          </View>
        </View>

        {/* Form */}
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
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          />
        </View>

        {/* Register Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={loading}
          >
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    minHeight: SCREEN_HEIGHT * 0.9,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: lightColors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    textAlign: "center",
  },
  demoInfo: {
    flexDirection: "row",
    backgroundColor: lightColors.info + "15",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: lightColors.info,
  },
  demoTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  demoText: {
    fontSize: fontSizes.sm,
    color: lightColors.text,
    fontWeight: "500" as "500",
  },
  form: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  footerText: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
  },
  footerLink: {
    fontSize: fontSizes.md,
    color: lightColors.primary,
    fontWeight: "600" as "600",
  },
});
