import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useDiscoverMoviesQuery,
  useDiscoverTVQuery,
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
} from "../api/tmdbApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes } from "../constants/theme";
import MediaCard from "../components/MediaCard";

type ContentType = "movie" | "tv";
type SortOption =
  | "popularity.desc"
  | "vote_average.desc"
  | "primary_release_date.desc"
  | "first_air_date.desc";

export default function DiscoverScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();

  const initialGenreId = route.params?.genreId || null;

  const [contentType, setContentType] = useState<ContentType>("movie");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    initialGenreId
  );
  const [sortBy, setSortBy] = useState<SortOption>("popularity.desc");

  const { data: movieGenres } = useGetMovieGenresQuery(undefined);
  const { data: tvGenres } = useGetTVGenresQuery(undefined);

  React.useEffect(() => {
    if (route.params?.genreId) {
      setSelectedGenre(route.params.genreId);
    }
  }, [route.params?.genreId]);

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

  // Consistent Chip Style using Theme Colors
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
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.chip,
        {
          // Active = Primary Color, Inactive = Card Color (Consistent with other screens)
          backgroundColor: isActive ? colors.primary : colors.card,
          borderColor: isActive ? colors.primary : colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.chipContent}>
        {icon && (
          <Feather
            name={icon}
            size={14}
            color={isActive ? "#FFF" : colors.textSecondary}
            style={{ marginRight: 6 }}
          />
        )}
        <Text
          style={[
            styles.chipText,
            {
              color: isActive ? "#FFF" : colors.text,
              fontWeight: isActive ? "700" : "500",
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Discover
          </Text>

          {/* Toggle Switch - Matching Theme */}
          <View
            style={[
              styles.toggleWrapper,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.toggleItem,
                contentType === "movie" && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setContentType("movie");
                setSelectedGenre(null);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      contentType === "movie"
                        ? "#FFFFFF"
                        : colors.textSecondary,
                  },
                ]}
              >
                Movies
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleItem,
                contentType === "tv" && { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                setContentType("tv");
                setSelectedGenre(null);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      contentType === "tv" ? "#FFFFFF" : colors.textSecondary,
                  },
                ]}
              >
                TV Shows
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTERS SECTION */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
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
              label="Newest"
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.filterScroll,
              { marginTop: 12, paddingBottom: 10 },
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
              Oops! Something went wrong.
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => `${contentType}-${item.id}`}
            renderItem={renderMediaCard}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // Toggle Switch
  toggleWrapper: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 2,
    height: 40,
    alignItems: "center",
  },
  toggleItem: {
    paddingHorizontal: 16,
    height: 34,
    justifyContent: "center",
    borderRadius: 18,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Filters
  filterScroll: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    overflow: "hidden",
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
  },

  // Grid
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 3,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: fontSizes.md,
  },
});
