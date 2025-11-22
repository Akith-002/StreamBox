import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useGetMovieDetailsQuery } from "../api/tmdbApi";
import {
  lightColors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const screenWidth = Dimensions.get("window").width;

export default function DetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { movieId } = route.params;
  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFavouritePress = () => {
    // Prepared for Phase 4: Favourites functionality
    console.log("Favourite button pressed for movie:", movieId);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={lightColors.primary} />
        <Text style={styles.loadingText}>Loading movie details…</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centered}>
        <Feather name="alert-triangle" size={48} color={lightColors.error} />
        <Text style={styles.errorText}>Unable to load movie details</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backIconButton}>
          <Feather name="arrow-left" size={24} color={lightColors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {movie.title}
        </Text>
        <TouchableOpacity
          onPress={handleFavouritePress}
          style={styles.favouriteButton}
        >
          <Feather name="heart" size={24} color={lightColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Backdrop Image */}
      {backdropImageUrl && (
        <Image
          source={{ uri: backdropImageUrl }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
      )}

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Poster Image and Key Info */}
        <View style={styles.posterSection}>
          {posterImageUrl && (
            <Image
              source={{ uri: posterImageUrl }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.keyInfo}>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color={lightColors.warning} />
              <Text style={styles.ratingText}>
                {movie.vote_average?.toFixed(1) || "N/A"}
              </Text>
              <Text style={styles.ratingCount}>
                ({movie.vote_count?.toLocaleString() || 0})
              </Text>
            </View>
            <View style={styles.yearContainer}>
              <Feather name="calendar" size={16} color={lightColors.info} />
              <Text style={styles.yearText}>{releaseYear}</Text>
            </View>
          </View>
        </View>

        {/* Title and Tagline */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{movie.title}</Text>
          {movie.tagline && (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          )}
        </View>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genresSection}>
            <View style={styles.genresList}>
              {movie.genres.map((genre: any) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Runtime and Budget Info */}
        <View style={styles.statsRow}>
          {movie.runtime && (
            <View style={styles.statBox}>
              <Feather name="clock" size={18} color={lightColors.primary} />
              <Text style={styles.statLabel}>Runtime</Text>
              <Text style={styles.statValue}>{movie.runtime} min</Text>
            </View>
          )}
          {movie.budget && movie.budget > 0 && (
            <View style={styles.statBox}>
              <Feather
                name="dollar-sign"
                size={18}
                color={lightColors.primary}
              />
              <Text style={styles.statLabel}>Budget</Text>
              <Text style={styles.statValue}>
                ${(movie.budget / 1000000).toFixed(0)}M
              </Text>
            </View>
          )}
          {movie.revenue && movie.revenue > 0 && (
            <View style={styles.statBox}>
              <Feather
                name="trending-up"
                size={18}
                color={lightColors.primary}
              />
              <Text style={styles.statLabel}>Revenue</Text>
              <Text style={styles.statValue}>
                ${(movie.revenue / 1000000).toFixed(0)}M
              </Text>
            </View>
          )}
        </View>

        {/* Overview */}
        {movie.overview && (
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.overviewText}>{movie.overview}</Text>
          </View>
        )}

        {/* Production Details */}
        {movie.production_companies &&
          movie.production_companies.length > 0 && (
            <View style={styles.productionSection}>
              <Text style={styles.sectionTitle}>Production</Text>
              <View style={styles.companyList}>
                {movie.production_companies.slice(0, 3).map((company: any) => (
                  <View key={company.id} style={styles.companyItem}>
                    <Feather
                      name="briefcase"
                      size={16}
                      color={lightColors.textSecondary}
                    />
                    <Text style={styles.companyName}>{company.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Popularity */}
        <View style={styles.popularitySection}>
          <View style={styles.popularityBar}>
            <View
              style={[
                styles.popularityFill,
                { width: `${(movie.popularity / 1000) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.popularityText}>
            Popularity: {movie.popularity?.toFixed(1) || "N/A"}
          </Text>
        </View>

        {/* Favourite Button (Primary CTA) */}
        <TouchableOpacity
          onPress={handleFavouritePress}
          style={styles.favouriteCTA}
        >
          <Feather name="heart" size={20} color={lightColors.card} />
          <Text style={styles.favouriteCTAText}>Add to Favourites</Text>
        </TouchableOpacity>

        {/* Additional Space */}
        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
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
    color: lightColors.textSecondary,
  },
  errorText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: lightColors.error,
    textAlign: "center",
  },
  backButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: lightColors.primary,
  },
  backButtonText: {
    color: lightColors.card,
    fontWeight: "600",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: lightColors.background,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
    zIndex: 10,
  },
  backIconButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: "600",
    color: lightColors.text,
    marginHorizontal: spacing.sm,
  },
  favouriteButton: {
    padding: spacing.sm,
  },
  backdropImage: {
    width: screenWidth,
    height: 200,
    backgroundColor: lightColors.card,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  posterSection: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  posterImage: {
    width: 100,
    height: 150,
    borderRadius: borderRadius.md,
    backgroundColor: lightColors.card,
    marginRight: spacing.md,
    ...shadows.medium,
  },
  keyInfo: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: spacing.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  ratingText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: lightColors.text,
    marginLeft: spacing.xs,
  },
  ratingCount: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
    marginLeft: spacing.xs,
  },
  yearContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  yearText: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    marginLeft: spacing.xs,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    color: lightColors.text,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
    fontStyle: "italic",
  },
  genresSection: {
    marginBottom: spacing.lg,
  },
  genresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  genreTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: lightColors.primary,
    borderRadius: borderRadius.round,
  },
  genreText: {
    color: lightColors.card,
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.small,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: lightColors.textSecondary,
    marginTop: spacing.xs,
  },
  statValue: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: lightColors.text,
    marginTop: spacing.xs,
  },
  overviewSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: lightColors.text,
    marginBottom: spacing.md,
  },
  overviewText: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    lineHeight: 22,
    textAlign: "justify",
  },
  productionSection: {
    marginBottom: spacing.lg,
  },
  companyList: {
    gap: spacing.sm,
  },
  companyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  companyName: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
    marginLeft: spacing.md,
  },
  popularitySection: {
    marginBottom: spacing.lg,
  },
  popularityBar: {
    height: 8,
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  popularityFill: {
    height: "100%",
    backgroundColor: lightColors.primary,
    borderRadius: borderRadius.md,
  },
  popularityText: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
  },
  favouriteCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    backgroundColor: lightColors.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  favouriteCTAText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: lightColors.card,
    marginLeft: spacing.sm,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
