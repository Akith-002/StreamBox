import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSearchMoviesQuery } from "../api/backendApi";
import { MovieDto } from "@streambox/shared";
import { useTheme } from "../hooks/useTheme";
import { spacing, fontSizes, borderRadius, shadows } from "../constants/theme";
import { TMDB_IMAGE_BASE_URL } from "../constants/config";

const SEARCH_HISTORY_KEY = "@streambox_search_history";
const MAX_HISTORY_ITEMS = 10;

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allResults, setAllResults] = useState<MovieDto[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchMoviesQuery(
    { query: debouncedQuery, page: currentPage },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  // Update accumulated results when new data arrives
  useEffect(() => {
    if (searchData?.results) {
      setAllResults((prev) => {
        if (currentPage === 1) return searchData.results as MovieDto[];
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueNew = (searchData.results as MovieDto[]).filter(
          (m) => !existingIds.has(m.id)
        );
        return [...prev, ...uniqueNew];
      });
    }
  }, [searchData, currentPage]);

  const searchResults = allResults;

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  };

  const saveToHistory = async (query: string) => {
    try {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length < 2) return;

      let updatedHistory = [trimmedQuery];
      const filtered = searchHistory.filter(
        (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
      );
      updatedHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const clearHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const removeHistoryItem = async (query: string) => {
    try {
      const updatedHistory = searchHistory.filter((item) => item !== query);
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Error removing history item:", error);
    }
  };

  const handleSearch = useCallback(
    async (query: string, addToHistory = true) => {
      if (query.trim().length < 2) {
        setDebouncedQuery("");
        setAllResults([]);
        setCurrentPage(1);
        return;
      }
      try {
        // Reset for new search
        setCurrentPage(1);
        setAllResults([]);
        setDebouncedQuery(query);
        if (addToHistory) {
          await saveToHistory(query);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    },
    [searchHistory]
  );

  const handleHistoryItemPress = (query: string) => {
    setSearchQuery(query);
    handleSearch(query, true);
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(text, false);
    }, 500);
  };

  const handleSubmitSearch = () => {
    if (searchQuery.trim().length >= 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      handleSearch(searchQuery, true);
    }
  };

  const handleItemPress = (item: MovieDto) => {
    if (searchQuery.trim().length >= 2) {
      saveToHistory(searchQuery);
    }
    navigation.navigate("HomeTab", {
      screen: "Details",
      params: { movieId: item.id },
    });
  };

  // --- Render Items ---

  const renderSearchResult = ({ item }: { item: MovieDto }) => {
    const title = item.title;
    const year = item.release_date ? item.release_date.slice(0, 4) : "N/A";
    const imageUri = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : "";

    return (
      <TouchableOpacity
        style={[styles.resultItem, { backgroundColor: "transparent" }]} // Transparent to look cleaner
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.posterWrapper}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.resultImage} />
          ) : (
            <View
              style={[styles.resultImage, { backgroundColor: colors.card }]}
            >
              <Feather name="film" size={20} color={colors.textLight} />
            </View>
          )}
        </View>

        <View style={styles.resultInfo}>
          <Text
            style={[styles.resultTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={styles.resultMetaRow}>
            <Text
              style={[styles.resultSubtitle, { color: colors.textSecondary }]}
            >
              Movie • {year}
            </Text>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={10} color={colors.primary} />
              <Text style={[styles.ratingText, { color: colors.primary }]}>
                {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
        <Feather
          name="arrow-up-left"
          size={18}
          color={colors.textLight}
          style={{ opacity: 0.5 }}
        />
      </TouchableOpacity>
    );
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.historyRow, { borderBottomColor: colors.border }]}
      onPress={() => handleHistoryItemPress(item)}
      activeOpacity={0.7}
    >
      <Feather name="clock" size={16} color={colors.textLight} />
      <Text style={[styles.historyText, { color: colors.textSecondary }]}>
        {item}
      </Text>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent triggering search
          removeHistoryItem(item);
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="x" size={16} color={colors.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header Title */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search</Text>
      </View>

      {/* Modern Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Feather name="search" size={18} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Movies, shows, people..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmitSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setDebouncedQuery("");
            }}
          >
            <View
              style={[styles.clearBtn, { backgroundColor: colors.textLight }]}
            >
              <Feather name="x" size={12} color={colors.card} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {isLoading || isFetching ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : debouncedQuery && searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderSearchResult}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            onEndReached={() => {
              if (
                searchData &&
                currentPage < searchData.total_pages &&
                !isFetching
              ) {
                setCurrentPage((prev) => prev + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetching && currentPage > 1 ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginVertical: 16 }}
                />
              ) : null
            }
          />
        ) : debouncedQuery && searchQuery.length >= 2 ? (
          <View style={styles.centered}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
              <Feather name="search" size={40} color={colors.textLight} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No results found
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              Check spelling or try a different keyword
            </Text>
          </View>
        ) : (
          <ScrollView
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {/* History Section */}
            {searchHistory.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Recent
                  </Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text
                      style={[styles.clearAllText, { color: colors.primary }]}
                    >
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {searchHistory.map((item, index) => (
                    <View key={`${item}-${index}`}>
                      {renderHistoryItem({ item })}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: 16,
    height: 50, // Fixed height for pill shape
    borderRadius: 25, // Fully rounded
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: "500",
    height: "100%",
  },
  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: fontSizes.md,
    textAlign: "center",
  },

  // List Styles
  resultsList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  posterWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: 48,
    height: 72,
    borderRadius: 6,
    resizeMode: "cover",
  },
  resultInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  resultTitle: {
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
  resultMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resultSubtitle: {
    fontSize: 13,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)", // Subtle background
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // History Styles - CLEANER LIST
  sectionContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },

  // Tags
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
