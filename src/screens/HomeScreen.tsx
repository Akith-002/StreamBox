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
import MovieCard from "../components/MovieCard";
import {
  lightColors,
  spacing,
  fontSizes,
  borderRadius,
} from "../constants/theme";
import { Movie } from "../types/Movie";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { data, error, isLoading, refetch } =
    useGetTrendingMoviesQuery(undefined);

  const trendingMovies = data?.results ?? [];

  const handleMoviePress = (movieId: number) => {
    navigation.navigate("Details" as never, { movieId } as never);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={lightColors.primary} />
        <Text style={styles.loadingText}>Fetching trending movies…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Feather name="alert-triangle" size={48} color={lightColors.error} />
        <Text style={styles.loadingText}>
          Unable to load movies. Check your connection.
        </Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending This Week</Text>
        <Text style={styles.subtitle}>Fresh picks from TMDB</Text>
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
            <Feather name="frown" size={36} color={lightColors.textLight} />
            <Text style={styles.emptyText}>
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
    backgroundColor: lightColors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold" as "bold",
    color: lightColors.text,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: lightColors.textSecondary,
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
    color: lightColors.textSecondary,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: lightColors.primary,
  },
  retryText: {
    color: lightColors.card,
    fontWeight: "600",
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.sm,
    color: lightColors.textLight,
    fontSize: fontSizes.md,
  },
});
