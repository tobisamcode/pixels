# Quick Start Guide

Get the Mobile Assessment App running in under 5 minutes!

## ⚡ Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **iOS**: Xcode (macOS only)
- **Android**: Android Studio

## 🚀 Quick Setup

```bash
# 1. Clone and install
git clone <repository-url>
cd assessment
npm install

# 2. Install Expo CLI
npm install -g @expo/cli

# 3. Start development server
npm start
```

## 📱 Run on Device

### Using Expo Go (Easiest)

1. Install **Expo Go** from App Store/Play Store
2. Scan QR code from terminal

### Using Simulator/Emulator

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android
```

## 🧪 Test Login

Use any of these credentials:

- Username: `john.doe` (any password)
- Username: `jane.smith` (any password)
- Username: `demo` (any password)

## 🎯 Key Features to Test

1. **Login Flow** - Username/password authentication
2. **Biometric Setup** - Enable Face ID/Fingerprint after login
3. **Banking Dashboard** - Swipe through account cards
4. **Drawer Menu** - Tap hamburger menu (top-left)
5. **Settings** - Toggle biometric authentication in drawer

## 🐛 Quick Fixes

### Metro bundler issues

```bash
npm run dev  # Starts with cache cleared
```

### Install issues

```bash
npm run clean  # Clean install
```

### Check setup

```bash
npm run doctor  # Expo diagnostics
```

---
