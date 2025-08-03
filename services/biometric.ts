import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  biometricType: string;
}

class BiometricService {
  /**
   * Check if biometric authentication is available on the device
   */
  async checkBiometricCapabilities(): Promise<BiometricCapabilities> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      const biometricType = this.getBiometricTypeName(supportedTypes);
      const isAvailable = hasHardware && isEnrolled;

      return {
        isAvailable,
        hasHardware,
        isEnrolled,
        supportedTypes,
        biometricType,
      };
    } catch (error) {
      console.error("Error checking biometric capabilities:", error);
      return {
        isAvailable: false,
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
        biometricType: "Not Available",
      };
    }
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticateWithBiometrics(): Promise<BiometricAuthResult> {
    try {
      const capabilities = await this.checkBiometricCapabilities();

      if (!capabilities.isAvailable) {
        return {
          success: false,
          error: capabilities.hasHardware
            ? "No biometric authentication is enrolled on this device"
            : "Biometric hardware is not available on this device",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your account",
        cancelLabel: "Cancel",
        fallbackLabel: "Use Password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
          biometricType: capabilities.biometricType,
        };
      } else {
        return {
          success: false,
          error: result.error || "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return {
        success: false,
        error: "An error occurred during biometric authentication",
      };
    }
  }

  /**
   * Get a user-friendly name for the biometric type
   */
  private getBiometricTypeName(
    types: LocalAuthentication.AuthenticationType[]
  ): string {
    if (types.length === 0) return "Not Available";

    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      return "Face ID";
    }

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return "Fingerprint";
    }

    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "Iris Recognition";
    }

    return "Biometric Authentication";
  }

  /**
   * Get biometric icon based on available types
   */
  getBiometricIcon(types: LocalAuthentication.AuthenticationType[]): string {
    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      return "👤"; // Face ID
    }

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return "👆"; // Fingerprint
    }

    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "👁️"; // Iris
    }

    return "🔐"; // Generic biometric
  }
}

export const biometricService = new BiometricService();
