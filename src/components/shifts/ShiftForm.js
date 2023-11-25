import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProShifts,
  selectStart,
  selectEnd,
  selectPosition,
  selectDescription,
  setStart,
  setEnd,
  setPosition,
  setDescription,
  updateShiftAsync,
  fetchShiftsForMonthAsync,
} from "./shiftSlice";
import { format, compareAsc, addMinutes } from "date-fns";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Text,
  SegmentedButtons,
  Button,
  HelperText,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { setMinutes, setHours, addHours } from "date-fns";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { selectUserId } from "../sessions/sessionSlice";

// Design is to be able to add multiple shifts to a post
function ShiftForm({ navigation, route }) {
  const dispatch = useDispatch();
  const { returnScreen, id } = route.params;
  const userId = useSelector(selectUserId);
  const position = useSelector(selectPosition);
  const description = useSelector(selectDescription);
  const start = useSelector(selectStart);
  const end = useSelector(selectEnd);
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
    if (areAllValuesNull(errors) && areAllValuesNull(newErrors)) {
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
      user_id: userId,
      position: position,
      start: start.toString(),
      end: end.toString(),
      description: description,
      status: 1,
    };

    if (returnScreen == "Calendar") {
      // dispatch create shift!!
      const shiftForUpdate = {
        id: id,
        position: position,
        start: start,
        end: end,
        description: description,
        user_id: userId,
      };
      dispatch(updateShiftAsync(shiftForUpdate))
        .then(() => {
          // Assuming userId and formattedDate are correct, adjust as needed
          const formattedDate = format(new Date(start), "yyyy-MM");
          dispatch(fetchShiftsForMonthAsync({ userId, month: formattedDate }));
        })
        .catch((error) => {
          console.error("An error occurred during shift destruction:", error);
          // Handle error as needed
        });
    } else {
      dispatch(createProShifts([shift]));
    }
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
        <View style={{ paddingTop: headerHeight - 5, flex: 1 }}>
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
              onChangeText={(value) => dispatch(setDescription(value))}
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
              onValueChange={(value) => {
                setErrors({ ...errors, end: null });
                dispatch(setPosition(value));
              }}
              buttons={[
                {
                  value: "AM",
                  label: "AM",
                  onPress: () => setAM(new Date(start)),
                },
                {
                  value: "PM",
                  label: "PM",
                  onPress: () => setPM(new Date(start)),
                },
                {
                  value: "Night",
                  label: "Night",
                  onPress: () => setNight(new Date(start)),
                },
                {
                  value: "Custom",
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
            <HelperText type="error" visible={errors.end !== undefined}>
              {errors["end"]}
            </HelperText>

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
