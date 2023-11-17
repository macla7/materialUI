import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import TimeAndDatePicker from "./TimeAndDatePicker";

function TimeAndDateScreen({ route, navigation }) {
  const { initStart, initEnd, returnScreen } = route.params;
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ paddingTop: headerHeight - 5 }}>
          <ScrollView
            style={{
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <Text>Start time</Text>
            <TimeAndDatePicker initDate={initStart} shiftTime="start" />
            <Text>End time</Text>
            <TimeAndDatePicker initDate={initEnd} shiftTime="end" />
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate("Add Shift", {
                  returnScreen: "Create Post",
                });
              }}
              style={{
                marginTop: 15,
              }}
            >
              Done
            </Button>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default TimeAndDateScreen;
