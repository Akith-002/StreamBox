import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Feather } from "@expo/vector-icons";
import { registerSchema } from "../utils/validationSchemas";
import Input from "../components/Input";
import Button from "../components/Button";
import { RegisterData } from "../types/Auth";
import { spacing, fontSizes } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { useRegisterMutation } from "../api/backendApi";

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { colors } = useTheme();
  const [register, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await register(data).unwrap();
      Alert.alert("Success", "Account created successfully.", [
        { text: "Login", onPress: () => navigation.navigate("Login") },
      ]);
    } catch {
      Alert.alert("Error", "Registration failed.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join StreamBox to start watching.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="John"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </View>
              <View style={styles.rowSpacer} />
              <View style={styles.rowItem}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
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
                  placeholder="@johndoe"
                  icon="at-sign"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="name@example.com"
                  icon="mail"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
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
                  placeholder="Create a password"
                  icon="lock"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? "Creating Account..." : "Sign Up"}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Log In
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
    paddingBottom: spacing.xl,
    paddingTop: 60,
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
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontWeight: "500",
  },
  form: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
  },
  rowItem: {
    flex: 1,
  },
  rowSpacer: {
    width: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
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
