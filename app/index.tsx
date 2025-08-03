import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "@/helpers/common";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/store/hooks";

const WelcomeScreen = () => {
  const router = useRouter();
  const { id, name, isLoggedIn } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isLoggedIn && name && id) {
      const timeout = setTimeout(() => {
        router.replace("/home");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isLoggedIn, name, id, router]);

  const handleGetStarted = () => {
    if (isLoggedIn && name) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Animated.Text
          entering={FadeInDown.delay(200).springify()}
          style={styles.emoji}
        >
          {isLoggedIn ? "👋" : "🚀"}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(400).springify()}
          style={styles.title}
        >
          {isLoggedIn && name ? `Welcome back,` : "Welcome"}
        </Animated.Text>

        {isLoggedIn && name && (
          <Animated.Text
            entering={FadeInDown.delay(600).springify()}
            style={styles.userName}
          >
            {name}!
          </Animated.Text>
        )}

        <Animated.Text
          entering={FadeInDown.delay(isLoggedIn ? 800 : 600).springify()}
          style={styles.subtitle}
        >
          {isLoggedIn
            ? "Taking you to your dashboard..."
            : "Your journey starts here"}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(isLoggedIn ? 1000 : 800).springify()}
        >
          <Pressable style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>
              {isLoggedIn ? "Continue" : "Get Started"}
            </Text>
          </Pressable>
        </Animated.View>

        {!isLoggedIn && (
          <Animated.View entering={FadeInDown.delay(1000).springify()}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push("/about")}
            >
              <Text style={styles.secondaryButtonText}>Learn More</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: hp(8),
    marginBottom: 20,
  },
  title: {
    fontSize: hp(4.5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
  },
  userName: {
    fontSize: hp(4.5),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: hp(2.2),
    color: theme.colors.neutral(0.6),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: hp(2.8),
  },
  button: {
    backgroundColor: theme.colors.neutral(0.9),
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: theme.radius.lg,
    marginBottom: 16,
    minWidth: wp(60),
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.semibold,
    textAlign: "center",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: theme.colors.neutral(0.9),
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: theme.radius.lg,
    minWidth: wp(60),
  },
  secondaryButtonText: {
    color: theme.colors.neutral(0.9),
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.semibold,
    textAlign: "center",
  },
});

export default WelcomeScreen;
