import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUserAsync,
  selectLoginError,
  clearLoginError,
  selectStatus,
} from "./sessionSlice";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { Text, TextInput, Checkbox, Button } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginError = useSelector(selectLoginError);
  const [errors, setErrors] = useState({});
  const headerHeight = useHeaderHeight();
  const [rememberMe, setRememberMe] = useState(true);
  const status = useSelector(selectStatus);
  const [throbbingValue] = useState(new Animated.Value(1));

  // useEffect(() => {
  //   startThrobAnimation();
  // }, []);

  // const startThrobAnimation = () => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(throbbingValue, {
  //         toValue: 1.05,
  //         duration: 500,
  //         useNativeDriver: false,
  //       }),
  //       Animated.timing(throbbingValue, {
  //         toValue: 1,
  //         duration: 500,
  //         useNativeDriver: false,
  //       }),
  //     ])
  //   ).start();
  // };

  useEffect(() => {
    checkRememberMe();
  }, []);

  const checkRememberMe = async () => {
    try {
      const emailFromStorage = await AsyncStorage.getItem("email");
      const passwordFromStorage = await AsyncStorage.getItem("password");
      if (emailFromStorage && passwordFromStorage) {
        setEmail(emailFromStorage);
        setPassword(passwordFromStorage);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error checking Remember Me:", error);
    }
  };

  useEffect(() => {
    setErrors({ ...errors, loginError: loginError });
  }, [loginError]);

  function onSubmit() {
    const registerUserDetails = {
      email: email.toLowerCase(),
      password: password,
    };

    if (rememberMe) {
      // Save the credentials to AsyncStorage if 'Remember Me' is checked
      saveCredentials(email.toLowerCase(), password);
    } else {
      // Clear any saved credentials from AsyncStorage if 'Remember Me' is not checked
      clearCredentials();
    }

    dispatch(loginUserAsync(registerUserDetails));
  }

  const saveCredentials = async (email, password) => {
    try {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("password");
    } catch (error) {
      console.error("Error clearing credentials:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ paddingTop: headerHeight - 5 }}>
        <ScrollView
          style={{
            paddingLeft: "15%",
            paddingRight: "15%",
          }}
        >
          <View style={{ paddingTop: 60, paddingBottom: 100 }}>
            <Text variant="headlineLarge">Welcome</Text>
            <Text variant="titleSmall">Sign in to continue!</Text>

            {/* <Text>{errors.loginError}</Text> */}

            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text variant="labelLarge">Email</Text>
              <TextInput
                mode="outlined"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearLoginError();
                }}
              />
            </View>

            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text variant="labelLarge">Password</Text>
              <TextInput
                mode="outlined"
                value={password}
                secureTextEntry
                onChangeText={(text) => {
                  setPassword(text);
                  clearLoginError();
                }}
              />
            </View>

            <View
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text variant="labelLarge">Remember Me</Text>
              <Checkbox.Android
                disabled={false}
                onPress={() => setRememberMe(!rememberMe)}
                status={rememberMe ? "checked" : "unchecked"}
              />
            </View>

            <Button
              style={{ marginTop: 2, marginTop: 30 }}
              mode="contained"
              onPress={onSubmit}
            >
              Sign In
            </Button>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
              }}
            >
              <Text>I'm a new user</Text>
              <Button
                onPress={() => navigation.navigate("Register")}
                compact={true}
              >
                sign up
              </Button>
            </View>

            <Button onPress={() => navigation.navigate("EmailForm")}>
              Forgot password
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Login;
