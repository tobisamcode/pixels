import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppSelector } from "@/store/hooks";

const AboutScreen = () => {
  const router = useRouter();
  const { name, isLoggedIn } = useAppSelector((state) => state.user);

  const techStack = [
    { name: "React Native", icon: "⚛️" },
    { name: "Expo Router", icon: "🧭" },
    { name: "Redux Toolkit", icon: "🔄" },
    { name: "TypeScript", icon: "📘" },
    { name: "React Native Reanimated", icon: "✨" },
  ];

  const features = [
    "User authentication & state management",
    "Persistent user sessions with Redux Persist",
    "Smooth animations and transitions",
    "Clean, professional UI design",
    "Cross-platform compatibility",
    "Type-safe development with TypeScript",
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.content}
        >
          <Text style={styles.emoji}>🚀</Text>

          <Text style={styles.title}>About This App</Text>

          <Text style={styles.description}>
            This mobile application demonstrates modern React Native development
            practices with Redux state management, featuring user authentication
            and a clean, professional design.
          </Text>

          {isLoggedIn && (
            <View style={styles.userInfo}>
              <Text style={styles.userInfoTitle}>Current User</Text>
              <Text style={styles.currentUser}>👤 {name}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Built With</Text>
            <View style={styles.techGrid}>
              {techStack.map((tech, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(600 + index * 100).springify()}
                  style={styles.techItem}
                >
                  <Text style={styles.techIcon}>{tech.icon}</Text>
                  <Text style={styles.techName}>{tech.name}</Text>
                </Animated.View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(1000 + index * 80).springify()}
                style={styles.featureItem}
              >
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInDown.delay(1600).springify()}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>← Go Back</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  emoji: {
    fontSize: hp(6),
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: hp(3.5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    lineHeight: hp(2.8),
    marginBottom: 30,
  },
  userInfo: {
    backgroundColor: theme.colors.grayBG,
    padding: 16,
    borderRadius: theme.radius.lg,
    marginBottom: 30,
    alignItems: "center",
  },
  userInfoTitle: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.6),
    fontWeight: theme.fontWeights.medium,
    marginBottom: 8,
  },
  currentUser: {
    fontSize: hp(2.2),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.semibold,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: hp(2.5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    marginBottom: 16,
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  techItem: {
    backgroundColor: theme.colors.grayBG,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    minWidth: wp(40),
  },
  techIcon: {
    fontSize: hp(2.2),
    marginRight: 8,
  },
  techName: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.medium,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingRight: 20,
  },
  featureIcon: {
    fontSize: hp(2),
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: hp(1.9),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.medium,
    lineHeight: hp(2.5),
  },
  backButton: {
    backgroundColor: theme.colors.neutral(0.9),
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.radius.lg,
    alignSelf: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: theme.colors.white,
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semibold,
    textAlign: "center",
  },
});

export default AboutScreen;
