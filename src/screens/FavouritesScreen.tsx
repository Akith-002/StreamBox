import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  lightColors,
  spacing,
  fontSizes,
  borderRadius,
} from "../constants/theme";

export default function FavouritesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Favourites</Text>
          <Text style={styles.subtitle}>
            Your saved movies will appear here
          </Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <View style={styles.iconContainer}>
            <Feather name="heart" size={64} color={lightColors.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Favourites Yet</Text>
          <Text style={styles.emptyText}>
            Start adding movies to your favourites to see them here
          </Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Feather name="info" size={20} color={lightColors.info} />
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Coming in Phase 4</Text>
            <Text style={styles.infoBannerText}>
              Favourites functionality will be implemented with Redux state
              management and persistence.
            </Text>
          </View>
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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
  },
  emptyState: {
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
    minHeight: 300,
    justifyContent: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: lightColors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: lightColors.info + "15",
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: lightColors.info,
  },
  infoBannerContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: fontSizes.md,
    fontWeight: "600" as "600",
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  infoBannerText: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
    lineHeight: 20,
  },
});
