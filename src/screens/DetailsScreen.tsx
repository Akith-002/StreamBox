import React, { useState } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useGetMovieDetailsQuery } from "../api/tmdbApi";
import {
  addFavourite,
  removeFavourite,
} from "../store/features/favouritesSlice";
import { useTheme } from "../hooks/useTheme";
import {
  spacing,
  fontSizes,
  borderRadius,
  shadows,
  lightColors,
} from "../constants/theme";
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

  const favouriteMovies = useSelector(
    (state: RootState) => state.favourites.favouriteMovies
  );
  const isFavourite = movie
    ? favouriteMovies.some((m) => m.id === movie.id)
    : false;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFavouritePress = async () => {
    if (!movie) return;

    setIsFavouriteAnimating(true);
    setTimeout(() => setIsFavouriteAnimating(false), 600);

    if (isFavourite) {
      dispatch(removeFavourite(movie.id));
      Alert.alert("Removed", `${movie.title} removed from favourites`, [
        { text: "OK" },
      ]);
    } else {
      dispatch(addFavourite(movie));
      Alert.alert("Added", `${movie.title} added to favourites`, [
        { text: "OK" },
      ]);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading movie details…
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Back Button */}
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
        <TouchableOpacity
          onPress={handleFavouritePress}
          style={[
            styles.favouriteButton,
            isFavouriteAnimating && styles.favouriteButtonAnimating,
          ]}
        >
          <Feather
            name={isFavourite ? "heart" : "heart"}
            size={24}
            color={isFavourite ? colors.error : colors.primary}
            fill={isFavourite ? colors.error : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* Backdrop Image */}
      {backdropImageUrl && (
        <Image
          source={{ uri: backdropImageUrl }}
          style={[styles.backdropImage, { backgroundColor: colors.card }]}
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
              style={[
                styles.posterImage,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              resizeMode="cover"
            />
          )}
          <View style={styles.keyInfo}>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color={colors.warning} />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {movie.vote_average?.toFixed(1) || "N/A"}
              </Text>
              <Text
                style={[styles.ratingCount, { color: colors.textSecondary }]}
              >
                ({movie.vote_count?.toLocaleString() || 0})
              </Text>
            </View>
            <View style={styles.yearContainer}>
              <Feather name="calendar" size={16} color={colors.info} />
              <Text style={[styles.yearText, { color: colors.textSecondary }]}>
                {releaseYear}
              </Text>
            </View>
          </View>
        </View>

        {/* Title and Tagline */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            {movie.title}
          </Text>
          {movie.tagline && (
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              "{movie.tagline}"
            </Text>
          )}
        </View>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.genresSection}>
            <View style={styles.genresList}>
              {movie.genres.map((genre: any) => (
                <View
                  key={genre.id}
                  style={[styles.genreTag, { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.genreText, { color: colors.card }]}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Runtime and Budget Info */}
        <View style={styles.statsRow}>
          {movie.runtime && (
            <View
              style={[
                styles.statBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="clock" size={18} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Runtime
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {movie.runtime} min
              </Text>
            </View>
          )}
          {movie.budget && movie.budget > 0 && (
            <View
              style={[
                styles.statBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="dollar-sign" size={18} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Budget
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ${(movie.budget / 1000000).toFixed(0)}M
              </Text>
            </View>
          )}
          {movie.revenue && movie.revenue > 0 && (
            <View
              style={[
                styles.statBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="trending-up" size={18} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Revenue
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ${(movie.revenue / 1000000).toFixed(0)}M
              </Text>
            </View>
          )}
        </View>

        {/* Overview */}
        {movie.overview && (
          <View style={styles.overviewSection}>
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

        {/* Production Details */}
        {movie.production_companies &&
          movie.production_companies.length > 0 && (
            <View style={styles.productionSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Production
              </Text>
              <View style={styles.companyList}>
                {movie.production_companies.slice(0, 3).map((company: any) => (
                  <View key={company.id} style={styles.companyItem}>
                    <Feather
                      name="briefcase"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.companyName,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {company.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Popularity */}
        <View style={styles.popularitySection}>
          <View
            style={[
              styles.popularityBar,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.popularityFill,
                {
                  width: `${(movie.popularity / 1000) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text
            style={[styles.popularityText, { color: colors.textSecondary }]}
          >
            Popularity: {movie.popularity?.toFixed(1) || "N/A"}
          </Text>
        </View>

        {/* Favourite Button (Primary CTA) */}
        <TouchableOpacity
          onPress={handleFavouritePress}
          style={[
            styles.favouriteCTA,
            {
              backgroundColor: isFavourite ? colors.error : colors.primary,
            },
          ]}
        >
          <Feather
            name="heart"
            size={20}
            color={colors.card}
            fill={isFavourite ? colors.card : "none"}
          />
          <Text style={[styles.favouriteCTAText, { color: colors.card }]}>
            {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
          </Text>
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
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontWeight: "600",
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
  favouriteButtonAnimating: {
    transform: [{ scale: 1.2 }],
  },
  backdropImage: {
    width: screenWidth,
    height: 200,
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
    marginRight: spacing.md,
    ...shadows.medium,
    borderWidth: 1,
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
    marginLeft: spacing.xs,
  },
  ratingCount: {
    fontSize: fontSizes.sm,
    marginLeft: spacing.xs,
  },
  yearContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  yearText: {
    fontSize: fontSizes.md,
    marginLeft: spacing.xs,
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
  genresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  genreTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  genreText: {
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
  overviewSection: {
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
    marginLeft: spacing.md,
  },
  popularitySection: {
    marginBottom: spacing.lg,
  },
  popularityBar: {
    height: 8,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  popularityFill: {
    height: "100%",
    borderRadius: borderRadius.md,
  },
  popularityText: {
    fontSize: fontSizes.sm,
  },
  favouriteCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  favouriteCTAText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
