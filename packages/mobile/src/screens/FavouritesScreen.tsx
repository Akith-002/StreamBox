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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  removeFavourite,
  removeFavouriteTV,
  selectAllFavourites,
} from "../store/features/favouritesSlice";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import { RootState } from "../store/store";
import { isMovie, isTVShow } from "../types/Movie";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - spacing.lg * 3) / 2;

export default function FavouritesScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const allFavourites = useSelector(selectAllFavourites);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log("Favourites updated:", allFavourites.length, allFavourites);
  }, [allFavourites]);

  const handleItemPress = (item: any) => {
    if (item.mediaType === "movie") {
      navigation.navigate(
        "HomeTab" as never,
        {
          screen: "Details",
          params: { movieId: item.id },
        } as never
      );
    } else if (item.mediaType === "tv") {
      navigation.navigate(
        "HomeTab" as never,
        {
          screen: "TVDetails",
          params: { tvId: item.id },
        } as never
      );
    }
  };

  const handleRemove = (id: number, mediaType: "movie" | "tv") => {
    const key = `${mediaType}-${id}`;
    setDeletingIds((prev) => new Set(prev).add(key));
    setTimeout(() => {
      if (mediaType === "movie") {
        dispatch(removeFavourite(id));
      } else {
        dispatch(removeFavouriteTV(id));
      }
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 300);
  };

  const renderFavouriteCard = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const data = item.data;
    const posterUri = data.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
      : undefined;

    const key = `${item.mediaType}-${item.id}`;
    const isDeleting = deletingIds.has(key);

    const title = isMovie(data) ? data.title : isTVShow(data) ? data.name : "";
    const date = isMovie(data)
      ? data.release_date
      : isTVShow(data)
      ? data.first_air_date
      : "";
    const year = date ? date.slice(0, 4) : "";
    const icon = item.mediaType === "movie" ? "film" : "tv";

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: isDeleting ? 0 : 1,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.movieCard}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          {/* Poster Container with Glassmorphism */}
          <View style={styles.posterContainer}>
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={styles.posterImage} />
            ) : (
              <LinearGradient
                colors={[`${colors.primary}30`, `${colors.accent}30`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.posterImage}
              >
                <Feather
                  name={icon as any}
                  size={40}
                  color={colors.textLight}
                />
              </LinearGradient>
            )}

            {/* Media Type Badge */}
            <View style={styles.mediaTypeBadge}>
              <Feather name={icon as any} size={12} color="#FFFFFF" />
            </View>

            {/* Delete Button with Glassmorphism */}
            <TouchableOpacity
              onPress={() => handleRemove(item.id, item.mediaType)}
              style={styles.deleteButtonContainer}
            >
              <View
                style={[
                  styles.deleteButton,
                  { backgroundColor: `${colors.error}E6` },
                ]}
              >
                <Feather name="trash-2" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Section with Glassmorphism */}
          <View style={styles.infoSection}>
            <Text
              style={[styles.movieTitle, { color: colors.text }]}
              numberOfLines={2}
            >
              {title}
            </Text>

            {/* Rating Badge with Gradient */}
            <View style={styles.ratingContainer}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ratingBadge}
              >
                <Feather name="star" size={10} color="#FFF" />
                <Text style={styles.ratingText}>
                  {data.vote_average?.toFixed(1) || "N/A"}
                </Text>
              </LinearGradient>
              {year && (
                <Text
                  style={[styles.yearText, { color: colors.textSecondary }]}
                >
                  {year}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const emptyComponent = (
    <View style={styles.emptyStateContainer}>
      <View
        style={[
          styles.emptyState,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Animated Icon Container with Gradient */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.accent}30`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Feather name="heart" size={64} color={colors.primary} />
          </LinearGradient>
        </View>

        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Favorites Yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Start adding movies and TV shows to your favorites to see them here
        </Text>

        {/* Gradient Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeTab" as never)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.browseButton}
          >
            <Feather name="search" size={18} color="#FFFFFF" />
            <Text style={styles.browseButtonText}>Browse Content</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Gradient */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            My Favorites
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {allFavourites.length} saved{" "}
            {allFavourites.length === 1 ? "item" : "items"}
          </Text>
        </View>
        {allFavourites.length > 0 && (
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{allFavourites.length}</Text>
          </LinearGradient>
        )}
      </View>

      {/* Grid List */}
      <FlatList
        data={allFavourites}
        keyExtractor={(item) => `${item.mediaType}-${item.id}`}
        renderItem={renderFavouriteCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={emptyComponent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.medium,
  },
  badgeText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  cardWrapper: {
    width: cardWidth,
    marginBottom: spacing.md,
  },
  movieCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    height: cardWidth * 1.5,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.large,
  },
  posterImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  glassOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: borderRadius.round,
    padding: spacing.lg,
  },
  mediaTypeBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    zIndex: 10,
  },
  deleteButtonContainer: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.medium,
  },
  infoSection: {
    paddingTop: spacing.sm,
  },
  movieTitle: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  yearText: {
    fontSize: fontSizes.xs,
    fontWeight: "500",
  },
  emptyStateContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  emptyState: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    minHeight: 450,
    justifyContent: "center",
    ...shadows.medium,
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.large,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSizes.md,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    ...shadows.large,
  },
  browseButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
