import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface HamburgerButtonProps {
  onPress: () => void;
  isOpen: boolean;
}

const HamburgerButton = ({ onPress, isOpen }: HamburgerButtonProps) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 1 : 0, { duration: 300 });
  }, [isOpen]);

  const topLineStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 45]);
    const translateY = interpolate(rotation.value, [0, 1], [0, 8]);

    return {
      transform: [{ translateY }, { rotate: `${rotate}deg` }],
    };
  });

  const middleLineStyle = useAnimatedStyle(() => {
    const opacity = interpolate(rotation.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  const bottomLineStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, -45]);
    const translateY = interpolate(rotation.value, [0, 1], [0, -8]);

    return {
      transform: [{ translateY }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Animated.View style={[styles.line, topLineStyle]} />
      <Animated.View style={[styles.line, middleLineStyle]} />
      <Animated.View style={[styles.line, bottomLineStyle]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.neutral(0.8),
    marginVertical: 3,
    borderRadius: 1,
  },
});

export default HamburgerButton;
