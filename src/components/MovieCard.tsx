import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import {
  borderRadius,
  fontSizes,
  lightColors,
  shadows,
  spacing,
} from "../constants/theme";
import { Movie } from "../types/Movie";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  const posterUri = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : undefined;
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "TBA";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Feather name="film" size={32} color={lightColors.textLight} />
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.subtitle}>{releaseYear}</Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={14} color={lightColors.primary} />
          <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.voteCount}>{`(${movie.vote_count})`}</Text>
        </View>
        <Text style={styles.overview} numberOfLines={3}>
          {movie.overview || "No synopsis yet."}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    padding: spacing.md,
    ...shadows.small,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: borderRadius.md,
  },
  posterPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: borderRadius.md,
    backgroundColor: lightColors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
    color: lightColors.text,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: lightColors.textSecondary,
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  rating: {
    marginLeft: spacing.xs,
    fontWeight: "600",
    color: lightColors.text,
  },
  voteCount: {
    marginLeft: spacing.sm,
    color: lightColors.textSecondary,
  },
  overview: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    color: lightColors.textLight,
    lineHeight: 20,
  },
});
