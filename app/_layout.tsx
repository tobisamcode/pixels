import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { AppLoadingSkeleton } from "@/components/SkeletonLoader";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<AppLoadingSkeleton />} persistor={persistor}>
          <Stack
            screenOptions={{
              animation: "fade",
              animationDuration: 200,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen
              name="about"
              options={{ headerShown: true, title: "About" }}
            />
          </Stack>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default Layout;
