import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGetTrendingMoviesQuery } from "../api/tmdbApi";
import { useTheme } from "../hooks/useTheme";
import MovieCard from "../components/MovieCard";
import {
  spacing,
  fontSizes,
  borderRadius,
} from "../constants/theme";
import { Movie } from "../types/Movie";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data, error, isLoading, refetch } =
    useGetTrendingMoviesQuery(undefined);

  const trendingMovies = data?.results ?? [];

  const handleMoviePress = (movieId: number) => {
    navigation.navigate("Details" as never, { movieId } as never);
  };

  if (isLoading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Fetching trending movies…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Unable to load movies. Check your connection.
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.card }]}>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Trending This Week
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Fresh picks from TMDB
        </Text>
      </View>
      <FlatList
        data={trendingMovies}
        keyExtractor={(item: Movie) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => handleMoviePress(item.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="frown" size={36} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              No trending movies found right now.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold" as "bold",
  },
  subtitle: {
    fontSize: fontSizes.md,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
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
  retryButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryText: {
    fontWeight: "600",
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
  },
});
