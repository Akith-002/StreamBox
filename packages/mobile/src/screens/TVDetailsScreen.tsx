import React, { useRef } from "react";
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
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useGetTVDetailsQuery } from "../api/tmdbApi";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../api/backendApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const screenWidth = Dimensions.get("window").width;

export default function TVDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { tvId } = route.params;
  const { data: show, isLoading } = useGetTVDetailsQuery(tvId);
  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const heartScale = useRef(new Animated.Value(1)).current;

  const isFavourite =
    show && favorites
      ? favorites.some((f) => f.tmdbId === show.id && f.mediaType === "tv")
      : false;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleFavouritePress = async () => {
    if (!show) return;

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
    ]).start();

    try {
      if (isFavourite) {
        await removeFavorite({ tmdbId: show.id, mediaType: "tv" }).unwrap();
        Alert.alert("Removed", `${show.name} removed from favorites`);
      } else {
        await addFavorite({
          tmdbId: show.id,
          title: show.name,
          posterPath: show.poster_path,
          mediaType: "tv",
          voteAverage: show.vote_average,
          releaseDate: show.first_air_date,
        }).unwrap();
        Alert.alert("Added", `${show.name} added to favorites`);
      }
    } catch {
      Alert.alert("Error", "Failed to update favorites. Please try again.");
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

  if (!show) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          Unable to load TV show details
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

  const posterImageUrl = show.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${show.poster_path}`
    : null;

  const backdropImageUrl = show.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${show.backdrop_path}`
    : null;

  const firstAirYear = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : "N/A";

  const genreString = show.genres
    ? show.genres.map((g: any) => g.name).join(" • ")
    : "N/A";

  const renderSeason = ({ item }: { item: any }) => {
    const seasonPoster = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : null;

    return (
      <View
        style={[
          styles.seasonCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {seasonPoster ? (
          <Image source={{ uri: seasonPoster }} style={styles.seasonPoster} />
        ) : (
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.accent}30`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.seasonPoster}
          >
            <Feather name="tv" size={24} color={colors.textLight} />
          </LinearGradient>
        )}
        <View style={styles.seasonInfo}>
          <Text
            style={[styles.seasonName, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.seasonMeta, { color: colors.textLight }]}>
            {item.episode_count} episodes
          </Text>
          {item.air_date ? (
            <Text style={[styles.seasonMeta, { color: colors.textLight }]}>
              {new Date(item.air_date).getFullYear()}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backIconButton}
          >
            <Feather name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {show.name}
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
        {backdropImageUrl ? (
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
        ) : null}

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Poster & Key Info */}
          <View style={styles.posterSection}>
            {posterImageUrl ? (
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
            ) : null}
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
                    {show.vote_average?.toFixed(1) || "N/A"}
                  </Text>
                  <Text
                    style={[
                      styles.ratingCount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ({show.vote_count?.toLocaleString() || 0})
                  </Text>
                </View>
              </LinearGradient>

              {/* First Air Date */}
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
                  {firstAirYear}
                </Text>
              </View>

              {/* Seasons & Episodes */}
              <View
                style={[
                  styles.metaBox,
                  {
                    backgroundColor: `${colors.primary}10`,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="tv" size={16} color={colors.info} />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {show.number_of_seasons} S • {show.number_of_episodes} E
                </Text>
              </View>
            </View>
          </View>

          {/* Title & Tagline */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>
              {show.name}
            </Text>
            {show.tagline ? (
              <Text style={[styles.tagline, { color: colors.textLight }]}>
                {show.tagline}
              </Text>
            ) : null}
          </View>

          {/* Genres */}
          {genreString !== "N/A" ? (
            <View style={styles.genresSection}>
              <Text style={[styles.genreText, { color: colors.text }]}>
                {genreString}
              </Text>
            </View>
          ) : null}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="layers" size={20} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Seasons
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {show.number_of_seasons || 0}
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="film" size={20} color={colors.success} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Episodes
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {show.number_of_episodes || 0}
              </Text>
            </View>

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
                {show.popularity?.toFixed(0) || "N/A"}
              </Text>
            </View>
          </View>

          {/* Status */}
          {show.status ? (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    show.status === "Returning Series"
                      ? `${colors.success}20`
                      : `${colors.warning}20`,
                  borderColor:
                    show.status === "Returning Series"
                      ? colors.success
                      : colors.warning,
                },
              ]}
            >
              <Feather
                name="info"
                size={16}
                color={
                  show.status === "Returning Series"
                    ? colors.success
                    : colors.warning
                }
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      show.status === "Returning Series"
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {show.status}
              </Text>
            </View>
          ) : null}

          {/* Overview */}
          {show.overview ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Synopsis
              </Text>
              <Text
                style={[styles.overviewText, { color: colors.textSecondary }]}
              >
                {show.overview}
              </Text>
            </View>
          ) : null}

          {/* Seasons */}
          {show.seasons && show.seasons.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Seasons ({show.seasons.length})
              </Text>
              <FlatList
                data={show.seasons}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSeason}
                contentContainerStyle={styles.seasonsList}
              />
            </View>
          ) : null}

          {/* Networks */}
          {show.networks && show.networks.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Network
              </Text>
              <View style={styles.networkList}>
                {show.networks.slice(0, 3).map((network: any) => (
                  <View
                    key={network.id}
                    style={[
                      styles.networkItem,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Feather name="tv" size={16} color={colors.primary} />
                    <Text style={[styles.networkName, { color: colors.text }]}>
                      {network.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

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
    </SafeAreaView>
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
    marginBottom: spacing.lg,
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
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statusText: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
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
  seasonsList: {
    gap: spacing.md,
  },
  seasonCard: {
    flexDirection: "row",
    width: 280,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.small,
    gap: spacing.md,
  },
  seasonPoster: {
    width: 60,
    height: 90,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  seasonInfo: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xs,
  },
  seasonName: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  seasonMeta: {
    fontSize: fontSizes.sm,
  },
  networkList: {
    gap: spacing.md,
  },
  networkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  networkName: {
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
