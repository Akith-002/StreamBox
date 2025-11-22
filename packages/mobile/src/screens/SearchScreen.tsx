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
} from "react-native";
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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchMoviesQuery(
    { query: debouncedQuery, page: 1 },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  const searchResults = searchData?.results || [];

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

      // Remove duplicates and add to front
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
        return;
      }

      try {
        setDebouncedQuery(query);

        // Save to history after successful search
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
    handleSearch(query, true); // Add to history (moves to top)
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search (without saving to history)
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(text, false);
    }, 500);
  };

  const handleSubmitSearch = () => {
    if (searchQuery.trim().length >= 2) {
      // Clear timeout to prevent duplicate search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Search and save to history
      handleSearch(searchQuery, true);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleItemPress = (item: MovieDto) => {
    // Save current search query to history when user taps a result
    if (searchQuery.trim().length >= 2) {
      saveToHistory(searchQuery);
    }

    navigation.navigate("HomeTab", {
      screen: "Details",
      params: { movieId: item.id },
    });
  };

  const renderSearchResult = ({ item }: { item: MovieDto }) => {
    const title = item.title;
    const subtitle = item.release_date
      ? `Movie • ${item.release_date.slice(0, 4)}`
      : "Movie";
    const imageUri = item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : "";
    const icon = "film";

    return (
      <TouchableOpacity
        style={[
          styles.resultItem,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.resultImage} />
        ) : (
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.accent}30`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.resultImage}
          >
            <Feather name={icon as any} size={24} color={colors.textLight} />
          </LinearGradient>
        )}
        <View style={styles.resultInfo}>
          <Text
            style={[styles.resultTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={[styles.resultSubtitle, { color: colors.textLight }]}>
            {subtitle}
          </Text>
          <View style={styles.resultMeta}>
            <Feather name="star" size={12} color="#FFD700" />
            <Text style={[styles.resultRating, { color: colors.text }]}>
              {item.vote_average.toFixed(1)}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="search" size={20} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search movies, TV shows, people..."
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
            <Feather name="x-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {isLoading || isFetching ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>
            Searching...
          </Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderSearchResult}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery.length >= 2 ? (
        <View style={styles.centered}>
          <Feather name="search" size={64} color={colors.textLight} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No results found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
            Try different keywords
          </Text>
        </View>
      ) : (
        <View style={styles.historyContainer}>
          {searchHistory.length > 0 ? (
            <>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={[styles.clearText, { color: colors.primary }]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={searchHistory}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.historyItem,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.historyItemContent}
                      onPress={() => handleHistoryItemPress(item)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name="clock"
                        size={18}
                        color={colors.textLight}
                      />
                      <Text
                        style={[styles.historyText, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeHistoryItem(item)}
                      style={styles.historyDelete}
                    >
                      <Feather name="x" size={18} color={colors.textLight} />
                    </TouchableOpacity>
                  </View>
                )}
                contentContainerStyle={styles.historyList}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={styles.centered}>
              <Feather name="search" size={64} color={colors.textLight} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Start searching
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
                Search for movies, TV shows, and people
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    ...shadows.small,
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.md,
    padding: 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
  },
  emptyText: {
    marginTop: spacing.lg,
    fontSize: fontSizes.xl,
    fontWeight: "bold",
  },
  emptySubtext: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    textAlign: "center",
  },
  resultsList: {
    padding: spacing.lg,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    ...shadows.small,
    gap: spacing.md,
  },
  resultImage: {
    width: 60,
    height: 90,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  resultTitle: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  resultSubtitle: {
    fontSize: fontSizes.sm,
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  resultRating: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingTop: spacing.md,
  },
  historyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
  },
  clearText: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  historyList: {
    paddingBottom: spacing.xl,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  historyItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  historyText: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: "500",
  },
  historyDelete: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
});
