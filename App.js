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
import { grandTheme } from "./src/app/themeExtenders";

import AuthStackScreen from "./src/components/authFlow/AuthStackScreen";

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <PaperProvider theme={grandTheme}>
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
