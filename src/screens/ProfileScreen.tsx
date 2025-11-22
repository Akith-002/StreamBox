import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { logOut } from "../store/features/authSlice";
import { toggleTheme } from "../store/features/uiSlice";
import { useTheme } from "../hooks/useTheme";
import { RootState } from "../store/store";
import Button from "../components/Button";
import {
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../constants/theme";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { colors, theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logOut());
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Feather
                  name="user"
                  size={48}
                  color={colors.primary}
                />
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{user?.username}
          </Text>
          {user?.email && (
            <Text style={[styles.email, { color: colors.textLight }]}>
              {user.email}
            </Text>
          )}
        </View>

        {/* Profile Info Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Information
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Feather name="user" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Full Name
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Feather name="at-sign" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Username
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.username}
                </Text>
              </View>
            </View>

            {user?.email && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.infoIconContainer,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <Feather name="mail" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Email
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {user.email}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {user?.gender && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.infoIconContainer,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <Feather name="info" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Gender
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {user.gender}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.themeRow}>
              <View style={styles.themeContent}>
                <Feather
                  name={theme === "dark" ? "moon" : "sun"}
                  size={20}
                  color={colors.primary}
                  style={styles.themeIcon}
                />
                <View style={styles.themeTextContent}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Dark Mode
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {theme === "dark" ? "Enabled" : "Disabled"}
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={handleThemeToggle}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor={colors.card}
              />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button title="Log Out" onPress={handleLogout} variant="outline" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  name: {
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  username: {
    fontSize: fontSizes.md,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSizes.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  themeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  themeIcon: {
    marginRight: spacing.md,
  },
  themeTextContent: {
    flex: 1,
  },
});
