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
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";

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
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={styles.avatarContainer}>
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={[styles.avatar, { borderColor: colors.primary }]}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {
                  backgroundColor: `${colors.primary}20`,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Feather name="user" size={56} color={colors.primary} />
            </View>
          )}
          <View
            style={[styles.statusBadge, { backgroundColor: colors.success }]}
          >
            <Feather name="check" size={12} color="#FFF" />
          </View>
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

      <View style={styles.content}>
        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Information
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Full Name */}
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.primary}20` },
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

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            {/* Username */}
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.primary}20` },
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

            {/* Email */}
            {user?.email && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.infoIconContainer,
                      { backgroundColor: `${colors.primary}20` },
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

            {/* Gender */}
            {user?.gender && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.infoIconContainer,
                      { backgroundColor: `${colors.primary}20` },
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
                      {user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.themeRow}>
              <View style={styles.themeContent}>
                <View
                  style={[
                    styles.themeIconContainer,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Feather
                    name={theme === "dark" ? "moon" : "sun"}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.themeTextContent}>
                  <Text
                    style={[styles.infoLabel, { color: colors.textSecondary }]}
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

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity style={styles.settingRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Feather name="help-circle" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Help & Support
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity style={styles.settingRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Feather name="shield" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Privacy Policy
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity style={styles.settingRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Feather name="file-text" size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Terms of Service
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button title="Sign Out" onPress={handleLogout} variant="outline" />
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.textLight }]}>
            StreamBox v1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: "center",
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.medium,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "inherit",
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
  content: {
    padding: spacing.lg,
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
    overflow: "hidden",
    ...shadows.small,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
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
    marginHorizontal: spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  themeContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  themeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  themeTextContent: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  versionText: {
    fontSize: fontSizes.xs,
  },
});
