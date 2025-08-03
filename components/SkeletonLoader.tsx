import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0.3, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.neutral(0.15),
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const BankCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <Animated.View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Skeleton width={120} height={16} />
          <Skeleton width={80} height={14} />
        </View>

        {/* Chip */}
        <Skeleton
          width={40}
          height={28}
          borderRadius={6}
          style={{ marginTop: 20 }}
        />

        {/* Account Number */}
        <Skeleton width={180} height={20} style={{ marginTop: 20 }} />

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View>
            <Skeleton width={90} height={12} />
            <Skeleton width={120} height={24} style={{ marginTop: 8 }} />
          </View>
          <Skeleton width={40} height={16} />
        </View>
      </Animated.View>
    </View>
  );
};

export const BankCardsSkeleton = () => {
  return (
    <View style={styles.cardsContainer}>
      <BankCardSkeleton />
      <BankCardSkeleton />
      <BankCardSkeleton />
    </View>
  );
};

export const AppLoadingSkeleton = () => {
  return (
    <View style={styles.appLoadingContainer}>
      <View style={styles.appContent}>
        {/* Logo/Icon placeholder */}
        <Skeleton
          width={80}
          height={80}
          borderRadius={40}
          style={{ marginBottom: 30 }}
        />

        {/* Title */}
        <Skeleton width={200} height={32} style={{ marginBottom: 16 }} />

        {/* Subtitle */}
        <Skeleton width={280} height={18} style={{ marginBottom: 40 }} />

        {/* Button */}
        <Skeleton width={160} height={48} borderRadius={24} />
      </View>
    </View>
  );
};

export const QuickActionsSkeleton = () => {
  const actions = Array.from({ length: 4 });

  return (
    <View style={styles.actionsContainer}>
      {actions.map((_, index) => (
        <View key={index} style={styles.actionItem}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <View style={styles.actionContent}>
            <Skeleton width={120} height={16} style={{ marginBottom: 6 }} />
            <Skeleton width={200} height={14} />
          </View>
          <Skeleton width={16} height={16} />
        </View>
      ))}
    </View>
  );
};

export const LoginFormSkeleton = () => {
  return (
    <View style={styles.loginFormContainer}>
      {/* Title */}
      <Skeleton
        width={150}
        height={32}
        style={{ marginBottom: 16, alignSelf: "center" }}
      />

      {/* Subtitle */}
      <Skeleton
        width={280}
        height={18}
        style={{ marginBottom: 40, alignSelf: "center" }}
      />

      {/* Username field */}
      <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
      <Skeleton
        width="100%"
        height={48}
        borderRadius={8}
        style={{ marginBottom: 16 }}
      />

      {/* Password field */}
      <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
      <Skeleton
        width="100%"
        height={48}
        borderRadius={8}
        style={{ marginBottom: 24 }}
      />

      {/* Login button */}
      <Skeleton
        width="100%"
        height={48}
        borderRadius={24}
        style={{ marginBottom: 20 }}
      />

      {/* Footer text */}
      <Skeleton width={240} height={12} style={{ alignSelf: "center" }} />
    </View>
  );
};

export const DrawerMenuSkeleton = () => {
  const menuItems = Array.from({ length: 6 });

  return (
    <View style={styles.drawerContainer}>
      {/* Profile Header */}
      <View style={styles.drawerHeader}>
        <Skeleton width={60} height={60} borderRadius={30} />
        <View style={styles.drawerUserInfo}>
          <Skeleton width={60} height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={120} height={20} style={{ marginBottom: 6 }} />
          <Skeleton width={80} height={12} />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.drawerMenuItems}>
        {menuItems.map((_, index) => (
          <View key={index} style={styles.drawerMenuItem}>
            <Skeleton width={20} height={20} />
            <Skeleton width={140} height={16} style={{ marginLeft: 16 }} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 16,
  },
  card: {
    width: wp(85),
    height: hp(25),
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.xl,
    padding: 24,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  appLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: wp(10),
  },
  appContent: {
    alignItems: "center",
  },
  actionsContainer: {
    paddingHorizontal: 24,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.grayBG,
    padding: 20,
    borderRadius: theme.radius.lg,
    marginBottom: 12,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  loginFormContainer: {
    width: "100%",
    paddingHorizontal: wp(10),
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: hp(6),
    paddingHorizontal: 24,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  drawerUserInfo: {
    marginLeft: 16,
    flex: 1,
  },
  drawerMenuItems: {
    flex: 1,
  },
  drawerMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral(0.1),
  },
});
