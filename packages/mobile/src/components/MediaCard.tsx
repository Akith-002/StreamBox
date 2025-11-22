import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { Movie, TVShow, isMovie, isTVShow } from "../types/Movie";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";
import {
  addFavourite,
  removeFavourite,
  addFavouriteTV,
  removeFavouriteTV,
  selectFavouriteMovies,
  selectFavouriteTV,
} from "../store/features/favouritesSlice";

interface MediaCardProps {
  item: Movie | TVShow;
  onPress: (id: number, mediaType: "movie" | "tv") => void;
}

export default function MediaCard({ item, onPress }: MediaCardProps) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const favouriteMovies = useSelector(selectFavouriteMovies);
  const favouriteTV = useSelector(selectFavouriteTV);

  const mediaType = isMovie(item) ? "movie" : "tv";
  const isFavourite =
    mediaType === "movie"
      ? favouriteMovies.some((m) => m.id === item.id)
      : favouriteTV.some((t) => t.id === item.id);

  const handleFavouritePress = () => {
    console.log(
      "Favourite pressed:",
      item.id,
      mediaType,
      isFavourite ? "removing" : "adding"
    );
    if (mediaType === "movie") {
      if (isFavourite) {
        dispatch(removeFavourite(item.id));
      } else {
        console.log("Adding movie to favourites:", item);
        dispatch(addFavourite(item as Movie));
      }
    } else {
      if (isFavourite) {
        dispatch(removeFavouriteTV(item.id));
      } else {
        console.log("Adding TV show to favourites:", item);
        dispatch(addFavouriteTV(item as TVShow));
      }
    }
  };

  const getTitle = () => {
    if (isMovie(item)) return item.title;
    if (isTVShow(item)) return item.name;
    return "Unknown";
  };

  const getDate = () => {
    if (isMovie(item)) return item.release_date;
    if (isTVShow(item)) return item.first_air_date;
    return "";
  };

  const getYear = () => {
    const date = getDate();
    return date ? date.slice(0, 4) : "N/A";
  };

  const posterUri = item.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
    : undefined;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.id, mediaType)}
      activeOpacity={0.7}
    >
      {posterUri ? (
        <View style={styles.posterWrapper}>
          <Image source={{ uri: posterUri }} style={styles.poster} />
          <View style={styles.posterGlassOverlay}>
            <LinearGradient
              colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
              style={styles.posterGradient}
            >
              <View style={styles.ratingBadge}>
                <Feather name="star" size={10} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {item.vote_average.toFixed(1)}
                </Text>
              </View>
            </LinearGradient>
          </View>
          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleFavouritePress}
            activeOpacity={0.7}
          >
            <Feather
              name="heart"
              size={18}
              color={isFavourite ? "#EF4444" : "#FFFFFF"}
              fill={isFavourite ? "#EF4444" : "none"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.posterWrapper}>
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.accent}30`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.poster}
          >
            <Feather
              name={mediaType === "movie" ? "film" : "tv"}
              size={32}
              color={colors.textLight}
            />
          </LinearGradient>
          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleFavouritePress}
            activeOpacity={0.7}
          >
            <Feather
              name="heart"
              size={18}
              color={isFavourite ? "#EF4444" : "#FFFFFF"}
              fill={isFavourite ? "#EF4444" : "none"}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {getTitle()}
        </Text>
        <View style={styles.meta}>
          <Feather
            name={mediaType === "movie" ? "film" : "tv"}
            size={12}
            color={colors.textLight}
          />
          <Text style={[styles.year, { color: colors.textLight }]}>
            {getYear()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: spacing.lg,
  },
  posterWrapper: {
    position: "relative",
    width: 140,
    height: 210,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: borderRadius.xl,
    ...shadows.large,
    justifyContent: "center",
    alignItems: "center",
  },
  posterGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  posterGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  info: {
    marginTop: spacing.sm,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  year: {
    fontSize: fontSizes.xs,
    fontWeight: "500",
  },
  favouriteButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.medium,
    zIndex: 10,
    elevation: 5,
  },
});
