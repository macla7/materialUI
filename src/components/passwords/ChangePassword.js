import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   Center,
//   Box,
//   Heading,
//   VStack,
//   FormControl,
//   Input,
//   Button,
//   Pressable,
// } from "native-base";
import { Keyboard } from "react-native";
import {
  selectPasswordValidity,
  passwordIsNoLongerValid,
  changePasswordAsync,
  selectEmail,
  clearChangePasswordEmail,
  selectFlashMessage,
  clearFlashMessage,
} from "./passwordSlice";
import { loginUserAsync } from "../sessions/sessionSlice";

function ChangePassword({ route, navigation }) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState(null);
  const { resetToken } = route.params;
  const passwordValidity = useSelector(selectPasswordValidity);
  const email = useSelector(selectEmail);
  const flashMessage = useSelector(selectFlashMessage);

  function submit() {
    const userDetails = {
      user: {
        password: password,
        password_confirmation: passwordConfirmation,
        reset_password_token: resetToken,
      },
    };
    dispatch(changePasswordAsync(userDetails));
  }

  useEffect(() => {
    if (passwordValidity) {
      dispatch(passwordIsNoLongerValid());

      const loginUserDetails = {
        email: email,
        password: password,
      };

      dispatch(loginUserAsync(loginUserDetails));
      clearChangePasswordEmail();
      clearFlashMessage();
    } else if (passwordValidity == false) {
      setErrors(flashMessage);
    }
  }, [dispatch, passwordValidity, flashMessage]);

  useEffect(() => {
    dispatch(clearFlashMessage());
  }, []);

  const validate = () => {
    let valid = true;

    if (passwordConfirmation !== password) {
      setErrors("Your passwords are not the same.");
      valid = false;
    }
    if (passwordConfirmation === "") {
      setErrors("Please confirm your password.");
      valid = false;
    }
    if (password === "") {
      setErrors("Please enter a password.");
      valid = false;
    }

    if (valid) {
      submit();
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = () => {
    validate() ? console.log("Submitted") : console.log("Validation Failed");
  };

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="myDarkGrayText" fontWeight="semibold">
            Change Password
          </Heading>
          <Heading mt="1" color="myMidGrayText" fontWeight="medium" size="xs">
            Add numbers and symbols to make password more secure
          </Heading>
          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={errors}>
              {errors ? (
                <FormControl.ErrorMessage>{errors}</FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText> </FormControl.HelperText>
              )}
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.nativeEvent.text)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Confirm Password</FormControl.Label>
              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.nativeEvent.text)}
              />
            </FormControl>
            <Button
              mt="2"
              variant="myButtonYellowVariant"
              onPress={() => onSubmit()}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </Center>
    </Pressable>
  );
}

export default ChangePassword;
