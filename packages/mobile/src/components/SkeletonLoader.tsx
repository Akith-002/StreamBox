import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useTheme } from "../hooks/useTheme";

const { width } = Dimensions.get("window");
const numColumns = 2;
const cardWidth = (width - 48) / numColumns;

interface SkeletonLoaderProps {
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6 }) => {
  const { colors, theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const backgroundColor = theme === "dark" ? "#2a2a2a" : "#E1E9EE";

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: count }).map((_, index) => (
          <View key={index} style={styles.cardContainer}>
            {/* Movie Poster Skeleton */}
            <Animated.View
              style={[
                styles.posterSkeleton,
                {
                  width: cardWidth,
                  height: cardWidth * 1.5,
                  backgroundColor,
                  opacity,
                },
              ]}
            />

            {/* Title Skeleton */}
            <Animated.View
              style={[
                styles.titleSkeleton,
                { width: cardWidth - 20, backgroundColor, opacity },
              ]}
            />

            {/* Rating Skeleton */}
            <Animated.View
              style={[styles.ratingSkeleton, { backgroundColor, opacity }]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContainer: {
    marginBottom: 20,
  },
  posterSkeleton: {
    borderRadius: 12,
    marginBottom: 8,
  },
  titleSkeleton: {
    height: 20,
    borderRadius: 4,
    marginBottom: 6,
    marginLeft: 4,
  },
  ratingSkeleton: {
    width: 60,
    height: 16,
    borderRadius: 4,
    marginLeft: 4,
  },
});

export default SkeletonLoader;
