import React, { useState, useRef } from "react";
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
  StatusBar,
  ImageBackground,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  useGetMovieDetailsQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../api/backendApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const { width, height } = Dimensions.get("window");

export default function DetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { movieId } = route.params;

  // Data Fetching
  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);
  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  // Animation State
  const [_isFavouriteAnimating, setIsFavouriteAnimating] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const isFavourite =
    movie && favorites
      ? favorites.some(
          (f) =>
            f.tmdbId === movie.id && (f.mediaType === "movie" || !f.mediaType)
        )
      : false;

  const handleFavouritePress = async () => {
    if (!movie) return;
    setIsFavouriteAnimating(true);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setIsFavouriteAnimating(false));

    try {
      if (isFavourite) {
        await removeFavorite({ tmdbId: movie.id, mediaType: "movie" }).unwrap();
      } else {
        await addFavorite({
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          mediaType: "movie",
          voteAverage: movie.vote_average,
          releaseDate: movie.release_date,
        }).unwrap();
      }
    } catch {
      Alert.alert("Error", "Failed to update favorites.");
    }
  };

  const formatCurrency = (value: number) => {
    if (!value) return "N/A";
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="alert-triangle" size={40} color={colors.error} />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          Movie not found
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- DERIVED DATA ---
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
  const genres = movie.genres
    ? movie.genres
        .slice(0, 3)
        .map((g: any) => g.name)
        .join(" • ")
    : "";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. FLOATING HEADER */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.glassButton}
        >
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFavouritePress}
          style={styles.glassButton}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Feather
              name="heart"
              size={24}
              color={isFavourite ? colors.error : "#FFF"}
              fill={isFavourite ? colors.error : "none"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Added extra padding at bottom
      >
        {/* 2. HERO IMAGE */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: backdropUrl || posterUrl || "" }}
            style={styles.heroImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", colors.background]}
              style={styles.heroGradient}
              locations={[0.4, 1]}
            />
          </ImageBackground>
        </View>

        {/* 3. CONTENT SECTION */}
        <View style={styles.contentContainer}>
          {/* Title & Tagline */}
          <Text style={[styles.title, { color: colors.text }]}>
            {movie.title}
          </Text>
          {movie.tagline ? (
            <Text style={[styles.tagline, { color: colors.textLight }]}>
              “{movie.tagline}”
            </Text>
          ) : null}

          {/* Meta Info Row */}
          <View style={styles.metaRow}>
            {year ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{year}</Text>
              </View>
            ) : null}
            {runtime ? (
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {runtime}
              </Text>
            ) : null}
            <View style={styles.ratingBadge}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {movie.vote_average?.toFixed(1)}
              </Text>
            </View>
          </View>

          {genres ? (
            <Text style={[styles.genreText, { color: colors.textSecondary }]}>
              {genres}
            </Text>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: colors.primary }]}
            >
              <Feather
                name="play"
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.playButtonText}>Watch Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.trailerButton, { borderColor: colors.border }]}
            >
              <Feather name="video" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Overview */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Storyline
          </Text>
          <Text style={[styles.overview, { color: colors.textSecondary }]}>
            {movie.overview}
          </Text>

          {/* Key Stats (Restored) */}
          <View style={styles.statsContainer}>
            <View
              style={[
                styles.statBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Budget
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatCurrency(movie.budget)}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Revenue
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatCurrency(movie.revenue)}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Popularity
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {movie.popularity?.toFixed(0)}
              </Text>
            </View>
          </View>

          {/* Production Companies (Restored) */}
          {movie.production_companies?.length > 0 && (
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginTop: 24 },
                ]}
              >
                Production
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.castList}
              >
                {movie.production_companies.map((comp: any) => (
                  <View
                    key={comp.id}
                    style={[styles.castCard, { backgroundColor: colors.card }]}
                  >
                    {comp.logo_path ? (
                      <Image
                        source={{
                          uri: `${TMDB_IMAGE_BASE_URL}${comp.logo_path}`,
                        }}
                        style={styles.castImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.castPlaceholder}>
                        <Feather
                          name="briefcase"
                          size={20}
                          color={colors.textSecondary}
                        />
                      </View>
                    )}
                    <Text
                      style={[styles.castName, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {comp.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Floating Header
  floatingHeader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  // Hero Image
  heroContainer: {
    height: height * 0.55,
    width: width,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },

  // Content
  contentContainer: {
    marginTop: -40,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: 12,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
  },
  genreText: {
    fontSize: 14,
    marginBottom: spacing.xl,
  },

  // Buttons
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.xl,
  },
  playButton: {
    flex: 1,
    height: 50,
    borderRadius: borderRadius.xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.medium,
  },
  playButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  trailerButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  overview: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: spacing.xl,
  },

  // Stats Grid
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Production List
  castList: {
    marginTop: spacing.sm,
  },
  castCard: {
    width: 110,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    height: 100, // Fixed height for uniformity
  },
  castImage: {
    width: 60,
    height: 40,
    marginBottom: 8,
  },
  castPlaceholder: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 8,
  },
  castName: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
  },
});
