import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../api/backendApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - spacing.lg * 3) / 2;

export default function FavouritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data: favorites, isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // Ensure we have a valid array
  const favouritesList = Array.isArray(favorites) ? favorites : [];

  // Animation ref for the list
  const scrollY = new Animated.Value(0);

  const handleItemPress = (item: any) => {
    const mediaType = item.mediaType || "movie";
    if (mediaType === "tv") {
      navigation.navigate("HomeTab", {
        screen: "TVDetails",
        params: { tvId: item.tmdbId },
      });
    } else {
      navigation.navigate("HomeTab", {
        screen: "Details",
        params: { movieId: item.tmdbId },
      });
    }
  };

  const handleRemove = async (item: any) => {
    const tmdbId = item.tmdbId;
    const mediaType = item.mediaType || "movie";

    setDeletingIds((prev) => new Set(prev).add(tmdbId));

    // Small delay for visual feedback before removal
    setTimeout(async () => {
      try {
        await removeFavorite({ tmdbId, mediaType }).unwrap();
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(tmdbId);
          return next;
        });
      }
    }, 300);
  };

  const renderFavouriteCard = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const posterUri = item.posterPath
      ? `${TMDB_IMAGE_BASE_URL}${item.posterPath}`
      : undefined;

    const isDeleting = deletingIds.has(item.tmdbId);

    const title = item.title || "";
    const year = item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A";
    const rating = item.voteAverage ? item.voteAverage.toFixed(1) : "N/A";

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: isDeleting ? 0 : 1,
            transform: [{ scale: isDeleting ? 0.8 : 1 }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleItemPress(item)}
          style={styles.cardContainer}
        >
          {/* Image Container */}
          <View
            style={[styles.posterContainer, { backgroundColor: colors.card }]}
          >
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={styles.posterImage} />
            ) : (
              <View style={styles.placeholderPoster}>
                <Feather name="image" size={24} color={colors.textLight} />
              </View>
            )}

            {/* Gradient Overlay for Text Readability */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradientOverlay}
            />

            {/* Top Right: Glassmorphism Remove Button */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item)}
              activeOpacity={0.6}
            >
              <View style={styles.glassCircle}>
                <Feather name="x" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Top Left: Media Type Tag */}
            <View style={styles.mediaTag}>
              <Text style={styles.mediaTagText}>
                {(item.mediaType || "movie").toUpperCase() === "TV"
                  ? "TV SHOW"
                  : "MOVIE"}
              </Text>
            </View>
          </View>

          {/* Minimal Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.ratingContainer}>
                <Feather name="star" size={12} color={colors.primary} />
                <Text
                  style={[styles.metaText, { color: colors.textSecondary }]}
                >
                  {rating}
                </Text>
              </View>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                •
              </Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {year}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My List
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {favouritesList.length}{" "}
          {favouritesList.length === 1 ? "Title" : "Titles"} Saved
        </Text>
      </View>
      {/* Optional: Add a Filter icon here if needed later */}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.card }]}>
        <Feather name="heart" size={40} color={colors.textLight} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Your list is empty
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Content you add to your favorites will appear here.
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("HomeTab")}
      >
        <Text style={styles.browseButtonText}>Explore Content</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favouritesList}
        keyExtractor={(item) => item.tmdbId.toString()}
        renderItem={renderFavouriteCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  headerContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    fontWeight: "500",
    marginTop: 4,
  },

  // Card Styles
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  cardWrapper: {
    width: cardWidth,
  },
  cardContainer: {
    gap: 8,
  },
  posterContainer: {
    width: "100%",
    height: cardWidth * 1.45,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    position: "relative",
    ...shadows.small,
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderPoster: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },

  // Floating UI Elements on Poster
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  glassCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    // REMOVED: backdropFilter (not supported in React Native styles)
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mediaTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mediaTagText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Info Styles
  infoContainer: {
    paddingHorizontal: 4,
  },
  titleRow: {
    marginBottom: 2,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  browseButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    // FIXED: changed .full to .round (or just use a number like 30)
    borderRadius: borderRadius.round,
    ...shadows.medium,
  },
  browseButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: fontSizes.md,
  },
});
