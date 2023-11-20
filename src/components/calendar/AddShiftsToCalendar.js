import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { setDate, selectDate, createShiftAsync } from "../shifts/shiftSlice";
import { useDispatch, useSelector } from "react-redux";
import { addDays, set, addMinutes, addHours } from "date-fns";
import { selectUserId } from "../sessions/sessionSlice";

function AddShiftsToCalendar({ navigation }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const date = new Date(useSelector(selectDate));
  const userId = useSelector(selectUserId);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1,
        justifyContent: "center",
        height: 200,
        alignItems: "center",
      }}
    >
      <Button
        mode="contained"
        buttonColor={theme.shifts.AM.container}
        textColor={theme.shifts.AM.color}
        onPress={() => {
          let newDate = addDays(new Date(date), 1).toString();
          let shiftDetails = {
            user_id: userId,
            description: "",
            start: set(new Date(date), { hours: 7, minutes: 0 }),
            end: set(new Date(date), { hours: 13, minutes: 30 }),
            position: 0,
          };
          dispatch(setDate(newDate));
          dispatch(createShiftAsync(shiftDetails));
        }}
      >
        AM
      </Button>
      <Button
        mode="contained"
        buttonColor={theme.shifts.PM.container}
        textColor={theme.shifts.PM.color}
        style={{ marginLeft: 5 }}
        onPress={() => {
          let newDate = addDays(new Date(date), 1).toString();
          let shiftDetails = {
            user_id: userId,
            description: "",
            start: set(new Date(date), { hours: 13, minutes: 0 }),
            end: set(new Date(date), { hours: 21, minutes: 30 }),
            position: 1,
          };
          dispatch(setDate(newDate));
          dispatch(createShiftAsync(shiftDetails));
        }}
      >
        PM
      </Button>
      <Button
        mode="contained"
        buttonColor={theme.shifts.Night.container}
        textColor={theme.shifts.Night.color}
        style={{ marginLeft: 5 }}
        onPress={() => {
          let newDate = addDays(new Date(date), 1).toString();
          let newStart = set(new Date(date), { hours: 21, minutes: 0 });
          let newEnd = addMinutes(newStart, 30);
          newEnd = addHours(newEnd, 10);
          let shiftDetails = {
            user_id: userId,
            description: "",
            start: newStart,
            end: newEnd,
            position: 2,
          };
          dispatch(setDate(newDate));
          dispatch(createShiftAsync(shiftDetails));
        }}
      >
        Night
      </Button>
      {/* <Button
        mode="contained"
        buttonColor={theme.shifts.Custom.container}
        textColor={theme.shifts.Custom.color}
        onPress={() => {
          let newDate = addDays(new Date(date), 1).toString();
          let shiftDetails = {
            user_id: userId,
            description: "",
            start: set(new Date(date), { hours: 7, minutes: 0 }),
            end: set(new Date(date), { hours: 15, minutes: 30 }),
            position: 4,
          };
          dispatch(setDate(newDate));
          dispatch(createShiftAsync(shiftDetails));
        }}
      >
        Custom
      </Button> */}
      {/* <Button
        mode="contained"
        buttonColor={theme.shifts.Off.container}
        textColor={theme.shifts.Off.color}
        onPress={() => {
          let newDate = addDays(new Date(date), 1).toString();
          let shiftDetails = {
            user_id: userId,
            description: "",
            start: set(new Date(date), { hours: 7, minutes: 0 }),
            end: set(new Date(date), { hours: 15, minutes: 30 }),
            position: 5,
          };
          dispatch(setDate(newDate));
          dispatch(createShiftAsync(shiftDetails));
        }}
      >
        Off
      </Button> */}
    </View>
  );
}

export default AddShiftsToCalendar;
