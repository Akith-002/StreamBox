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
import {
  lightColors,
  spacing,
  fontSizes,
  SCREEN_HEIGHT,
  borderRadius,
} from "../constants/theme";

export default function RegisterScreen({ navigation }: { navigation: any }) {
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

    // Simulate API call
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={lightColors.text} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Feather name="film" size={40} color={lightColors.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join StreamBox to discover amazing movies
          </Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Feather name="info" size={16} color={lightColors.warning} />
          <Text style={styles.infoText}>
            This is a demo. Registration data won't be saved.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
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

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          />
        </View>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.footerLink}>Sign In</Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    minHeight: SCREEN_HEIGHT * 0.9,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: spacing.sm,
    zIndex: 1,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: lightColors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
    textAlign: "center",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.warning + "15",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: lightColors.warning,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: lightColors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  form: {
    width: "100%",
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
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
