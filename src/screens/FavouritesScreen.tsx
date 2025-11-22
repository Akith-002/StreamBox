import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { removeFavourite } from "../store/features/favouritesSlice";
import { useTheme } from "../hooks/useTheme";
import MovieCard from "../components/MovieCard";
import { spacing, fontSizes, borderRadius } from "../constants/theme";
import { RootState } from "../store/store";

export default function FavouritesScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const favouriteMovies = useSelector(
    (state: RootState) => state.favourites.favouriteMovies
  );

  const handleMoviePress = (movieId: number) => {
    navigation.navigate("HomeTab", {
      screen: "Details",
      params: { movieId },
    });
  };

  const handleRemove = (movieId: number, movieTitle: string) => {
    dispatch(removeFavourite(movieId));
  };

  const renderMovieCard = ({ item }: any) => (
    <View style={styles.movieCardContainer}>
      <MovieCard movie={item} onPress={() => handleMoviePress(item.id)} />
      <TouchableOpacity
        onPress={() => handleRemove(item.id, item.title)}
        style={[styles.removeButton, { backgroundColor: colors.error }]}
      >
        <Feather name="trash-2" size={16} color={colors.card} />
      </TouchableOpacity>
    </View>
  );

  const emptyComponent = (
    <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Feather name="heart" size={64} color={colors.textLight} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Favourites Yet
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start adding movies to your favourites to see them here
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          My Favourites
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {favouriteMovies.length} saved{" "}
          {favouriteMovies.length === 1 ? "movie" : "movies"}
        </Text>
      </View>

      <FlatList
        data={favouriteMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={emptyComponent}
        scrollEnabled={true}
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
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  movieCardContainer: {
    marginVertical: spacing.sm,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  emptyState: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    minHeight: 300,
    justifyContent: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSizes.md,
    textAlign: "center",
    maxWidth: "80%",
  },
});
