import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { setStart, setEnd } from "./shiftSlice";

function TimeAndDatePicker({ initDate, shiftTime }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(Platform.OS === "ios");
  const [date, setDate] = useState(new Date(Date.now()));

  useEffect(() => {
    setDate(new Date(initDate));
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    returnParams(currentDate);
  };

  function returnParams(currentDate) {
    switch (shiftTime) {
      case "start":
        return dispatch(setStart(currentDate.toString()));
      case "end":
        return dispatch(setEnd(currentDate.toString()));
    }
  }

  return (
    <View>
      {show && (
        <DateTimePicker
          textColor="#1f2937"
          // minimumDate={new Date(Date.now())}
          minuteInterval={5}
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}

      <SegmentedButtons
        value={mode}
        onValueChange={(value) => setMode(value)}
        buttons={[
          {
            value: "date",
            label: format(new Date(date), "EEEE do LLL"),
          },
          {
            value: "time",
            label: format(new Date(date), "p"),
          },
        ]}
      />
    </View>
  );
}

export default TimeAndDatePicker;
