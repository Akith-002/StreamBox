import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import { spacing, fontSizes } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

const SplashScreen = () => {
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // Sequence: Fade In -> Scale Up -> Slide Text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={[
          colors.background,
          colors.backgroundSecondary || colors.surface,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Container */}
          <View
            style={[styles.logoContainer, { shadowColor: colors.primaryDark }]}
          >
            <Logo size={120} showText={false} />
          </View>

          {/* Text Animation */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={[styles.appName, { color: colors.text }]}>
              StreamBox
            </Text>
            <Text style={[styles.tagline, { color: colors.textLight }]}>
              Unlimited Entertainment
            </Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Footer Loader */}
      <View style={styles.footer}>
        <ActivityIndicator
          size="small"
          color={colors.primaryLight || colors.primary}
        />
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          v1.0.0
        </Text>
      </View>
    </View>
  );
};

const SHADOW_COLOR = "#4F46E5";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContainer: {
    alignItems: "center",
    gap: spacing.lg,
  },
  logoContainer: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: spacing.md,
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    fontSize: fontSizes.md,
    letterSpacing: 1,
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    gap: 8,
  },
  versionText: {
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default SplashScreen;
