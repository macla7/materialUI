import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkResetTokenAsync } from "./passwordSlice";
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
import { selectTokenValidity, tokenIsNoLongerValid } from "./passwordSlice";

function Token({ navigation }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState(null);
  const tokenValidity = useSelector(selectTokenValidity);

  useEffect(() => {
    if (tokenValidity) {
      dispatch(tokenIsNoLongerValid());
      navigation.navigate("ChangePassword", {
        resetToken: token,
      });
    } else if (tokenValidity == false) {
      setErrors("Invalid token.");
    }
  }, [dispatch, tokenValidity]);

  const validate = () => {
    let valid = true;

    if (token === "") {
      setErrors("Please enter the token sent to your email.");
      valid = false;
    }

    if (valid) {
      dispatch(checkResetTokenAsync(token));
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
            Reset Password Token
          </Heading>
          <Heading mt="1" color="myMidGrayText" fontWeight="medium" size="xs">
            Enter token to continue!
          </Heading>
          <VStack space={3}>
            <FormControl isRequired isInvalid={errors}>
              {errors ? (
                <FormControl.ErrorMessage>{errors}</FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText> </FormControl.HelperText>
              )}
              <FormControl.Label>Token</FormControl.Label>
              <Input
                type="token"
                value={token}
                borderColor={errors ? "error.600" : "muted.300"}
                onChange={(e) => {
                  setToken(e.nativeEvent.text);
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

export default Token;
