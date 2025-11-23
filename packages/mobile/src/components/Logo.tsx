import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { lightColors, spacing } from "../constants/theme";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 60, showText = true }) => {
  return (
    <View style={styles.container}>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require("../../assets/Streambox logo.png")}
        style={{ width: size, height: size, borderRadius: size / 5 }}
        resizeMode="contain"
      />
      {showText && (
        <Text
          style={[
            styles.text,
            { fontSize: size * 0.5, color: lightColors.text },
          ]}
        >
          StreamBox
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  text: {
    fontWeight: "bold",
    marginLeft: spacing.xs,
  },
});

export default Logo;
