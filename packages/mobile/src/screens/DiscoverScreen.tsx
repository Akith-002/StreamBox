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
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
    if (mediaType === "movie") {
      navigation.navigate("HomeTab", {
        screen: "Details",
        params: { movieId: id },
      });
    } else {
      navigation.navigate("HomeTab", {
        screen: "TVDetails",
        params: { tvId: id },
      });
    }
  };

  const renderMediaCard = ({ item }: { item: any }) => (
    <MediaCard item={item} onPress={handleMediaPress} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content Type Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            contentType === "movie" && styles.toggleButtonActive,
            {
              backgroundColor:
                contentType === "movie" ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            setContentType("movie");
            setSelectedGenre(null);
          }}
          activeOpacity={0.7}
        >
          <Feather
            name="film"
            size={18}
            color={contentType === "movie" ? "#FFFFFF" : colors.text}
          />
          <Text
            style={[
              styles.toggleText,
              { color: contentType === "movie" ? "#FFFFFF" : colors.text },
            ]}
          >
            Movies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            contentType === "tv" && styles.toggleButtonActive,
            {
              backgroundColor:
                contentType === "tv" ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            setContentType("tv");
            setSelectedGenre(null);
          }}
          activeOpacity={0.7}
        >
          <Feather
            name="tv"
            size={18}
            color={contentType === "tv" ? "#FFFFFF" : colors.text}
          />
          <Text
            style={[
              styles.toggleText,
              { color: contentType === "tv" ? "#FFFFFF" : colors.text },
            ]}
          >
            TV Shows
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortContainer}
        contentContainerStyle={styles.sortContent}
      >
        <TouchableOpacity
          style={[
            styles.sortChip,
            sortBy === "popularity.desc" && styles.sortChipActive,
            {
              backgroundColor:
                sortBy === "popularity.desc" ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSortBy("popularity.desc")}
        >
          <Text
            style={[
              styles.sortChipText,
              {
                color: sortBy === "popularity.desc" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            Popular
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortChip,
            sortBy === "vote_average.desc" && styles.sortChipActive,
            {
              backgroundColor:
                sortBy === "vote_average.desc" ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSortBy("vote_average.desc")}
        >
          <Text
            style={[
              styles.sortChipText,
              {
                color: sortBy === "vote_average.desc" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            Top Rated
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortChip,
            (sortBy === "primary_release_date.desc" ||
              sortBy === "first_air_date.desc") &&
              styles.sortChipActive,
            {
              backgroundColor:
                sortBy === "primary_release_date.desc" ||
                sortBy === "first_air_date.desc"
                  ? colors.primary
                  : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() =>
            setSortBy(
              contentType === "movie"
                ? "primary_release_date.desc"
                : "first_air_date.desc"
            )
          }
        >
          <Text
            style={[
              styles.sortChipText,
              {
                color:
                  sortBy === "primary_release_date.desc" ||
                  sortBy === "first_air_date.desc"
                    ? "#FFFFFF"
                    : colors.text,
              },
            ]}
          >
            Latest
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Genres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genresContainer}
        contentContainerStyle={styles.genresContent}
      >
        <TouchableOpacity
          style={[
            styles.genreChip,
            selectedGenre === null && styles.genreChipActive,
            {
              backgroundColor:
                selectedGenre === null ? colors.accent : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSelectedGenre(null)}
        >
          <Text
            style={[
              styles.genreChipText,
              { color: selectedGenre === null ? "#FFFFFF" : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {genres?.map((genre: any) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreChip,
              selectedGenre === genre.id && styles.genreChipActive,
              {
                backgroundColor:
                  selectedGenre === genre.id ? colors.accent : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedGenre(genre.id)}
          >
            <Text
              style={[
                styles.genreChipText,
                { color: selectedGenre === genre.id ? "#FFFFFF" : colors.text },
              ]}
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>
            Discovering...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Feather name="alert-triangle" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    margin: spacing.lg,
    gap: spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  toggleButtonActive: {
    ...shadows.medium,
  },
  toggleText: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  sortContainer: {
    marginBottom: spacing.md,
  },
  sortContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sortChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  sortChipActive: {
    ...shadows.small,
  },
  sortChipText: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  genresContainer: {
    marginBottom: spacing.lg,
  },
  genresContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  genreChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  genreChipActive: {
    ...shadows.small,
  },
  genreChipText: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  resultsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
});
