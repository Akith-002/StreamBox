import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  lightColors,
  spacing,
  fontSizes,
  borderRadius,
} from "../constants/theme";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trending Movies</Text>
          <Text style={styles.subtitle}>
            Discover the latest and most popular movies
          </Text>
        </View>

        {/* Placeholder Card */}
        <View style={styles.placeholderCard}>
          <View style={styles.iconContainer}>
            <Feather name="film" size={64} color={lightColors.primary} />
          </View>
          <Text style={styles.placeholderTitle}>Coming Soon</Text>
          <Text style={styles.placeholderText}>
            Movie list will be implemented in Phase 3
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Feather
                name="check-circle"
                size={18}
                color={lightColors.success}
              />
              <Text style={styles.featureText}>TMDB API Integration</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather
                name="check-circle"
                size={18}
                color={lightColors.success}
              />
              <Text style={styles.featureText}>Movie Cards with Images</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather
                name="check-circle"
                size={18}
                color={lightColors.success}
              />
              <Text style={styles.featureText}>Details Navigation</Text>
            </View>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Feather name="info" size={20} color={lightColors.info} />
          <View style={styles.infoBannerContent}>
            <Text style={styles.infoBannerTitle}>Phase 2 Complete</Text>
            <Text style={styles.infoBannerText}>
              Authentication and navigation are fully implemented. Next: API
              Integration.
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
  placeholderCard: {
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: lightColors.border,
    borderStyle: "dashed",
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
  placeholderTitle: {
    fontSize: fontSizes.xl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  featureList: {
    width: "100%",
    alignItems: "flex-start",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: fontSizes.sm,
    color: lightColors.text,
    marginLeft: spacing.sm,
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
