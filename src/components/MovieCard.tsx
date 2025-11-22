import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import {
  borderRadius,
  fontSizes,
  shadows,
  spacing,
} from "../constants/theme";
import { Movie } from "../types/Movie";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  const { colors } = useTheme();
  const posterUri = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : undefined;
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "TBA";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {posterUri ? (
        <Image source={{ uri: posterUri }} style={styles.poster} />
      ) : (
        <View
          style={[
            styles.posterPlaceholder,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Feather name="film" size={32} color={colors.textLight} />
        </View>
      )}
      <View style={styles.body}>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {releaseYear}
        </Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={14} color={colors.primary} />
          <Text style={[styles.rating, { color: colors.text }]}>
            {movie.vote_average.toFixed(1)}
          </Text>
          <Text style={[styles.voteCount, { color: colors.textSecondary }]}>
            {`(${movie.vote_count?.toLocaleString() || "0"})`}
          </Text>
        </View>
        <Text
          style={[styles.overview, { color: colors.textLight }]}
          numberOfLines={3}
        >
          {movie.overview || "No synopsis yet."}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    padding: spacing.md,
    ...shadows.small,
    borderWidth: 1,
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
  },
  subtitle: {
    fontSize: fontSizes.sm,
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
  },
  voteCount: {
    marginLeft: spacing.sm,
  },
  overview: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
});
