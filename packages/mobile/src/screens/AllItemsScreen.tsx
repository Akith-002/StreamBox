import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "../api/backendApi";
import MovieCard from "../components/MovieCard";
import { Movie } from "../types/Movie";

type RouteParams = {
  category?: string;
  title?: string;
};

export default function AllItemsScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { category = "trending", title = "Items" } = (route.params ||
    {}) as RouteParams;

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Movie[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: trendingData, isFetching: fetchingTrending } =
    useGetTrendingMoviesQuery(page, { skip: category !== "trending" });

  const { data: popularData, isFetching: fetchingPopular } =
    useGetPopularMoviesQuery(page, { skip: category !== "popular" });

  const { data: topRatedData, isFetching: fetchingTopRated } =
    useGetTopRatedMoviesQuery(page, { skip: category !== "topRated" });

  const results =
    (category === "trending" && trendingData?.results) ||
    (category === "popular" && popularData?.results) ||
    (category === "topRated" && topRatedData?.results) ||
    [];

  const isFetching = fetchingTrending || fetchingPopular || fetchingTopRated;

  // Reset when category changes
  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [category]);

  // Accumulate pages into `items` to avoid replacing the list on each page fetch
  useEffect(() => {
    if (!results || results.length === 0) return;

    setItems((prev) => {
      if (page === 1) return results as Movie[];
      const existingIds = new Set(prev.map((m) => m.id));
      const uniqueNew = (results as Movie[]).filter(
        (m) => !existingIds.has(m.id)
      );
      return [...prev, ...uniqueNew];
    });
  }, [results, page]);

  // when fetching finishes, stop the loadingMore guard
  useEffect(() => {
    if (!isFetching) setLoadingMore(false);
  }, [isFetching]);

  const loadMore = () => {
    if (loadingMore || isFetching) return;

    const totalPages =
      (category === "trending" && trendingData?.total_pages) ||
      (category === "popular" && popularData?.total_pages) ||
      (category === "topRated" && topRatedData?.total_pages) ||
      1;

    if (page < totalPages) {
      setLoadingMore(true);
      setPage((p) => p + 1);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard
        movie={item}
        onPress={() =>
          navigation.navigate("HomeTab", {
            screen: "Details",
            params: { movieId: item.id },
          })
        }
      />
    ),
    [navigation]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => `all-${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.8}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListFooterComponent={
          isFetching || loadingMore ? (
            <ActivityIndicator
              style={{ marginVertical: 16 }}
              color={colors.primary}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
});
