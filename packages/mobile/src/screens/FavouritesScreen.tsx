import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  TextInput,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../api/backendApi";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - spacing.lg * 3) / 2;

// Sort Options
type SortType = "date" | "rating" | "name";
type FilterType = "all" | "movie" | "tv";

export default function FavouritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data: favorites, isLoading } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();

  // UI States
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [showSearch, setShowSearch] = useState(false);

  // --- DATA PROCESSING ---
  const processedList = useMemo(() => {
    if (!Array.isArray(favorites)) return [];

    let result = [...favorites];

    // 1. Filter by Category (Movie/TV)
    if (activeFilter !== "all") {
      result = result.filter(
        (item) => (item.mediaType || "movie") === activeFilter
      );
    }

    // 2. Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(query)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "rating") {
        return (b.voteAverage || 0) - (a.voteAverage || 0);
      }
      if (sortBy === "name") {
        return (a.title || "").localeCompare(b.title || "");
      }
      // Default: Date (assuming API returns newest first, or we keep order)
      return 0;
    });

    return result;
  }, [favorites, activeFilter, searchQuery, sortBy]);

  const handleItemPress = (item: any) => {
    const mediaType = item.mediaType || "movie";
    if (mediaType === "tv") {
      navigation.navigate("HomeTab", {
        screen: "TVDetails",
        params: { tvId: item.tmdbId },
      });
    } else {
      navigation.navigate("HomeTab", {
        screen: "Details",
        params: { movieId: item.tmdbId },
      });
    }
  };

  const handleRemove = async (item: any) => {
    const tmdbId = item.tmdbId;
    const mediaType = item.mediaType || "movie";

    setDeletingIds((prev) => new Set(prev).add(tmdbId));

    try {
      await removeFavorite({ tmdbId, mediaType }).unwrap();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(tmdbId);
        return next;
      });
    }
  };

  // --- RENDER HELPERS ---

  const renderFavouriteCard = ({ item }: { item: any }) => {
    const posterUri = item.posterPath
      ? `${TMDB_IMAGE_BASE_URL}${item.posterPath}`
      : undefined;

    const isDeleting = deletingIds.has(item.tmdbId);
    const title = item.title || "";
    const year = item.releaseDate ? item.releaseDate.slice(0, 4) : "N/A";
    const rating = item.voteAverage ? item.voteAverage.toFixed(1) : "N/A";

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: isDeleting ? 0 : 1,
            transform: [{ scale: isDeleting ? 0.8 : 1 }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleItemPress(item)}
          style={styles.cardContainer}
        >
          <View
            style={[styles.posterContainer, { backgroundColor: colors.card }]}
          >
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={styles.posterImage} />
            ) : (
              <View style={styles.placeholderPoster}>
                <Feather name="image" size={24} color={colors.textLight} />
              </View>
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradientOverlay}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item)}
              activeOpacity={0.6}
            >
              <View style={styles.glassCircle}>
                <Feather name="x" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>
            <View style={styles.mediaTag}>
              <Text style={styles.mediaTagText}>
                {(item.mediaType || "movie").toUpperCase() === "TV"
                  ? "TV"
                  : "MOVIE"}
              </Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View style={styles.metaRow}>
              <Feather name="star" size={10} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {rating}
              </Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                •
              </Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {year}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const FilterPill = ({
    label,
    value,
  }: {
    label: string;
    value: FilterType;
  }) => (
    <TouchableOpacity
      style={[
        styles.pill,
        {
          backgroundColor:
            activeFilter === value ? colors.primary : colors.card,
          borderWidth: activeFilter === value ? 0 : 1,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setActiveFilter(value)}
    >
      <Text
        style={[
          styles.pillText,
          { color: activeFilter === value ? "#FFF" : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.headerSection}>
      {/* Title & Search Toggle */}
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My List
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {processedList.length} Titles Saved
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          onPress={() => {
            setShowSearch(!showSearch);
            if (showSearch) {
              setSearchQuery("");
              Keyboard.dismiss();
            }
          }}
        >
          <Feather
            name={showSearch ? "x" : "search"}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Expandable Search Bar */}
      {showSearch && (
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Feather name="search" size={18} color={colors.textLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Find in library..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      {/* Filter & Sort Row */}
      <View style={styles.controlsRow}>
        <View style={styles.pillsRow}>
          <FilterPill label="All" value="all" />
          <FilterPill label="Movies" value="movie" />
          <FilterPill label="TV Shows" value="tv" />
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            // Cycle sort: Date -> Rating -> Name -> Date
            if (sortBy === "date") setSortBy("rating");
            else if (sortBy === "rating") setSortBy("name");
            else setSortBy("date");
          }}
        >
          <Text style={[styles.sortText, { color: colors.textSecondary }]}>
            {sortBy === "date"
              ? "Recent"
              : sortBy === "rating"
              ? "Rating"
              : "A-Z"}
          </Text>
          <Feather
            name="bar-chart-2"
            size={16}
            color={colors.textSecondary}
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.card }]}>
        <Feather
          name={searchQuery ? "search" : "heart"}
          size={40}
          color={colors.textLight}
        />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? "No matches found" : "Your list is empty"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery
          ? "Try adjusting your filters or search query."
          : "Content you add to your favorites will appear here."}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[styles.browseButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("HomeTab")}
        >
          <Text style={styles.browseButtonText}>Explore Content</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <FlatList
        data={processedList}
        keyExtractor={(item) => item.tmdbId.toString()}
        renderItem={renderFavouriteCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },

  // Header Section Styles
  headerSection: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    fontWeight: "500",
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.small,
  },

  // Search Bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: fontSizes.md,
    height: "100%",
  },

  // Controls (Filter pills + Sort)
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  sortText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Grid Items
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  cardWrapper: {
    width: cardWidth,
  },
  cardContainer: {
    gap: 6,
  },
  posterContainer: {
    width: "100%",
    height: cardWidth * 1.45,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    position: "relative",
    ...shadows.small,
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderPoster: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },

  // Card UI Elements
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
    padding: 4, // Increase touch area
  },
  glassCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  mediaTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  mediaTagText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },

  // Info Section
  infoContainer: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "500",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: "700",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  browseButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.round,
    ...shadows.medium,
  },
  browseButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: fontSizes.md,
  },
});
