import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createShift,
  selectStart,
  selectEnd,
  setStart,
  setEnd,
} from "./shiftSlice";
import { format, compareAsc, addMinutes } from "date-fns";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { TextInput, Text, SegmentedButtons, Button } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { setMinutes, setHours, addHours } from "date-fns";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

// Design is to be able to add multiple shifts to a post
function ShiftForm({ navigation, route }) {
  const dispatch = useDispatch();
  const { returnScreen } = route.params;
  const [position, setPosition] = useState(0);
  const start = useSelector(selectStart);
  const end = useSelector(selectEnd);
  const [description, setDescription] = useState();
  const [errors, setErrors] = useState({});
  const headerHeight = useHeaderHeight();
  const [show, setShow] = useState(Platform.OS === "ios");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === "ios");
    setTime(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  const onSubmit = () => {
    validate() ? console.log("Submitted") : console.log("Validation Failed");
  };

  const validate = () => {
    let newErrors = {};

    checkPositionForErrors(newErrors);
    checkEndTimeForErrors(newErrors);

    setErrors({ ...errors, ...newErrors });
    if (areAllValuesNull(errors)) {
      return submitForm();
    }
  };

  const checkPositionForErrors = (newErrors) => {
    if (position === "") {
      newErrors["position"] = "Position is required";
    }
  };

  const checkEndTimeForErrors = (newErrors) => {
    if (compareAsc(new Date(end), new Date(start)) !== 1) {
      newErrors["end"] = "End time must be after the Shift starts";
    }
  };

  function areAllValuesNull(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== null) {
        return false; // At least one non-null value found
      }
    }
    return true; // All values are null
  }

  function submitForm() {
    const shift = {
      position: position,
      start: start.toString(),
      end: end.toString(),
      description: description,
    };
    dispatch(createShift(shift));

    navigation.navigate({
      name: returnScreen,
      merge: true,
    });
    return true;
  }

  function setTime(currentDate) {
    switch (position) {
      case 0:
        return setAM(currentDate);
      case 1:
        return setPM(currentDate);
      case 2:
        return setNight(currentDate);
      case 3:
        return setCustom(currentDate);
      default:
        return setCustom(currentDate);
    }
  }

  function setAM(currentDate) {
    let newStart = setMinutes(currentDate, 0);
    newStart = setHours(newStart, 7);
    addEndTime(newStart, 8);
  }

  function setPM(currentDate) {
    let newStart = setMinutes(currentDate, 0);
    newStart = setHours(newStart, 13);
    addEndTime(newStart, 8);
  }

  function setNight(currentDate) {
    let newStart = setMinutes(currentDate, 0);
    newStart = setHours(newStart, 21);
    addEndTime(newStart, 10);
  }

  function setCustom(currentDate) {
    dispatch(setStart(currentDate.toString()));
    dispatch(setEnd(currentDate.toString()));
  }

  function addEndTime(newStart, amountOfHours) {
    let newEnd = addMinutes(newStart, 30);
    newEnd = addHours(newEnd, amountOfHours);
    dispatch(setStart(newStart.toString()));
    dispatch(setEnd(newEnd.toString()));
  }

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
            <TextInput
              label="Shift Info"
              multiline
              mode="outlined"
              placeholder="Information for shift"
              style={{ height: 75, backgroundColor: "white", padding: 0 }}
              value={description}
              onChangeText={setDescription}
            />

            {Platform.OS === "ios" ? null : (
              <Button onPress={showMode}>Pick Date</Button>
            )}

            {show && (
              <DateTimePicker
                textColor="#1f2937"
                minuteInterval={5}
                testID="dateTimePicker"
                value={new Date(start)}
                mode="date"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange}
              />
            )}

            <SegmentedButtons
              value={position}
              onValueChange={setPosition}
              buttons={[
                {
                  value: 0,
                  label: "AM",
                  onPress: () => setAM(new Date(start)),
                },
                {
                  value: 1,
                  label: "PM",
                  onPress: () => setPM(new Date(start)),
                },
                {
                  value: 2,
                  label: "Night",
                  onPress: () => setNight(new Date(start)),
                },
                {
                  value: 3,
                  label: "Custom",
                  onPress: () => {
                    navigation.navigate("Time and Date", {
                      initStart: start.toString(),
                      initEnd: end.toString(),
                      returnScreen: "Add Shift",
                    });
                  },
                },
              ]}
              style={{ marginTop: 25 }}
            />

            <Text variant="titleLarge" style={{ marginTop: 25 }}>
              Shift Time
            </Text>
            <Text variant="labelLarge" style={{ marginTop: 10 }}>
              start
            </Text>
            <Text variant="bodyLarge">
              {format(new Date(start), "p - EEEE do LLL")}
            </Text>
            <Text variant="labelLarge" style={{ marginTop: 10 }}>
              end
            </Text>
            <Text variant="bodyLarge">
              {format(new Date(end), "p - EEEE do LLL")}
            </Text>

            <Button
              mode="contained"
              onPress={() => {
                onSubmit();
              }}
              style={{ marginTop: 25 }}
            >
              Done
            </Button>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default ShiftForm;
