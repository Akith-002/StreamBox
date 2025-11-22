import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
// 1. Import SafeAreaView from the correct library
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useDiscoverMoviesQuery,
  useDiscoverTVQuery,
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
} from "../api/tmdbApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import MediaCard from "../components/MediaCard";

type ContentType = "movie" | "tv";
type SortOption =
  | "popularity.desc"
  | "vote_average.desc"
  | "primary_release_date.desc"
  | "first_air_date.desc";

export default function DiscoverScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const [contentType, setContentType] = useState<ContentType>("movie");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popularity.desc");

  const { data: movieGenres } = useGetMovieGenresQuery(undefined);
  const { data: tvGenres } = useGetTVGenresQuery(undefined);

  const discoverParams: any = {
    sort_by: sortBy,
    page: 1,
  };

  if (selectedGenre) {
    discoverParams.with_genres = selectedGenre.toString();
  }

  const {
    data: movieData,
    isLoading: movieLoading,
    error: movieError,
  } = useDiscoverMoviesQuery(discoverParams, {
    skip: contentType !== "movie",
  });

  const {
    data: tvData,
    isLoading: tvLoading,
    error: tvError,
  } = useDiscoverTVQuery(
    contentType === "tv" && sortBy === "primary_release_date.desc"
      ? { ...discoverParams, sort_by: "first_air_date.desc" }
      : discoverParams,
    {
      skip: contentType !== "tv",
    }
  );

  const results =
    contentType === "movie" ? movieData?.results : tvData?.results;
  const isLoading = contentType === "movie" ? movieLoading : tvLoading;
  const error = contentType === "movie" ? movieError : tvError;

  const genres =
    contentType === "movie" ? movieGenres?.genres : tvGenres?.genres;

  const handleMediaPress = (id: number, mediaType: "movie" | "tv") => {
    navigation.navigate("HomeTab", {
      screen: mediaType === "movie" ? "Details" : "TVDetails",
      params: mediaType === "movie" ? { movieId: id } : { tvId: id },
    });
  };

  const renderMediaCard = ({ item }: { item: any }) => (
    <MediaCard item={item} onPress={handleMediaPress} />
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
      {/* TOP TOGGLE */}
      <View style={styles.headerSection}>
        <View
          style={[styles.segmentContainer, { backgroundColor: colors.card }]}
        >
          <TouchableOpacity
            style={[
              styles.segmentButton,
              contentType === "movie" && styles.segmentActive,
            ]}
            onPress={() => {
              setContentType("movie");
              setSelectedGenre(null);
            }}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    contentType === "movie"
                      ? colors.primary
                      : colors.textLight || "#888",
                  fontWeight: contentType === "movie" ? "700" : "500",
                },
              ]}
            >
              Movies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              contentType === "tv" && styles.segmentActive,
            ]}
            onPress={() => {
              setContentType("tv");
              setSelectedGenre(null);
            }}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    contentType === "tv"
                      ? colors.primary
                      : colors.textLight || "#888",
                  fontWeight: contentType === "tv" ? "700" : "500",
                },
              ]}
            >
              TV Shows
            </Text>
          </TouchableOpacity>
        </View>
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
            isActive={sortBy === "popularity.desc"}
            onPress={() => setSortBy("popularity.desc")}
          />
          <FilterChip
            label="Top Rated"
            icon="star"
            isActive={sortBy === "vote_average.desc"}
            onPress={() => setSortBy("vote_average.desc")}
          />
          <FilterChip
            label="Latest"
            icon="calendar"
            isActive={
              sortBy === "primary_release_date.desc" ||
              sortBy === "first_air_date.desc"
            }
            onPress={() =>
              setSortBy(
                contentType === "movie"
                  ? "primary_release_date.desc"
                  : "first_air_date.desc"
              )
            }
          />
        </ScrollView>

        {/* Genres */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { marginTop: spacing.sm },
          ]}
        >
          <FilterChip
            label="All"
            isActive={selectedGenre === null}
            onPress={() => setSelectedGenre(null)}
          />
          {genres?.map((genre: any) => (
            <FilterChip
              key={genre.id}
              label={genre.name}
              isActive={selectedGenre === genre.id}
              onPress={() => setSelectedGenre(genre.id)}
            />
          ))}
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
          keyExtractor={(item) => `${contentType}-${item.id}`}
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
});
