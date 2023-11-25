import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUserAsync } from "./sessionSlice";
import { client_id } from "@env";
import {
  Text,
  TextInput,
  Checkbox,
  Button,
  HelperText,
} from "react-native-paper";
import { KeyboardAvoidingView, View, ScrollView, Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

export default function App() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [posted, setPosted] = useState(false);
  const [errors, setErrors] = useState({});
  // const [avatar, setAvatar] = useState("");
  const headerHeight = useHeaderHeight();
  const [rememberMe, setRememberMe] = useState(false);

  const validate = () => {
    let newErrors = {};

    checkNameForErrors(newErrors);
    checkEmailForErrors(newErrors);
    checkPasswordForErrors(newErrors);
    checkConfirmPasswordForErrors(newErrors);

    setErrors({ ...errors, ...newErrors });

    if (areAllValuesNull(errors) && areAllValuesNull(newErrors)) {
      setPosted(true);
      return onSubmit();
    }
  };

  function onSubmit() {
    const formData = new FormData();

    // formData.append("user[avatar]", e.target.avatar.files[0]);
    formData.append("user[name]", name);
    formData.append("user[email]", email);
    formData.append("user[password]", password);
    formData.append("user[client_id]", client_id);

    dispatch(registerUserAsync(formData));
  }

  const checkNameForErrors = (newErrors) => {
    if (name === "") {
      newErrors["name"] = "Name is required";
    }
  };

  const checkEmailForErrors = (newErrors) => {
    if (!isEmailValid(email)) {
      newErrors["email"] = "Invalid email format";
    }
    if (email === "") {
      newErrors["email"] = "Email is required";
    }
  };

  const checkPasswordForErrors = (newErrors) => {
    if (!isPasswordStrongEnough(password)) {
      newErrors["password"] =
        "Password should be at least 8 characters long and contain uppercase, lowercase, and at least one digit.";
    }
  };

  const checkConfirmPasswordForErrors = (newErrors) => {
    if (!isConfirmPasswordValid()) {
      newErrors["confirmPassword"] = "Passwords do not match";
    }
  };

  // Function to check if the email is in basic email format
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isConfirmPasswordValid = () => {
    return password === confirmPassword;
  };

  const isPasswordStrongEnough = (password) => {
    // Check if the password is at least 8 characters long and includes at least one uppercase letter, one lowercase letter, and one digit.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  function areAllValuesNull(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== null) {
        return false; // At least one non-null value found
      }
    }
    return true; // All values are null
  }

  // Function to handle the change of any input field
  const handleInputChange = (field) => (newValue) => {
    // Create a copy of the current errors state object
    const updatedErrors = { ...errors };

    // Remove the corresponding key from the copied object based on the field name
    delete updatedErrors[field];

    // Update the state with the new errors object
    setErrors(updatedErrors);
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
            <Text variant="titleSmall">Sign up to continue!</Text>

            {/* <Text>{errors.loginError}</Text> */}

            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text variant="labelLarge">Name</Text>
              <TextInput
                mode="outlined"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  handleInputChange("name")();
                }}
                error={errors["name"]}
              />
              <HelperText type="error" visible={errors["name"] !== undefined}>
                {errors.name}
              </HelperText>
            </View>

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
                  handleInputChange("email")();
                }}
                error={errors["email"]}
              />
              <HelperText type="error" visible={errors["email"] !== undefined}>
                {errors.email}
              </HelperText>
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
                  handleInputChange("password")();
                }}
                error={errors["password"]}
              />
              <HelperText
                type="error"
                visible={errors["password"] !== undefined}
              >
                {errors.password}
              </HelperText>
            </View>

            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text variant="labelLarge">Confirm Password</Text>
              <TextInput
                mode="outlined"
                value={confirmPassword}
                secureTextEntry
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  handleInputChange("confirmPassword")();
                }}
                error={errors["confirmPassword"]}
              />
              <HelperText
                type="error"
                visible={errors["confirmPassword"] !== undefined}
              >
                {errors.confirmPassword}
              </HelperText>
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
              onPress={() => {
                validate();
              }}
            >
              Sign Up
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
