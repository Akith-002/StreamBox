import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useGetMovieDetailsQuery } from "../api/tmdbApi";
import {
  addFavourite,
  removeFavourite,
  selectFavouriteMovies,
} from "../store/features/favouritesSlice";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import { RootState } from "../store/store";

const screenWidth = Dimensions.get("window").width;

export default function DetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { movieId } = route.params;
  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);

  const [isFavouriteAnimating, setIsFavouriteAnimating] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const favouriteMovies = useSelector(selectFavouriteMovies);
  const isFavourite = movie
    ? favouriteMovies.some((m) => m.id === movie.id)
    : false;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFavouritePress = async () => {
    if (!movie) return;

    setIsFavouriteAnimating(true);

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsFavouriteAnimating(false));

    if (isFavourite) {
      dispatch(removeFavourite(movie.id));
      Alert.alert("Removed", `${movie.title} removed from favorites`);
    } else {
      dispatch(addFavourite(movie));
      Alert.alert("Added", `${movie.title} added to favorites`);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading details…
        </Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          Unable to load movie details
        </Text>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[styles.backButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.backButtonText, { color: colors.card }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const posterImageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const backdropImageUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const genreString = movie.genres
    ? movie.genres.map((g: any) => g.name).join(" • ")
    : "N/A";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backIconButton}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        <Animated.View
          style={[
            styles.favouriteButton,
            { transform: [{ scale: heartScale }] },
          ]}
        >
          <TouchableOpacity onPress={handleFavouritePress}>
            <Feather
              name="heart"
              size={24}
              color={isFavourite ? colors.error : colors.primary}
              fill={isFavourite ? colors.error : "none"}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Backdrop Image */}
      {backdropImageUrl && (
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: backdropImageUrl }}
            style={[styles.backdropImage, { backgroundColor: colors.card }]}
            resizeMode="cover"
          />
          <View
            style={[
              styles.backdropOverlay,
              { backgroundColor: `rgba(15, 23, 42, 0.3)` },
            ]}
          />
        </View>
      )}

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Poster & Key Info */}
        <View style={styles.posterSection}>
          {posterImageUrl && (
            <Image
              source={{ uri: posterImageUrl }}
              style={[
                styles.posterImage,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              resizeMode="cover"
            />
          )}
          <View style={styles.keyInfo}>
            {/* Rating */}
            <LinearGradient
              colors={[`${colors.primary}20`, `${colors.accent}20`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ratingContainer,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="star" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </Text>
                <Text
                  style={[styles.ratingCount, { color: colors.textSecondary }]}
                >
                  ({movie.vote_count?.toLocaleString() || 0})
                </Text>
              </View>
            </LinearGradient>

            {/* Year */}
            <View
              style={[
                styles.metaBox,
                {
                  backgroundColor: `${colors.primary}10`,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="calendar" size={16} color={colors.info} />
              <Text style={[styles.metaText, { color: colors.text }]}>
                {releaseYear}
              </Text>
            </View>

            {/* Runtime */}
            {movie.runtime && (
              <View
                style={[
                  styles.metaBox,
                  {
                    backgroundColor: `${colors.primary}10`,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="clock" size={16} color={colors.info} />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {movie.runtime} min
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Title & Tagline */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            {movie.title}
          </Text>
          {movie.tagline && (
            <Text style={[styles.tagline, { color: colors.textLight }]}>
              "{movie.tagline}"
            </Text>
          )}
        </View>

        {/* Genres */}
        {genreString !== "N/A" && (
          <View style={styles.genresSection}>
            <Text style={[styles.genreText, { color: colors.text }]}>
              {genreString}
            </Text>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {movie.budget && movie.budget > 0 && (
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="dollar-sign" size={20} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Budget
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ${(movie.budget / 1000000).toFixed(1)}M
              </Text>
            </View>
          )}

          {movie.revenue && movie.revenue > 0 && (
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="trending-up" size={20} color={colors.success} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Revenue
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ${(movie.revenue / 1000000).toFixed(1)}M
              </Text>
            </View>
          )}

          <View
            style={[
              styles.statBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="zap" size={20} color={colors.warning} />
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Popularity
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {movie.popularity?.toFixed(0) || "N/A"}
            </Text>
          </View>
        </View>

        {/* Overview */}
        {movie.overview && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Synopsis
            </Text>
            <Text
              style={[styles.overviewText, { color: colors.textSecondary }]}
            >
              {movie.overview}
            </Text>
          </View>
        )}

        {/* Production Companies */}
        {movie.production_companies &&
          movie.production_companies.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Production
              </Text>
              <View style={styles.companyList}>
                {movie.production_companies.slice(0, 3).map((company: any) => (
                  <View
                    key={company.id}
                    style={[
                      styles.companyItem,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Feather
                      name="briefcase"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={[styles.companyName, { color: colors.text }]}>
                      {company.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Add to Favorites CTA */}
        <TouchableOpacity onPress={handleFavouritePress} activeOpacity={0.85}>
          <LinearGradient
            colors={
              isFavourite
                ? [colors.error, "#DC2626"]
                : [colors.primary, colors.accent]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.favouriteCTA}
          >
            <Feather
              name="heart"
              size={20}
              color="#FFFFFF"
              fill={isFavourite ? "#FFFFFF" : "none"}
            />
            <Text style={styles.favouriteCTAText}>
              {isFavourite ? "Remove from Favorites" : "Add to Favorites"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  backButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backIconButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: "600",
    marginHorizontal: spacing.sm,
  },
  favouriteButton: {
    padding: spacing.sm,
  },
  backdropContainer: {
    position: "relative",
    width: screenWidth,
    height: 220,
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  posterSection: {
    flexDirection: "row",
    marginBottom: spacing.xl,
  },
  posterImage: {
    width: 110,
    height: 165,
    borderRadius: borderRadius.lg,
    marginRight: spacing.lg,
    ...shadows.medium,
    borderWidth: 1,
  },
  keyInfo: {
    flex: 1,
    justifyContent: "flex-start",
    gap: spacing.md,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  ratingText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
  },
  ratingCount: {
    fontSize: fontSizes.xs,
  },
  metaBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  metaText: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSizes.sm,
    fontStyle: "italic",
  },
  genresSection: {
    marginBottom: spacing.lg,
  },
  genreText: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    gap: spacing.md,
    flexWrap: "wrap",
  },
  statBox: {
    flex: 1,
    minWidth: "30%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.small,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  statValue: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  overviewText: {
    fontSize: fontSizes.md,
    lineHeight: 22,
    textAlign: "justify",
  },
  companyList: {
    gap: spacing.md,
  },
  companyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  companyName: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
  favouriteCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
    gap: spacing.sm,
  },
  favouriteCTAText: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
