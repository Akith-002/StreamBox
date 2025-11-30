import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "../api/backendApi";
import MovieCard from "../components/MovieCard";
import { Movie } from "../types/Movie";
import { spacing, fontSizes } from "../constants/theme";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const SPACING = spacing.md;
const ITEM_WIDTH = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

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

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [category]);

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
      <View style={{ width: ITEM_WIDTH, marginBottom: spacing.lg }}>
        <MovieCard
          movie={item}
          onPress={() =>
            navigation.navigate("HomeTab", {
              screen: "Details",
              params: { movieId: item.id },
            })
          }
        />
      </View>
    ),
    [navigation]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => `all-${category}-${item.id}`}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={5}
          removeClippedSubviews={true}
          ListFooterComponent={
            isFetching || loadingMore ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <View style={{ height: 40 }} />
            )
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loaderContainer: {
    marginVertical: spacing.xl,
    alignItems: "center",
  },
});
