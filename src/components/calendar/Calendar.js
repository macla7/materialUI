import React, { useRef, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import testIDs from "../mocks/testIDs";
import { agendaItems, getMarkedDates } from "../mocks/agendaItems";
import AgendaItem from "../mocks/AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "../mocks/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Calendar from "expo-calendar";
import { addDays } from "date-fns";

const ITEMS = agendaItems;

// -- Design thoughts --
// Perhaps we load the native calendar events and store in state,
// on screen/component loading. Then we fetch the 'shifts' for the
// current user, which will be a table in the db... The table in
// DB will have to be separate to posts (dont know if it was for
// MVP 1.0). As shifts will not always (often not in fact) be related
// to a post.

// The shift in the DB should be heavily based off the Event data type
// given back from the Expo Calendar package. As both will need to
// populate the Agenda/Calendar related components.
const ExpandableCalendarScreen = (props) => {
  const { weekView } = props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  // this useEffect is taken from https://docs.expo.dev/versions/latest/sdk/calendar/#event
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log("Here are all your calendars:");
        console.log({ calendars });
        const calendarIds = calendars.map((calendar) => calendar.id);
        console.log(calendars.map((calendar) => calendar.title));
        console.log("ids above");
        const currentDate = new Date();
        const calendarsEvents = await Calendar.getEventsAsync(
          calendarIds,
          currentDate,
          addDays(currentDate, 10)
        );
        console.log("Here are all your EVENTS BABY:");
        console.log({ calendarsEvents });
      }
    })();
  }, []);

  // const onDateChanged = useCallback((date, updateSource) => {
  //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  // }, []);

  // const onMonthChange = useCallback(({dateString}) => {
  //   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
  // }, []);

  const renderItem = useCallback(({ item }) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      // onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
      showTodayButton
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      // todayBottomMargin={16}
    >
      {weekView ? (
        <WeekCalendar
          testID={testIDs.weekCalendar.CONTAINER}
          firstDay={1}
          markedDates={marked.current}
        />
      ) : (
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          initialPosition={ExpandableCalendar.positions.OPEN}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          theme={{
            ...theme.current,
            // calendarBackground: "#fcfdf6",
          }}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          markedDates={marked.current}
          markingType={"multi-dot"}
          // leftArrowImageSource={
          //   <MaterialCommunityIcons
          //     name="arrow-left"
          //     color={"black"}
          //     size={26}
          //   />
          // }
          // rightArrowImageSource={
          //   <MaterialCommunityIcons
          //     name="arrow-right"
          //     color={"black"}
          //     size={26}
          //   />
          // }
          // animateScroll
          // closeOnDayPress={false}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        // scrollToNextEvent

        sectionStyle={styles.section}
        // dayFormat={'yyyy-MM-d'}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "red",
  },
  header: {
    backgroundColor: "lightgrey",
  },
  section: {
    color: "grey",
    textTransform: "capitalize",
  },
});
