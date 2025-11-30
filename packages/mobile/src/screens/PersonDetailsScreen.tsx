import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  useGetPersonDetailsQuery,
  useGetPersonMovieCreditsQuery,
  useGetPersonTVCreditsQuery,
} from "../api/tmdbApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

export default function PersonDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { personId } = route.params;

  const { data: person, isLoading, error } = useGetPersonDetailsQuery(personId);
  const { data: movieCredits } = useGetPersonMovieCreditsQuery(personId);
  const { data: tvCredits } = useGetPersonTVCreditsQuery(personId);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleMediaPress = (id: number, type: "movie" | "tv") => {
    if (type === "movie") {
      navigation.navigate("HomeTab", {
        screen: "Details",
        params: { movieId: id },
      });
    } else {
      navigation.navigate("HomeTab", {
        screen: "TVDetails",
        params: { tvId: id },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading details…
        </Text>
      </View>
    );
  }

  if (error || !person) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          Unable to load person details
        </Text>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[styles.backButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.backButtonText, { color: colors.card }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileImageUrl = person.profile_path
    ? `${TMDB_IMAGE_BASE_URL}${person.profile_path}`
    : null;

  const birthYear = person.birthday
    ? new Date(person.birthday).getFullYear()
    : null;

  const age =
    person.birthday && !person.deathday
      ? new Date().getFullYear() - new Date(person.birthday).getFullYear()
      : null;

  const knownForMovies = movieCredits?.cast
    ? [...movieCredits.cast]
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 10)
    : [];

  const knownForTV = tvCredits?.cast
    ? [...tvCredits.cast]
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 10)
    : [];

  const renderMediaItem = ({
    item,
    type,
  }: {
    item: any;
    type: "movie" | "tv";
  }) => {
    const posterUri = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : null;
    const title = type === "movie" ? item.title : item.name;
    const year =
      type === "movie"
        ? item.release_date?.slice(0, 4)
        : item.first_air_date?.slice(0, 4);

    return (
      <TouchableOpacity
        style={styles.mediaCard}
        onPress={() => handleMediaPress(item.id, type)}
        activeOpacity={0.7}
      >
        {posterUri ? (
          <Image source={{ uri: posterUri }} style={styles.mediaPoster} />
        ) : (
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.accent}30`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mediaPoster}
          >
            <Feather
              name={type === "movie" ? "film" : "tv"}
              size={32}
              color={colors.textLight}
            />
          </LinearGradient>
        )}
        <View style={styles.mediaInfo}>
          <Text
            style={[styles.mediaTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {item.character ? (
            <Text style={[styles.mediaCharacter, { color: colors.textLight }]}>
              as {item.character}
            </Text>
          ) : null}
          {year ? (
            <Text style={[styles.mediaYear, { color: colors.textLight }]}>
              {year}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backIconButton}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {person.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={[
                styles.profileImage,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[`${colors.primary}30`, `${colors.accent}30`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.profileImage,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="user" size={64} color={colors.textLight} />
            </LinearGradient>
          )}

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {person.name}
            </Text>
            {person.known_for_department ? (
              <View style={styles.departmentBadge}>
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.departmentGradient}
                >
                  <Feather name="award" size={16} color="#FFFFFF" />
                  <Text style={styles.departmentText}>
                    {person.known_for_department}
                  </Text>
                </LinearGradient>
              </View>
            ) : null}
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          {birthYear ? (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="calendar" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Born
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {birthYear}
                {age ? ` (${age})` : ""}
              </Text>
            </View>
          ) : null}

          {person.place_of_birth ? (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="map-pin" size={20} color={colors.success} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                From
              </Text>
              <Text
                style={[styles.infoValue, { color: colors.text }]}
                numberOfLines={2}
              >
                {person.place_of_birth.split(",")[0]}
              </Text>
            </View>
          ) : null}

          {person.popularity ? (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="trending-up" size={20} color={colors.warning} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Popularity
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {person.popularity.toFixed(0)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Biography */}
        {person.biography ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Biography
            </Text>
            <Text
              style={[styles.biographyText, { color: colors.textSecondary }]}
            >
              {person.biography}
            </Text>
          </View>
        ) : null}

        {/* Known For - Movies */}
        {knownForMovies.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Known For - Movies
            </Text>
            <FlatList
              data={knownForMovies}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) =>
                `movie-${item.id}-${item.credit_id || index}`
              }
              renderItem={({ item }) =>
                renderMediaItem({ item, type: "movie" })
              }
              contentContainerStyle={styles.mediaList}
            />
          </View>
        ) : null}

        {/* Known For - TV Shows */}
        {knownForTV.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Known For - TV Shows
            </Text>
            <FlatList
              data={knownForTV}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) =>
                `tv-${item.id}-${item.credit_id || index}`
              }
              renderItem={({ item }) => renderMediaItem({ item, type: "tv" })}
              contentContainerStyle={styles.mediaList}
            />
          </View>
        ) : null}

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorText: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  backButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backIconButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: "600",
    marginHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  profileImage: {
    width: 160,
    height: 240,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    gap: spacing.md,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  departmentBadge: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.medium,
  },
  departmentGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  departmentText: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  infoBox: {
    flex: 1,
    minWidth: "30%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.small,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    marginTop: spacing.xs,
    textAlign: "center",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  biographyText: {
    fontSize: fontSizes.md,
    lineHeight: 22,
    textAlign: "justify",
  },
  mediaList: {
    gap: spacing.md,
  },
  mediaCard: {
    width: 120,
  },
  mediaPoster: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaInfo: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  mediaTitle: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    lineHeight: 16,
  },
  mediaCharacter: {
    fontSize: fontSizes.xs,
    fontStyle: "italic",
  },
  mediaYear: {
    fontSize: fontSizes.xs,
    fontWeight: "500",
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
