import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Animated,
  Image, // Make sure to import Image
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGetTrendingMoviesQuery } from "../api/tmdbApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { Movie } from "../types/Movie";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const HERO_ROTATION_INTERVAL = 5000;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data, error, isLoading, refetch } =
    useGetTrendingMoviesQuery(undefined);

  const [heroIndex, setHeroIndex] = useState(0);
  const [nextHeroIndex, setNextHeroIndex] = useState(0);

  // We only need one animation value for the "Overlay"
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Track the numeric opacity value in state so we don't read private internals
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0);

  const trendingMovies = data?.results ?? [];
  const heroMovies = trendingMovies.slice(0, 5);
  const currentMovie = heroMovies[heroIndex];
  const nextMovie = heroMovies[nextHeroIndex]; // The movie we are transitioning TO
  const topMovies = trendingMovies.slice(5, 10);
  const popularMovies = trendingMovies.slice(10, 15);

  const changeHeroMovie = (newIndex: number) => {
    if (newIndex === heroIndex) return;

    // 1. Prepare the "Next" layer
    setNextHeroIndex(newIndex);

    // 2. Animate the "Next" layer from 0 to 1 opacity ON TOP of the current layer
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800, // Slower duration feels smoother for hero sections
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        // 3. Animation done. The "Next" movie is fully visible.
        // Now we update the "Base" movie to match the "Next" movie.
        setHeroIndex(newIndex);

        // 4. Instantly hide the overlay.
        // Since Base and Next are now identical, the user sees no change.
        fadeAnim.setValue(0);
      }
    });
  };

  useEffect(() => {
    // Keep overlayOpacity updated while the animation runs, so render can
    // safely react to the current opacity without touching private fields.
    const listenerId = fadeAnim.addListener(({ value }) => {
      setOverlayOpacity(value);
    });

    return () => {
      // Clean up the listener when the component unmounts or fadeAnim changes
      try {
        fadeAnim.removeListener(listenerId);
      } catch (e) {
        // Some RN versions may not throw but we defensively ignore any issues
      }
    };
    // Note: fadeAnim won't change identity so this effect acts like componentDidMount
  }, [fadeAnim]);

  useEffect(() => {
    if (heroMovies.length === 0) return;

    const interval = setInterval(() => {
      // Calculate next index based on current visual state
      const nextIndex = (heroIndex + 1) % heroMovies.length;
      changeHeroMovie(nextIndex);
    }, HERO_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [heroIndex, heroMovies.length]);

  const handleMoviePress = (movieId: number) => {
    navigation.navigate("Details" as never, { movieId } as never);
  };

  // ... [Keep your isLoading and Error renders exactly as they were] ...
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <TouchableOpacity
          onPress={() => refetch()}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.card }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper to render the content inside the hero (Title, Rating, Button)
  const renderHeroContent = (movie: Movie) => (
    <>
      <View style={styles.heroGradient} />
      <View style={styles.heroContent}>
        <Text
          style={[styles.heroTitle, { color: colors.card }]}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <View style={styles.heroMeta}>
          <View style={styles.heroRating}>
            <Feather name="star" size={16} color="#FFB800" />
            <Text style={[styles.heroRatingText, { color: colors.card }]}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.heroYear, { color: colors.card }]}>
            {movie.release_date ? movie.release_date.slice(0, 4) : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.heroButton, { backgroundColor: colors.primary }]}
          onPress={() => handleMoviePress(movie.id)}
        >
          <Feather name="play" size={20} color={colors.card} />
          <Text style={[styles.heroButtonText, { color: colors.card }]}>
            Watch Now
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Helper for Horizontal Cards (Moved out of main render for cleanliness)
  const renderHorizontalMovieCard = ({ item }: { item: Movie }) => {
    const posterUri = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : undefined;
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={() => handleMoviePress(item.id)}
        activeOpacity={0.8}
      >
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.horizontalPoster} />
        ) : (
          <View
            style={[styles.horizontalPoster, { backgroundColor: colors.card }]}
          >
            <Feather name="film" size={32} color={colors.textLight} />
          </View>
        )}
        <Text
          style={[styles.horizontalCardTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Featured Movie Hero */}
      {currentMovie && (
        <View style={styles.heroSection}>
          {/* 1. BASE LAYER - Always Visible (The "Old" Movie) */}
          <View style={StyleSheet.absoluteFill}>
            <ImageBackground
              source={{
                uri: currentMovie.backdrop_path
                  ? `${TMDB_IMAGE_BASE_URL}${currentMovie.backdrop_path}`
                  : `${TMDB_IMAGE_BASE_URL}${currentMovie.poster_path}`,
              }}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            >
              {renderHeroContent(currentMovie)}
            </ImageBackground>
          </View>

          {/* 2. OVERLAY LAYER - Fades In (The "New" Movie) */}
          {/* We only render this if nextHeroIndex is different to prevent unnecessary renders */}
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 1 }]}
          >
            {nextMovie && (
              <ImageBackground
                source={{
                  uri: nextMovie.backdrop_path
                    ? `${TMDB_IMAGE_BASE_URL}${nextMovie.backdrop_path}`
                    : `${TMDB_IMAGE_BASE_URL}${nextMovie.poster_path}`,
                }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                {renderHeroContent(nextMovie)}
              </ImageBackground>
            )}
          </Animated.View>

          {/* 3. Indicators - Ensure zIndex is higher than the overlay */}
          <View style={[styles.carouselIndicators, { zIndex: 2 }]}>
            {heroMovies.map((_: Movie, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => changeHeroMovie(index)}
                activeOpacity={0.7}
                style={[
                  styles.indicator,
                  {
                    backgroundColor:
                      index ===
                      (overlayOpacity > 0.5 ? nextHeroIndex : heroIndex)
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.4)",
                    width:
                      index ===
                      (overlayOpacity > 0.5 ? nextHeroIndex : heroIndex)
                        ? 24
                        : 8,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Top Rated Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Top Rated
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeMore, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={topMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `top-${item.id}`}
          renderItem={renderHorizontalMovieCard}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Popular Now Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Now
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeMore, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={popularMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `popular-${item.id}`}
          renderItem={renderHorizontalMovieCard}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// STYLES remain exactly the same as your original code
const styles = StyleSheet.create({
  // ... keep your existing styles ...
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  heroSection: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    height: 320, // Explicit height is important for absolute positioning to work
    ...shadows.large,
  },
  heroImage: { width: "100%", height: 320, justifyContent: "flex-end" },
  heroImageStyle: { borderRadius: borderRadius.xl },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  }, // Darkened slightly for better text contrast
  heroContent: { padding: spacing.lg, gap: spacing.sm },
  heroTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  heroRating: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  heroRatingText: { fontSize: fontSizes.md, fontWeight: "600" },
  heroYear: { fontSize: fontSizes.md, fontWeight: "500" },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    alignSelf: "flex-start",
    ...shadows.medium,
  },
  heroButtonText: { fontSize: fontSizes.md, fontWeight: "bold" },
  section: { marginTop: spacing.xl },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: fontSizes.xl, fontWeight: "bold" },
  seeMore: { fontSize: fontSizes.sm, fontWeight: "600" },
  horizontalList: { paddingHorizontal: spacing.lg },
  horizontalCard: { width: 130, marginRight: spacing.md },
  horizontalPoster: {
    width: 130,
    height: 195,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalCardTitle: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    fontWeight: "600",
    lineHeight: 18,
  },
  carouselIndicators: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  indicator: { width: 8, height: 8, borderRadius: 4, ...shadows.small },
  bottomSpacing: { height: spacing.xxl },
});
