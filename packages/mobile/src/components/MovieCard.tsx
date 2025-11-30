import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import { borderRadius, fontSizes, shadows, spacing } from "../constants/theme";
import { Movie } from "../types/Movie";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

function MovieCard({ movie, onPress, style }: MovieCardProps) {
  const { colors } = useTheme();

  const posterUri = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : undefined;

  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "";

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
        {posterUri ? (
          <Image
            source={{ uri: posterUri }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Feather name="film" size={24} color={colors.textLight} />
          </View>
        )}

        <View style={styles.ratingBadge}>
          <Feather name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>
            {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {movie.title}
        </Text>
        {releaseYear ? (
          <Text style={[styles.year, { color: colors.textSecondary }]}>
            {releaseYear}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
    marginBottom: spacing.xs,
    ...shadows.small,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  details: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    marginBottom: 2,
  },
  year: {
    fontSize: 11,
  },
});

export default memo(MovieCard);
