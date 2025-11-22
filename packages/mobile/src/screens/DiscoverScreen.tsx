import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
// 1. Import SafeAreaView from the correct library
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "../api/backendApi";
import { MovieDto } from "@streambox/shared";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

export default function DiscoverScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const [sortBy, setSortBy] = useState<"popular" | "top_rated">("popular");

  const {
    data: popularMovies,
    isLoading: popularLoading,
    error: popularError,
  } = useGetPopularMoviesQuery(1, {
    skip: sortBy !== "popular",
  });

  const {
    data: topRatedData,
    isLoading: topRatedLoading,
    error: topRatedError,
  } = useGetTopRatedMoviesQuery(1, {
    skip: sortBy !== "top_rated",
  });

  const results =
    sortBy === "popular" ? popularMovies?.results : topRatedData?.results;
  const isLoading = sortBy === "popular" ? popularLoading : topRatedLoading;
  const error = sortBy === "popular" ? popularError : topRatedError;

  const handleMediaPress = (id: number) => {
    navigation.navigate("HomeTab", {
      screen: "Details",
      params: { movieId: id },
    });
  };

  const renderMediaCard = ({ item }: { item: MovieDto }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMediaPress(item.id)}
    >
      <Image
        source={{ uri: `${TMDB_IMAGE_BASE_URL}${item.poster_path}` }}
        style={styles.moviePoster}
      />
      <Text
        style={[styles.movieTitle, { color: colors.text }]}
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <View style={styles.movieMeta}>
        <Feather name="star" size={12} color="#FFD700" />
        <Text style={[styles.movieRating, { color: colors.text }]}>
          {item.vote_average.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const FilterChip = ({
    label,
    isActive,
    onPress,
    icon,
  }: {
    label: string;
    isActive: boolean;
    onPress: () => void;
    icon?: any;
  }) => (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: isActive ? colors.primary : "transparent",
          borderColor: isActive ? colors.primary : colors.border,
          borderWidth: isActive ? 0 : 1,
        },
      ]}
      onPress={onPress}
    >
      {icon && (
        <Feather
          name={icon}
          size={14}
          color={isActive ? "#FFF" : colors.text}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={[styles.chipText, { color: isActive ? "#FFF" : colors.text }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    // 2. Use SafeAreaView here to avoid the notch overlap
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerSection}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Discover Movies
        </Text>
      </View>

      {/* FILTERS AREA */}
      <View style={styles.filtersContainer}>
        {/* Sort Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <FilterChip
            label="Popular"
            icon="trending-up"
            isActive={sortBy === "popular"}
            onPress={() => setSortBy("popular")}
          />
          <FilterChip
            label="Top Rated"
            icon="star"
            isActive={sortBy === "top_rated"}
            onPress={() => setSortBy("top_rated")}
          />
        </ScrollView>
      </View>

      {/* RESULTS GRID */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Feather
            name="alert-circle"
            size={40}
            color={colors.error || "red"}
          />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Unable to load content
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `movie-${item.id}`}
          renderItem={renderMediaCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: borderRadius.lg,
    padding: 4,
    height: 48,
  },
  segmentButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    fontSize: fontSizes.md,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 8,
  },
  chipText: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  resultsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    fontSize: fontSizes.md,
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
  },
  movieCard: {
    width: "48%",
    marginBottom: spacing.md,
  },
  moviePoster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: borderRadius.md,
  },
  movieTitle: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  movieMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  movieRating: {
    fontSize: fontSizes.xs,
    fontWeight: "600",
  },
});
