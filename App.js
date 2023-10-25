import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Button,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import store from "./src/app/store";
import { Provider } from "react-redux";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

import AuthStackScreen from "./src/components/authFlow/AuthStackScreen";

const PlaceholderImage = require("./assets/images/background-image.png");

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(0, 110, 29)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(153, 248, 149)",
    onPrimaryContainer: "rgb(0, 34, 4)",
    secondary: "rgb(82, 99, 79)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(213, 232, 207)",
    onSecondaryContainer: "rgb(16, 31, 15)",
    tertiary: "rgb(56, 101, 106)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(188, 235, 241)",
    onTertiaryContainer: "rgb(0, 32, 35)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(252, 253, 246)",
    onBackground: "rgb(26, 28, 25)",
    surface: "rgb(252, 253, 246)",
    onSurface: "rgb(26, 28, 25)",
    surfaceVariant: "rgb(222, 229, 216)",
    onSurfaceVariant: "rgb(66, 73, 64)",
    outline: "rgb(114, 121, 111)",
    outlineVariant: "rgb(194, 201, 189)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(47, 49, 45)",
    inverseOnSurface: "rgb(240, 241, 235)",
    inversePrimary: "rgb(126, 219, 124)",
    elevation: {
      level0: "transparent",
      level1: "rgb(239, 246, 235)",
      level2: "rgb(232, 242, 229)",
      level3: "rgb(224, 237, 222)",
      level4: "rgb(222, 236, 220)",
      level5: "rgb(217, 233, 216)",
    },
    surfaceDisabled: "rgba(26, 28, 25, 0.12)",
    onSurfaceDisabled: "rgba(26, 28, 25, 0.38)",
    backdrop: "rgba(44, 50, 42, 0.4)",
    customPink: "rgb(155, 64, 84)",
    onCustomPink: "rgb(255, 255, 255)",
    customPinkContainer: "rgb(255, 217, 222)",
    onCustomPinkContainer: "rgb(64, 0, 20)",
    customPurple: "rgb(120, 69, 172)",
    onCustomPurple: "rgb(255, 255, 255)",
    customPurpleContainer: "rgb(240, 219, 255)",
    onCustomPurpleContainer: "rgb(44, 0, 81)",
    customBlue: "rgb(0, 103, 125)",
    onCustomBlue: "rgb(255, 255, 255)",
    customBlueContainer: "rgb(179, 235, 255)",
    onCustomBlueContainer: "rgb(0, 31, 39)",
    customYellow: "rgb(103, 96, 0)",
    onCustomYellow: "rgb(255, 255, 255)",
    customYellowContainer: "rgb(242, 230, 106)",
    onCustomYellowContainer: "rgb(31, 28, 0)",
    customOrange: "rgb(137, 81, 0)",
    onCustomOrange: "rgb(255, 255, 255)",
    customOrangeContainer: "rgb(255, 220, 188)",
    onCustomOrangeContainer: "rgb(44, 23, 0)",
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AuthStackScreen />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
