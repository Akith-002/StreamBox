import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { logOut } from "../store/features/authSlice";
import { RootState } from "../store/store";
import Button from "../components/Button";
import {
  lightColors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../constants/theme";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={48} color={lightColors.primary} />
              </View>
            )}
          </View>

          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>

        {/* Profile Info Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Feather name="user" size={20} color={lightColors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Feather name="at-sign" size={20} color={lightColors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user?.username}</Text>
              </View>
            </View>

            {user?.email && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Feather
                      name="mail"
                      size={20}
                      color={lightColors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                  </View>
                </View>
              </>
            )}

            {user?.gender && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Feather
                      name="info"
                      size={20}
                      color={lightColors.primary}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{user.gender}</Text>
                  </View>
                </View>
              </>
            )}
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
    backgroundColor: lightColors.background,
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
    borderColor: lightColors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: lightColors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: lightColors.primary,
  },
  name: {
    fontSize: fontSizes.xl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  username: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSizes.sm,
    color: lightColors.textLight,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "600" as "600",
    color: lightColors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
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
    backgroundColor: lightColors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fontSizes.md,
    color: lightColors.text,
    fontWeight: "500" as "500",
  },
  divider: {
    height: 1,
    backgroundColor: lightColors.border,
    marginVertical: spacing.xs,
  },
});
