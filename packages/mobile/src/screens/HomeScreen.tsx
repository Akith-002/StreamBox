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
import { useTheme } from "../hooks/useTheme";
import {
  useGetTrendingMoviesQuery,
  useGetTrendingTVQuery,
  useGetTopRatedMoviesQuery,
  useGetPopularTVQuery,
} from "../api/tmdbApi";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { Movie, TVShow, MediaItem, isMovie, isTVShow } from "../types/Movie";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import MediaCard from "../components/MediaCard";

const HERO_ROTATION_INTERVAL = 5000;
const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const {
    data: trendingMoviesData,
    isLoading: loadingMovies,
    error: moviesError,
  } = useGetTrendingMoviesQuery("week");

  const {
    data: trendingTVData,
    isLoading: loadingTV,
    error: tvError,
  } = useGetTrendingTVQuery("week");

  const {
    data: topRatedMoviesData,
    isLoading: loadingTopRated,
    error: topRatedError,
  } = useGetTopRatedMoviesQuery(1);

  const {
    data: popularTVData,
    isLoading: loadingPopularTV,
    error: popularTVError,
  } = useGetPopularTVQuery(1);

  const isLoading =
    loadingMovies || loadingTV || loadingTopRated || loadingPopularTV;

  // Log errors for debugging
  useEffect(() => {
    if (moviesError) console.log("Movies Error:", moviesError);
    if (tvError) console.log("TV Error:", tvError);
    if (topRatedError) console.log("Top Rated Error:", topRatedError);
    if (popularTVError) console.log("Popular TV Error:", popularTVError);
  }, [moviesError, tvError, topRatedError, popularTVError]);

  // Log data for debugging
  useEffect(() => {
    console.log("Trending Movies:", trendingMoviesData?.results?.length || 0);
    console.log("Trending TV:", trendingTVData?.results?.length || 0);
    console.log("Top Rated Movies:", topRatedMoviesData?.results?.length || 0);
    console.log("Popular TV:", popularTVData?.results?.length || 0);
  }, [trendingMoviesData, trendingTVData, topRatedMoviesData, popularTVData]);

  const [heroIndex, setHeroIndex] = useState(0);
  const [nextHeroIndex, setNextHeroIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
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

  const trendingMovies = (trendingMoviesData?.results ?? []) as Movie[];
  const trendingTV = (trendingTVData?.results ?? []) as TVShow[];
  const topRatedMovies = (topRatedMoviesData?.results ?? []) as Movie[];
  const popularTV = (popularTVData?.results ?? []) as TVShow[];

  // Combine movies and TV shows for hero section
  const allHeroItems: MediaItem[] = [
    ...trendingMovies.slice(0, 3),
    ...trendingTV.slice(0, 2),
  ];
  // Filter out Person types to ensure only Movie and TVShow are in hero items
  const heroItems = allHeroItems
    .filter((item): item is Movie | TVShow => isMovie(item) || isTVShow(item))
    .slice(0, 5);
  const currentItem = heroItems[heroIndex];
  const nextItem = heroItems[nextHeroIndex];

  const changeHeroItem = (newIndex: number) => {
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
    if (heroItems.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (heroIndex + 1) % heroItems.length;
      changeHeroItem(nextIndex);
    }, HERO_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [heroIndex, heroItems.length]);

  const handleMediaPress = (item: MediaItem) => {
    if (isMovie(item)) {
      navigation.navigate("HomeTab", {
        screen: "Details",
        params: { movieId: item.id },
      });
    } else if (isTVShow(item)) {
      navigation.navigate("HomeTab", {
        screen: "TVDetails",
        params: { tvId: item.id },
      });
    }
  };

  // Only show full-screen loading if we have no data at all
  const hasNoData =
    !trendingMoviesData &&
    !trendingTVData &&
    !topRatedMoviesData &&
    !popularTVData;
  const hasErrors = moviesError || tvError || topRatedError || popularTVError;

  if (isLoading && hasNoData) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[{ color: colors.textSecondary, marginTop: 16 }]}>
          Loading content...
        </Text>
        {hasErrors && (
          <Text
            style={[
              {
                color: colors.error,
                marginTop: 16,
                paddingHorizontal: 20,
                textAlign: "center",
              },
            ]}
          >
            Error loading content. Check your internet connection and TMDB API
            key.
          </Text>
        )}
      </View>
    );
  }

  const renderHeroContent = (item: MediaItem) => {
    const title = isMovie(item) ? item.title : isTVShow(item) ? item.name : "";
    const year = isMovie(item)
      ? item.release_date
        ? item.release_date.slice(0, 4)
        : ""
      : isTVShow(item)
      ? item.first_air_date
        ? item.first_air_date.slice(0, 4)
        : ""
      : "";
    const voteAverage =
      isMovie(item) || isTVShow(item) ? item.vote_average || 0 : 0;

    return (
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
            {title}
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
                {voteAverage.toFixed(1)}
              </Text>
            </LinearGradient>
            <Text style={styles.heroYear}>{year}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleMediaPress(item)}
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
  };

  const renderMediaCard = ({ item }: { item: MediaItem }) => {
    const title = isMovie(item) ? item.title : isTVShow(item) ? item.name : "";
    const posterPath =
      isMovie(item) || isTVShow(item) ? item.poster_path : null;

    return (
      <TouchableOpacity onPress={() => handleMediaPress(item)}>
        <View style={styles.movieCard}>
          {posterPath && (
            <Image
              source={{ uri: `${TMDB_IMAGE_BASE_URL}${posterPath}` }}
              style={styles.moviePoster}
            />
          )}
          <Text
            style={[styles.movieTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Debug Info - Remove after testing */}
      {__DEV__ && (
        <View
          style={{
            padding: 10,
            backgroundColor: colors.card,
            margin: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 10 }}>
            Movies: {trendingMovies.length} | TV: {trendingTV.length} | Top:{" "}
            {topRatedMovies.length} | Pop: {popularTV.length}
          </Text>
          {hasErrors && (
            <Text style={{ color: colors.error, fontSize: 10 }}>
              Has Errors!
            </Text>
          )}
        </View>
      )}

      {/* Featured Hero */}
      {currentItem && (
        <View style={styles.heroSection}>
          {/* Base Layer */}
          <View style={StyleSheet.absoluteFill}>
            <ImageBackground
              source={{
                uri:
                  (isMovie(currentItem) || isTVShow(currentItem)) &&
                  currentItem.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${currentItem.backdrop_path}`
                    : (isMovie(currentItem) || isTVShow(currentItem)) &&
                      currentItem.poster_path
                    ? `${TMDB_IMAGE_BASE_URL}${currentItem.poster_path}`
                    : "",
              }}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            >
              {renderHeroContent(currentItem)}
            </ImageBackground>
          </View>

          {/* Overlay Layer */}
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 1 }]}
          >
            {nextItem && (
              <ImageBackground
                source={{
                  uri:
                    (isMovie(nextItem) || isTVShow(nextItem)) &&
                    nextItem.backdrop_path
                      ? `https://image.tmdb.org/t/p/w1280${nextItem.backdrop_path}`
                      : (isMovie(nextItem) || isTVShow(nextItem)) &&
                        nextItem.poster_path
                      ? `${TMDB_IMAGE_BASE_URL}${nextItem.poster_path}`
                      : "",
                }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                {renderHeroContent(nextItem)}
              </ImageBackground>
            )}
          </Animated.View>

          {/* Carousel Indicators */}
          <View style={[styles.carouselIndicators, { zIndex: 2 }]}>
            {heroItems.map((_: MediaItem, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => changeHeroItem(index)}
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

      {/* Trending Movies Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trending Movies
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
        {trendingMovies.length > 0 ? (
          <FlatList
            data={trendingMovies.slice(0, 10)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `trending-movie-${item.id}`}
            renderItem={renderMediaCard}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.xl,
            }}
          >
            <Text style={[{ color: colors.textSecondary }]}>
              {loadingMovies ? "Loading..." : "No trending movies available"}
            </Text>
          </View>
        )}
      </View>

      {/* Trending TV Shows Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trending TV Shows
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textLight }]}>
              Popular series this week
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.seeMore, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trendingTV.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `trending-tv-${item.id}`}
          renderItem={renderMediaCard}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Top Rated Movies Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Top Rated Movies
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
          data={topRatedMovies.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `top-movie-${item.id}`}
          renderItem={renderMediaCard}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Popular TV Shows Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular TV Shows
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
          data={popularTV.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `popular-tv-${item.id}`}
          renderItem={renderMediaCard}
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
  movieCard: {
    width: 140,
    marginRight: spacing.md,
  },
  moviePoster: {
    width: 140,
    height: 210,
    borderRadius: borderRadius.md,
  },
  movieTitle: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
});
