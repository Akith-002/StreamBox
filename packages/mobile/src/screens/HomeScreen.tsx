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
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useGetTrendingMoviesQuery } from "../api/tmdbApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { Movie } from "../types/Movie";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const HERO_ROTATION_INTERVAL = 5000;
const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data, error, isLoading, refetch } =
    useGetTrendingMoviesQuery(undefined);

  const [heroIndex, setHeroIndex] = useState(0);
  const [nextHeroIndex, setNextHeroIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Keep a numeric copy of the animated opacity so we don't read private internals
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0);

  useEffect(() => {
    const id = fadeAnim.addListener(({ value }) => setOverlayOpacity(value));
    return () => {
      try {
        fadeAnim.removeListener(id);
      } catch (e) {
        // ignore
      }
    };
  }, [fadeAnim]);

  const trendingMovies = data?.results ?? [];
  const heroMovies = trendingMovies.slice(0, 5);
  const currentMovie = heroMovies[heroIndex];
  const nextMovie = heroMovies[nextHeroIndex];
  const topMovies = trendingMovies.slice(5, 10);
  const popularMovies = trendingMovies.slice(10, 15);

  const changeHeroMovie = (newIndex: number) => {
    if (newIndex === heroIndex) return;

    setNextHeroIndex(newIndex);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setHeroIndex(newIndex);
        fadeAnim.setValue(0);
      }
    });
  };

  useEffect(() => {
    if (heroMovies.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (heroIndex + 1) % heroMovies.length;
      changeHeroMovie(nextIndex);
    }, HERO_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [heroIndex, heroMovies.length]);

  const handleMoviePress = (movieId: number) => {
    navigation.navigate("Details", { movieId } as any);
  };

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
          <Text style={{ color: colors.card, fontWeight: "600" }}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeroContent = (movie: Movie) => (
    <>
      <LinearGradient
        colors={["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.9)"]}
        style={styles.heroGradient}
      />
      <View style={styles.heroContent}>
        <Text
          style={[styles.heroTitle, { color: "#FFFFFF" }]}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <View style={styles.heroMeta}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroRating}
          >
            <Feather name="star" size={14} color="#FFFFFF" />
            <Text style={styles.heroRatingText}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </LinearGradient>
          <Text style={styles.heroYear}>
            {movie.release_date ? movie.release_date.slice(0, 4) : ""}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleMoviePress(movie.id)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroButton}
          >
            <Feather name="play" size={18} color="#FFFFFF" />
            <Text style={styles.heroButtonText}>Watch Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderHorizontalMovieCard = ({ item }: { item: Movie }) => {
    const posterUri = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : undefined;

    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={() => handleMoviePress(item.id)}
        activeOpacity={0.7}
      >
        {posterUri ? (
          <View style={styles.posterWrapper}>
            <Image
              source={{ uri: posterUri }}
              style={styles.horizontalPoster}
            />
            <View style={styles.posterGlassOverlay}>
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
                style={styles.posterGradient}
              >
                <View style={styles.ratingBadgeSmall}>
                  <Feather name="star" size={10} color="#FFD700" />
                  <Text style={styles.ratingSmallText}>
                    {item.vote_average.toFixed(1)}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.accent}30`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.horizontalPoster}
          >
            <Feather name="film" size={32} color={colors.textLight} />
          </LinearGradient>
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
          {/* Base Layer */}
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

          {/* Overlay Layer */}
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

          {/* Carousel Indicators */}
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
                        ? colors.primary
                        : `rgba(255, 255, 255, 0.3)`,
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

      {/* Trending Now Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trending Now
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textLight }]}>
              This week's hottest movies
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.seeMore, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={heroMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `trending-${item.id}`}
          renderItem={renderHorizontalMovieCard}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Top Rated Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Top Rated
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textLight }]}>
              Highest-rated films
            </Text>
          </View>
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
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular Now
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textLight }]}>
              What people are watching
            </Text>
          </View>
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

const styles = StyleSheet.create({
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
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  heroSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    height: 380,
    ...shadows.large,
  },
  heroImage: { width: "100%", height: 380, justifyContent: "flex-end" },
  heroImageStyle: { borderRadius: borderRadius.xl },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: { padding: spacing.xl, gap: spacing.lg },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  heroRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    ...shadows.medium,
  },
  heroRatingText: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroYear: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    alignSelf: "flex-start",
    ...shadows.large,
  },
  heroButtonText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  section: { marginTop: spacing.xl, marginBottom: spacing.md },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: { fontSize: 24, fontWeight: "bold" },
  sectionSubtitle: { fontSize: fontSizes.sm, marginTop: 4, fontWeight: "500" },
  seeMore: { fontSize: fontSizes.sm, fontWeight: "600" },
  horizontalList: { paddingHorizontal: spacing.lg },
  horizontalCard: { width: 140, marginRight: spacing.lg },
  posterWrapper: {
    position: "relative",
    width: 140,
    height: 210,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  horizontalPoster: {
    width: 140,
    height: 210,
    borderRadius: borderRadius.xl,
    ...shadows.large,
    justifyContent: "center",
    alignItems: "center",
  },
  posterGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  posterGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  ratingBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  ratingSmallText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  horizontalCardTitle: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    fontWeight: "700",
    lineHeight: 18,
  },
  carouselIndicators: {
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    ...shadows.medium,
  },
  bottomSpacing: { height: spacing.xxl },
});
