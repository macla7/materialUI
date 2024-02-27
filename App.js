import React from "react";
import { StatusBar } from "expo-status-bar";
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
