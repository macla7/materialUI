import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getResetPasswordInstructionsAsync } from "./passwordSlice";
// import {
//   Center,
//   Box,
//   Heading,
//   VStack,
//   FormControl,
//   Input,
//   Button,
//   HStack,
//   Text,
//   Pressable,
// } from "native-base";
import { Keyboard } from "react-native";
import { selectEmailValidity, emailIsNoLongerValid } from "./passwordSlice";

function EmailForm({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(null);
  const emailValidity = useSelector(selectEmailValidity);

  function submit() {
    const userDetails = {
      user: {
        email: email,
      },
      commit: "Send me reset password instructions",
    };
    dispatch(getResetPasswordInstructionsAsync(userDetails));
  }

  useEffect(() => {
    if (emailValidity) {
      dispatch(emailIsNoLongerValid());
      navigation.navigate("Token");
    } else if (emailValidity == false) {
      setErrors("There is no account for this email.");
    }
  }, [dispatch, emailValidity]);

  const validate = () => {
    let valid = true;

    if (email === "") {
      setErrors("Please enter your email address");
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
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="myDarkGrayText">
            Forgot Password
          </Heading>
          <Heading mt="1" color="myMidGrayText" fontWeight="medium" size="xs">
            Enter email to recieve reset password instructions.
          </Heading>

          <VStack space={3}>
            <FormControl isRequired isInvalid={errors}>
              {errors ? (
                <FormControl.ErrorMessage>{errors}</FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText> </FormControl.HelperText>
              )}
              <FormControl.Label>Email ID</FormControl.Label>
              <Input
                type="email"
                value={email}
                borderColor={errors ? "error.600" : "muted.300"}
                onChange={(e) => {
                  setEmail(e.nativeEvent.text);
                  setErrors(null);
                }}
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

export default EmailForm;
