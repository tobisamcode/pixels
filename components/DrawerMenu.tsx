import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout, setBiometricEnabled } from "@/store/userSlice";
import { biometricService, BiometricCapabilities } from "@/services/biometric";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const DrawerMenu = ({ isVisible, onClose }: DrawerMenuProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, biometricEnabled, biometricType } = useAppSelector(
    (state) => state.user
  );
  const [biometricCapabilities, setBiometricCapabilities] =
    React.useState<BiometricCapabilities | null>(null);

  React.useEffect(() => {
    if (isVisible) {
      checkBiometricSupport();
    }
  }, [isVisible]);

  const checkBiometricSupport = async () => {
    const capabilities = await biometricService.checkBiometricCapabilities();
    setBiometricCapabilities(capabilities);
  };

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      translateX.value = withTiming(0, { duration: 300 });
      overlayOpacity.value = withTiming(0.5, { duration: 300 });
    } else {
      translateX.value = withTiming(-DRAWER_WIDTH, { duration: 300 });
      overlayOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    router.replace("/");
  };

  const navigateToAbout = () => {
    onClose();
    router.push("/about");
  };

  const toggleBiometric = async () => {
    if (!biometricCapabilities?.isAvailable) {
      Alert.alert(
        "Biometric Not Available",
        biometricCapabilities?.hasHardware
          ? "Please enroll biometric authentication in your device settings first."
          : "Your device doesn't support biometric authentication."
      );
      return;
    }

    if (biometricEnabled) {
      // Disable biometric
      Alert.alert(
        "Disable Biometric Login",
        `Are you sure you want to disable ${biometricType} login?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => {
              dispatch(
                setBiometricEnabled({ enabled: false, biometricType: "" })
              );
            },
          },
        ]
      );
    } else {
      // Enable biometric - first authenticate
      const result = await biometricService.authenticateWithBiometrics();
      if (result.success) {
        dispatch(
          setBiometricEnabled({
            enabled: true,
            biometricType: biometricCapabilities.biometricType,
          })
        );
        Alert.alert(
          "Biometric Login Enabled",
          `${biometricCapabilities.biometricType} login has been enabled for quick access.`
        );
      } else {
        Alert.alert(
          "Authentication Failed",
          result.error || "Could not verify biometric authentication"
        );
      }
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: "🏠",
      onPress: onClose,
    },
    {
      title: "Account Settings",
      icon: "⚙️",
      onPress: () => {},
    },
    {
      title: "Transaction History",
      icon: "📊",
      onPress: () => {},
    },
    {
      title: "Security",
      icon: "🔒",
      onPress: () => {},
    },
    {
      title: "Help & Support",
      icon: "❓",
      onPress: () => {},
    },
    {
      title: "About",
      icon: "ℹ️",
      onPress: navigateToAbout,
    },
  ];

  const biometricMenuItem = {
    title: biometricEnabled
      ? `Disable ${biometricType}`
      : `Enable ${biometricCapabilities?.biometricType || "Biometric"} Login`,
    icon: biometricCapabilities
      ? biometricService.getBiometricIcon(biometricCapabilities.supportedTypes)
      : "🔐",
    onPress: toggleBiometric,
    isToggle: true,
    enabled: biometricEnabled,
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <Pressable style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userSubtitle}>Premium Member</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </Pressable>
          ))}

          {/* Biometric Setting */}
          {biometricCapabilities?.hasHardware && (
            <Pressable
              style={[
                styles.menuItem,
                biometricCapabilities?.isAvailable
                  ? {}
                  : styles.menuItemDisabled,
              ]}
              onPress={biometricMenuItem.onPress}
              disabled={!biometricCapabilities?.isAvailable}
            >
              <Text style={styles.menuIcon}>{biometricMenuItem.icon}</Text>
              <Text
                style={[
                  styles.menuTitle,
                  biometricCapabilities?.isAvailable
                    ? {}
                    : styles.menuTitleDisabled,
                ]}
              >
                {biometricMenuItem.title}
              </Text>
              <View
                style={[
                  styles.toggleSwitch,
                  biometricEnabled ? styles.toggleSwitchActive : {},
                ]}
              >
                <View
                  style={[
                    styles.toggleSwitchThumb,
                    biometricEnabled ? styles.toggleSwitchThumbActive : {},
                  ]}
                />
              </View>
            </Pressable>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>

          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.copyright}>© 2024 Mobile Assessment</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: theme.colors.neutral(0.9),
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: hp(3),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: hp(2.4),
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: hp(1.6),
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: theme.fontWeights.medium,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuIcon: {
    fontSize: hp(2.5),
    marginRight: 16,
    width: 30,
  },
  menuTitle: {
    flex: 1,
    fontSize: hp(2),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.medium,
  },
  menuArrow: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.4),
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuTitleDisabled: {
    color: theme.colors.neutral(0.4),
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.neutral(0.3),
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleSwitchActive: {
    backgroundColor: "#4CAF50",
  },
  toggleSwitchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
  },
  toggleSwitchThumbActive: {
    alignSelf: "flex-end",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    marginBottom: 20,
  },
  logoutIcon: {
    fontSize: hp(2.2),
    marginRight: 12,
  },
  logoutText: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.semibold,
  },
  appInfo: {
    alignItems: "center",
  },
  appVersion: {
    fontSize: hp(1.4),
    color: theme.colors.neutral(0.5),
    fontWeight: theme.fontWeights.medium,
    marginBottom: 4,
  },
  copyright: {
    fontSize: hp(1.3),
    color: theme.colors.neutral(0.4),
    fontWeight: theme.fontWeights.medium,
  },
});

export default DrawerMenu;
