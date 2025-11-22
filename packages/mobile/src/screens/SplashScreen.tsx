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

const SplashScreen = () => {
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Premium Gradient Background */}
      <LinearGradient
        colors={["#0F172A", "#1E1B4B", "#312E81"]}
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
          <View style={styles.logoContainer}>
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
            <Text style={styles.appName}>StreamBox</Text>
            <Text style={styles.tagline}>Unlimited Entertainment</Text>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Footer Loader */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={LOADER_COLOR} />
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
};

const BACKGROUND_COLOR = "#0F172A";
const SHADOW_COLOR = "#4F46E5";
const TEXT_COLOR = "#FFFFFF";
const TAGLINE_COLOR = "#94A3B8";
const LOADER_COLOR = "#A5B4FC";
const VERSION_COLOR = "#64748B";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
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
    color: TEXT_COLOR,
    letterSpacing: 2,
    textAlign: "center",
  },
  tagline: {
    marginTop: 8,
    fontSize: fontSizes.md,
    color: TAGLINE_COLOR,
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
    color: VERSION_COLOR,
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default SplashScreen;
