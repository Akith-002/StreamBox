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
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "../api/backendApi";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { Movie, TVShow, MediaItem, isMovie, isTVShow } from "../types/Movie";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import SkeletonLoader from "../components/SkeletonLoader";

const HERO_ROTATION_INTERVAL = 5000;
const screenWidth = Dimensions.get("window").width;
const HERO_HEIGHT = screenWidth * 1.3; // Taller, more immersive hero

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  // Pagination state
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);

  // API Hooks with refetch capability and pagination
  const {
    data: trendingMoviesData,
    isLoading: loadingMovies,
    isFetching: fetchingTrending,
    refetch: refetchMovies,
  } = useGetTrendingMoviesQuery(trendingPage);

  const {
    data: popularMoviesData,
    isLoading: loadingPopular,
    isFetching: fetchingPopular,
    refetch: refetchPopular,
  } = useGetPopularMoviesQuery(popularPage);

  const {
    data: topRatedMoviesData,
    isLoading: loadingTopRated,
    isFetching: fetchingTopRated,
    refetch: refetchTopRated,
  } = useGetTopRatedMoviesQuery(topRatedPage);

  const isLoading = loadingMovies || loadingPopular || loadingTopRated;

  const [refreshing, setRefreshing] = useState(false);

  const [heroIndex, setHeroIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start at 1

  // Accumulated results for infinite scroll
  const [allTrendingMovies, setAllTrendingMovies] = useState<Movie[]>([]);
  const [allPopularMovies, setAllPopularMovies] = useState<Movie[]>([]);
  const [allTopRatedMovies, setAllTopRatedMovies] = useState<Movie[]>([]);

  // Update accumulated results when new data arrives
  useEffect(() => {
    if (trendingMoviesData?.results) {
      setAllTrendingMovies((prev) => {
        const newMovies = trendingMoviesData.results as Movie[];
        if (trendingPage === 1) return newMovies;
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNew = newMovies.filter((m) => !existingIds.has(m.id));
        return [...prev, ...uniqueNew];
      });
    }
  }, [trendingMoviesData, trendingPage]);

  useEffect(() => {
    if (popularMoviesData?.results) {
      setAllPopularMovies((prev) => {
        const newMovies = popularMoviesData.results as Movie[];
        if (popularPage === 1) return newMovies;
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNew = newMovies.filter((m) => !existingIds.has(m.id));
        return [...prev, ...uniqueNew];
      });
    }
  }, [popularMoviesData, popularPage]);

  useEffect(() => {
    if (topRatedMoviesData?.results) {
      setAllTopRatedMovies((prev) => {
        const newMovies = topRatedMoviesData.results as Movie[];
        if (topRatedPage === 1) return newMovies;
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNew = newMovies.filter((m) => !existingIds.has(m.id));
        return [...prev, ...uniqueNew];
      });
    }
  }, [topRatedMoviesData, topRatedPage]);

  const trendingMovies = allTrendingMovies;
  const popularMovies = allPopularMovies;
  const topRatedMovies = allTopRatedMovies;

  // Filter and Setup Hero Items (use first page only)
  const heroItems = [...trendingMovies.slice(0, 5)]
    .filter((item): item is Movie => isMovie(item))
    .slice(0, 5);

  const currentHero = heroItems[heroIndex];

  // Pull to Refresh Handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Reset pages to 1
      setTrendingPage(1);
      setPopularPage(1);
      setTopRatedPage(1);
      // Clear accumulated data
      setAllTrendingMovies([]);
      setAllPopularMovies([]);
      setAllTopRatedMovies([]);
      // Refetch
      await Promise.all([refetchMovies(), refetchPopular(), refetchTopRated()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Carousel Logic
  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Switch Content
        setHeroIndex((prev) => (prev + 1) % heroItems.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, HERO_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const handleMediaPress = (item: MediaItem) => {
    navigation.navigate("HomeTab", {
      screen: isMovie(item) ? "Details" : "TVDetails",
      params: isMovie(item) ? { movieId: item.id } : { tvId: item.id },
    });
  };

  // --- Render Components ---

  const HeroSection = () => {
    if (!currentHero) return null;

    const title = currentHero.title || "";
    const imageUri = currentHero.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${currentHero.poster_path}`
      : null;

    // Get genres or date for meta info
    const metaText = currentHero.release_date?.slice(0, 4) || "Movie";

    return (
      <View style={styles.heroContainer}>
        <Animated.View style={[styles.heroImageWrapper, { opacity: fadeAnim }]}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          )}
          {/* Gradient Mesh for blending */}
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.heroGradientBottom}
            locations={[0.4, 1]}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={styles.heroGradientTop}
          />
        </Animated.View>

        {/* Hero Info Overlay */}
        <View style={styles.heroContentContainer}>
          <View style={styles.heroTagContainer}>
            <Text style={styles.heroTagText}>Trending Now</Text>
          </View>

          <Animated.Text
            style={[styles.heroTitle, { opacity: fadeAnim, color: "#FFF" }]}
          >
            {title}
          </Animated.Text>

          <Animated.View style={[styles.heroMetaRow, { opacity: fadeAnim }]}>
            <Text style={styles.heroMetaText}>{metaText}</Text>
            <Text style={styles.heroDot}>•</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={14} color={colors.primary} />
              <Text style={[styles.ratingText, { color: colors.primary }]}>
                {currentHero.vote_average?.toFixed(1)}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: "#FFF" }]}
              activeOpacity={0.8}
              onPress={() => handleMediaPress(currentHero)}
            >
              <Feather name="play" size={20} color="#000" />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.detailsButton,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
              activeOpacity={0.8}
              onPress={() => handleMediaPress(currentHero)}
            >
              <Feather name="info" size={20} color="#FFF" />
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderMediaCard = ({ item }: { item: MediaItem }) => {
    const title = isMovie(item) ? item.title : isTVShow(item) ? item.name : "";
    const posterPath =
      isMovie(item) || isTVShow(item) ? item.poster_path : null;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => handleMediaPress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${posterPath}` }}
          style={[styles.cardImage, { backgroundColor: colors.card }]}
        />
        {/* Only show title if it's not too long, otherwise clean look */}
        <Text
          style={[styles.cardTitle, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const SectionHeader = ({
    title,
    onSeeAll,
  }: {
    title: string;
    onSeeAll?: () => void;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={[styles.seeAllText, { color: colors.primary }]}>
          See All
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !trendingMovies.length) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <SkeletonLoader count={6} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <HeroSection />

        <View style={styles.contentContainer}>
          {/* Trending Movies */}
          <SectionHeader title="Trending Movies" />
          <FlatList
            data={trendingMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaCard}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => `tm-${item.id}`}
            onEndReached={() => {
              if (
                trendingMoviesData &&
                trendingPage < trendingMoviesData.total_pages &&
                !fetchingTrending
              ) {
                setTrendingPage((prev) => prev + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              fetchingTrending ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginLeft: 16 }}
                />
              ) : null
            }
          />

          {/* Popular Movies */}
          <SectionHeader title="Popular Movies" />
          <FlatList
            data={popularMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaCard}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => `pm-${item.id}`}
            onEndReached={() => {
              if (
                popularMoviesData &&
                popularPage < popularMoviesData.total_pages &&
                !fetchingPopular
              ) {
                setPopularPage((prev) => prev + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              fetchingPopular ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginLeft: 16 }}
                />
              ) : null
            }
          />

          {/* Top Rated */}
          <SectionHeader title="Top Rated Movies" />
          <FlatList
            data={topRatedMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaCard}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => `tr-${item.id}`}
            onEndReached={() => {
              if (
                topRatedMoviesData &&
                topRatedPage < topRatedMoviesData.total_pages &&
                !fetchingTopRated
              ) {
                setTopRatedPage((prev) => prev + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              fetchingTopRated ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginLeft: 16 }}
                />
              ) : null
            }
          />

          {/* Trending Movies with Infinite Scroll */}
          <SectionHeader title="Trending Now" />
          <FlatList
            data={trendingMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderMediaCard}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => `trend-${item.id}`}
            onEndReached={() => {
              if (
                trendingMoviesData &&
                trendingPage < trendingMoviesData.total_pages &&
                !fetchingTrending
              ) {
                setTrendingPage((prev) => prev + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              fetchingTrending ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginLeft: 16 }}
                />
              ) : null
            }
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Hero Styles
  heroContainer: {
    height: HERO_HEIGHT,
    width: screenWidth,
    position: "relative",
    justifyContent: "flex-end",
  },
  heroImageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradientBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  heroGradientTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "30%",
  },
  heroContentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: "center", // Center align for modern look
  },
  heroTagContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroTagText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 36, // Larger title
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  heroMetaText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
  },
  heroDot: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
  },
  heroButtons: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: 8,
    maxWidth: 160,
  },
  playButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  detailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: 8,
    maxWidth: 160,
  },
  detailsButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Content Styles
  contentContainer: {
    marginTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.sm, // Adjust for last item
  },
  cardContainer: {
    marginRight: spacing.md,
    width: 120, // Fixed width for uniformity
  },
  cardImage: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
