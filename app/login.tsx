import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError, setBiometricEnabled } from "@/store/userSlice";
import { biometricService, BiometricCapabilities } from "@/services/biometric";
import { LoginFormSkeleton } from "@/components/SkeletonLoader";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [biometricCapabilities, setBiometricCapabilities] =
    useState<BiometricCapabilities | null>(null);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, biometricEnabled, biometricType } = useAppSelector(
    (state) => state.user
  );

  React.useEffect(() => {
    dispatch(clearError());

    checkBiometricSupport();
  }, [dispatch]);

  const checkBiometricSupport = async () => {
    const capabilities = await biometricService.checkBiometricCapabilities();
    setBiometricCapabilities(capabilities);
  };

  const handleLogin = async () => {
    if (username.trim().length < 2) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid username (at least 2 characters)"
      );
      return;
    }

    if (password.trim().length < 1) {
      Alert.alert("Invalid Input", "Please enter a password");
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          username: username.trim(),
          password: password.trim(),
        })
      );

      if (loginUser.fulfilled.match(result)) {
        if (biometricCapabilities?.isAvailable && !biometricEnabled) {
          setShowBiometricSetup(true);
        } else {
          setTimeout(() => {
            router.replace("/home");
          }, 100);
        }
      }
    } catch (err) {}
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await biometricService.authenticateWithBiometrics();

      if (result.success) {
        Alert.alert("Success", "Biometric authentication successful!", [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                router.replace("/home");
              }, 100);
            },
          },
        ]);
      } else {
        Alert.alert(
          "Authentication Failed",
          result.error || "Biometric authentication failed"
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during biometric authentication");
    }
  };

  const handleBiometricSetup = (enable: boolean) => {
    if (enable && biometricCapabilities) {
      dispatch(
        setBiometricEnabled({
          enabled: true,
          biometricType: biometricCapabilities.biometricType,
        })
      );
      Alert.alert(
        "Biometric Authentication Enabled",
        `You can now use ${biometricCapabilities.biometricType} to sign in quickly.`,
        [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                router.replace("/home");
              }, 100);
            },
          },
        ]
      );
    } else {
      setTimeout(() => {
        router.replace("/home");
      }, 100);
    }
    setShowBiometricSetup(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.header}
        >
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Please enter your login credentials to get started
          </Text>
        </Animated.View>

        {loading ? (
          <LoginFormSkeleton />
        ) : (
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            style={styles.formContainer}
          >
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={theme.colors.neutral(0.5)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.neutral(0.5)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <Pressable
              style={[
                styles.loginButton,
                {
                  opacity:
                    username.trim().length < 2 || password.trim().length < 1
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={handleLogin}
              disabled={
                username.trim().length < 2 || password.trim().length < 1
              }
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Biometric Login Button */}
        {!loading && biometricEnabled && biometricCapabilities?.isAvailable && (
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Pressable
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Text style={styles.biometricIcon}>
                {biometricService.getBiometricIcon(
                  biometricCapabilities.supportedTypes
                )}
              </Text>
              <Text style={styles.biometricText}>
                Sign in with {biometricType}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {!loading && (
          <Animated.Text
            entering={FadeInDown.delay(600).springify()}
            style={styles.footerText}
          >
            Test credentials: john.doe, jane.smith, or demo (any password)
          </Animated.Text>
        )}

        {/* Biometric Setup Modal */}
        {showBiometricSetup && (
          <View style={styles.modalOverlay}>
            <Animated.View
              entering={FadeInDown.duration(300).springify()}
              style={styles.modalContainer}
            >
              <Text style={styles.modalTitle}>Enable Biometric Login</Text>
              <Text style={styles.modalIcon}>
                {biometricCapabilities &&
                  biometricService.getBiometricIcon(
                    biometricCapabilities.supportedTypes
                  )}
              </Text>
              <Text style={styles.modalText}>
                Would you like to use {biometricCapabilities?.biometricType} for
                quick and secure sign-in?
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => handleBiometricSetup(false)}
                >
                  <Text style={styles.modalButtonText}>Not Now</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={() => handleBiometricSetup(true)}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      styles.modalButtonTextPrimary,
                    ]}
                  >
                    Enable
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  emoji: {
    fontSize: hp(6),
    marginBottom: 20,
  },
  title: {
    fontSize: hp(4.5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.6),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    lineHeight: hp(2.6),
  },
  formContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: hp(2.2),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 12,
  },
  input: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: hp(2.2),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.medium,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "transparent",
  },
  loginButton: {
    backgroundColor: theme.colors.neutral(0.9),
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
    alignItems: "center",
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.semibold,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.grayBG,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: theme.radius.lg,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.colors.neutral(0.2),
  },
  biometricIcon: {
    fontSize: hp(3),
    marginRight: 12,
  },
  biometricText: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.semibold,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: 24,
    alignItems: "center",
    maxWidth: wp(85),
    width: "100%",
  },
  modalTitle: {
    fontSize: hp(2.8),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    marginBottom: 16,
    textAlign: "center",
  },
  modalIcon: {
    fontSize: hp(6),
    marginBottom: 16,
  },
  modalText: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    lineHeight: hp(2.6),
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.neutral(0.3),
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.neutral(0.9),
    borderColor: theme.colors.neutral(0.9),
  },
  modalButtonText: {
    fontSize: hp(1.9),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.semibold,
  },
  modalButtonTextPrimary: {
    color: theme.colors.white,
  },
  footerText: {
    fontSize: hp(1.6),
    color: theme.colors.neutral(0.5),
    textAlign: "center",
    fontWeight: theme.fontWeights.medium,
  },
});

export default LoginScreen;
