import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import {
  Skeleton,
  BankCardSkeleton,
  BankCardsSkeleton,
  AppLoadingSkeleton,
  QuickActionsSkeleton,
  LoginFormSkeleton,
  DrawerMenuSkeleton,
} from "./SkeletonLoader";

const SkeletonDemo = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Skeleton Loader Components</Text>

      {/* Basic Skeleton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Skeleton</Text>
        <View style={styles.skeletonContainer}>
          <Skeleton width={200} height={20} style={{ marginBottom: 10 }} />
          <Skeleton width={150} height={16} style={{ marginBottom: 10 }} />
          <Skeleton width={180} height={14} />
        </View>
      </View>

      {/* Bank Card Skeleton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Card Skeleton</Text>
        <View style={styles.skeletonContainer}>
          <BankCardSkeleton />
        </View>
      </View>

      {/* Bank Cards Skeleton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Cards Row Skeleton</Text>
        <BankCardsSkeleton />
      </View>

      {/* Quick Actions Skeleton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions Skeleton</Text>
        <QuickActionsSkeleton />
      </View>

      {/* Login Form Skeleton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Login Form Skeleton</Text>
        <LoginFormSkeleton />
      </View>

      {/* App Loading Skeleton */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Loading Skeleton</Text>
        <View style={[styles.skeletonContainer, { height: 300 }]}>
          <AppLoadingSkeleton />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 20,
  },
  title: {
    fontSize: hp(3.5),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.neutral(0.9),
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 15,
  },
  skeletonContainer: {
    backgroundColor: theme.colors.grayBG,
    padding: 20,
    borderRadius: theme.radius.lg,
  },
});

export default SkeletonDemo;
