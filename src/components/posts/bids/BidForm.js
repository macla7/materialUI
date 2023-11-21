import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import { AgendaList, CalendarProvider } from "react-native-calendars";
import AgendaItem from "../../calendar/mocks/AgendaItem";
import {
  formatISO,
  formatDistanceStrict,
  format,
  parseISO,
  isBefore,
  addDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  fetchShiftsAsync,
  selectCurrentShifts,
  selectDate,
  setDate,
  fetchShiftsForMonthAsync,
} from "../../shifts/shiftSlice";
import {
  getTheme,
  themeColor,
  lightThemeColor,
} from "../../calendar/mocks/theme";
import { selectUserId } from "../../sessions/sessionSlice";

function BidForm({ navigation, route }) {
  const { postId } = route.params;
  const date = useSelector(selectDate);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const currentShifts = useSelector(selectCurrentShifts);
  const [agendaShifts, setAgendaShifts] = useState([]);
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  useEffect(() => {
    dispatch(fetchShiftsAsync(userId));
  }, []);

  useEffect(() => {
    setAgendaShifts(transformShiftsToAgendaItems(currentShifts));
  }, [currentShifts]);

  function transformShiftsToAgendaItems(shifts) {
    return shifts.map((shift) => {
      const startDate = new Date(shift.start);
      const outerTitle = formatISO(startDate, {
        representation: "date",
      });
      const endDate = new Date(shift.end);
      const durationInHours = formatDistanceStrict(endDate, startDate);

      // Create an array with a single entry for the entire event duration
      const shiftData = [
        {
          hour: format(new Date(startDate), "p"),
          duration: durationInHours,
          title: shift.description,
          position: shift.position,
          id: shift.id,
          start: shift.start,
          end: shift.end,
          status: shift.status,
        },
      ];

      // Return a single object for the original event
      return { title: outerTitle, data: shiftData };
    });
  }

  const renderItem = useCallback(({ item }) => {
    return (
      <AgendaItem
        item={item}
        navigation={navigation}
        offering={true}
        postId={postId}
      />
    );
  }, []);

  return (
    <CalendarProvider
      date={formatISO(new Date(date), {
        representation: "date",
      })}
      onDateChanged={(value) => {
        dispatch(setDate(new Date(value).toString()));
      }}
      onMonthChange={(date) => onMonthChange(date)}
      showTodayButton
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      // todayBottomMargin={16}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Appbar.Header>
        <Appbar.Content title="Offer Shift" />
        <Appbar.Action icon="plus" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header> */}

      <AgendaList
        avoidDateUpdates
        sections={agendaShifts}
        renderItem={renderItem}
        sectionStyle={{
          paddingTop: 10,
          paddingBottom: 10,
          color: "grey",
          textTransform: "capitalize",
        }}
        // scrollToNextEvent

        // dayFormat={'yyyy-MM-d'}
      />
    </CalendarProvider>
  );
}

export default BidForm;
