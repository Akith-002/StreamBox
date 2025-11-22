import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { logOut } from "../store/features/authSlice";
import { toggleTheme } from "../store/features/uiSlice";
import { useTheme } from "../hooks/useTheme";
import { RootState } from "../store/store";
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

  // Reusable Settings Row Component
  const SettingItem = ({
    icon,
    label,
    value,
    isSwitch = false,
    onPress,
    showChevron = true,
    color = colors.text,
  }: any) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${colors.card}` }]}
        >
          <Feather name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: color }]}>{label}</Text>
      </View>

      <View style={styles.settingRight}>
        {value && (
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}
        {isSwitch ? (
          <Switch
            value={theme === "dark"}
            onValueChange={handleThemeToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={"#FFF"}
            ios_backgroundColor={colors.border}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        ) : (
          showChevron && (
            <Feather name="chevron-right" size={16} color={colors.textLight} />
          )
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
      {title.toUpperCase()}
    </Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 1. Modern Gradient Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={[colors.primary, `${colors.primary}00`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerGradient}
          />

          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              {user?.image ? (
                <Image source={{ uri: user.image }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Feather name="user" size={40} color={colors.primary} />
                </View>
              )}
              <View
                style={[styles.editBadge, { backgroundColor: colors.accent }]}
              >
                <Feather name="edit-2" size={12} color="#FFF" />
              </View>
            </View>

            <Text style={[styles.name, { color: colors.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{user?.username}
            </Text>

            {/* Stats / Membership Chip */}
            <View
              style={[
                styles.chipContainer,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <Feather name="award" size={14} color={colors.primary} />
              <Text style={[styles.chipText, { color: colors.primary }]}>
                Premium Member
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Clean Grouped Lists */}
        <View style={styles.contentContainer}>
          <SectionHeader title="Personal Info" />
          <View style={[styles.sectionGroup, { backgroundColor: colors.card }]}>
            <SettingItem
              icon="mail"
              label="Email"
              value={user?.email}
              showChevron={false}
            />
            <SettingItem
              icon="user"
              label="Gender"
              value={
                user?.gender
                  ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                  : ""
              }
              showChevron={false}
            />
          </View>

          <SectionHeader title="App Settings" />
          <View style={[styles.sectionGroup, { backgroundColor: colors.card }]}>
            <SettingItem
              icon={theme === "dark" ? "moon" : "sun"}
              label="Dark Mode"
              isSwitch
            />
            <SettingItem icon="bell" label="Notifications" value="On" />
            <SettingItem icon="globe" label="Language" value="English" />
          </View>

          <SectionHeader title="Support" />
          <View style={[styles.sectionGroup, { backgroundColor: colors.card }]}>
            <SettingItem icon="help-circle" label="Help Center" />
            <SettingItem icon="shield" label="Privacy Policy" />
            <SettingItem icon="file-text" label="Terms of Service" />
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: colors.error }]}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={18} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Log Out
            </Text>
          </TouchableOpacity>

          <Text style={[styles.versionText, { color: colors.textLight }]}>
            Version 1.0.0 • Build 2025.11
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header Styles
  headerContainer: {
    alignItems: "center",
    paddingTop: 60, // Push down for status bar
    paddingBottom: spacing.xl,
    marginBottom: spacing.sm,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.15,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatarWrapper: {
    marginBottom: spacing.md,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.5)",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  username: {
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
  },
  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Content Styles
  contentContainer: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    letterSpacing: 1,
    marginLeft: 4,
  },
  sectionGroup: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: fontSizes.md,
    fontWeight: "500",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: fontSizes.sm,
  },

  // Footer
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    gap: 8,
  },
  logoutText: {
    fontWeight: "600",
    fontSize: fontSizes.md,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
