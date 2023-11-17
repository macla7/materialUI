import React, { useRef, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import AgendaItem from "./mocks/AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "./mocks/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Calendar from "expo-calendar";
import { Appbar, Button } from "react-native-paper";
import AddShiftsToCalendar from "./AddShiftsToCalendar";
import {
  formatISO,
  formatDistanceStrict,
  format,
  parseISO,
  isBefore,
  addDays,
} from "date-fns";
import {
  fetchShiftsAsync,
  selectCurrentShifts,
  selectDate,
  setDate,
} from "../shifts/shiftSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { grandTheme } from "../../app/themeExtenders";

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
  const customCalendarTheme = useRef(getTheme());
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const currentShifts = useSelector(selectCurrentShifts);
  const [transformedShifts, setTransformedShifts] = useState({});
  const [transformedEvents, setTransformedEvents] = useState({});
  const [agendaEvents, setAgendaEvents] = useState([]);
  const [agendaShifts, setAgendaShifts] = useState([]);
  const [mergedAgenda, setMergedAgenda] = useState([]);
  const [merged, setMerged] = useState({});
  const { weekView } = props;

  const [addingShifts, setAddingShifts] = useState(false);
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });
  const date = useSelector(selectDate);

  useEffect(() => {
    dispatch(fetchShiftsAsync(userId));
  }, []);

  useEffect(() => {
    setTransformedShifts(transformArray(currentShifts));
    setAgendaShifts(transformShiftsToAgendaItems(currentShifts));
  }, [currentShifts]);

  // this useEffect is taken from https://docs.expo.dev/versions/latest/sdk/calendar/#event
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        const calendarIds = calendars.map((calendar) => calendar.id);
        const currentDate = new Date();
        const calendarsEvents = await Calendar.getEventsAsync(
          calendarIds,
          currentDate,
          addDays(currentDate, 30)
        );
        setTransformedEvents(transformEventArray(calendarsEvents));
        setAgendaEvents(transformEventsToAgendaItems(calendarsEvents));
      }
    })();
    // need to have transformedShifts in the dependency array, due to the weird bug of transformedEvents being altered on
    //  useEffect(() => {
    //    setTransformedShifts(transformArray(currentShifts));
    //  }, [currentShifts]);
    // this somehow stops the altering of transformed events....
  }, [transformedShifts]);

  useEffect(() => {
    setMerged(mergeOutputObjects(transformedEvents, transformedShifts));
  }, [transformedShifts]);

  useEffect(() => {
    setMergedAgenda(mergeAndSortArrays(agendaEvents, agendaShifts));
  }, [agendaShifts]);

  function transformArray(inputArray) {
    const outputObject = {};

    inputArray.forEach((item) => {
      const startDate = formatISO(new Date(item.start), {
        representation: "date",
      });
      let dots = [{ color: grandTheme.shifts[item.position].dotColor }];
      if (outputObject[startDate]) {
        outputObject[startDate] = {
          dots: [...dots, ...outputObject[startDate].dots],
        };
      } else {
        outputObject[startDate] = { dots: dots };
      }
    });

    return outputObject;
  }

  function transformEventArray(inputData) {
    const outputObject = {};

    inputData.forEach((item) => {
      const startDate = new Date(item.startDate).toISOString().split("T")[0];
      let dots = [];

      if (item.availability === "busy") {
        dots.push({ color: grandTheme.personal.color });
      }

      outputObject[startDate] = { dots: dots };
    });

    return outputObject;
  }

  function mergeOutputObjects(obj1, obj2) {
    const mergedObject = { ...obj1 };

    for (const key in obj2) {
      if (mergedObject[key]) {
        // If the key already exists, combine the 'dots' arrays
        mergedObject[key].dots = mergedObject[key].dots.concat(obj2[key].dots);
      } else {
        // If the key doesn't exist, add it to the merged object

        mergedObject[key] = { dots: obj2[key].dots };
      }
    }

    return mergedObject;
  }

  function mergeArrays(array1, array2) {
    const mergedMap = new Map();

    // Merge array1
    for (const obj of array1) {
      const title = obj.title;
      if (mergedMap.has(title)) {
        // Merge 'data' arrays if the title already exists
        mergedMap.get(title).data = mergedMap.get(title).data.concat(obj.data);
      } else {
        // If the title doesn't exist, add the object to the map
        mergedMap.set(title, { ...obj });
      }
    }

    // Merge array2
    for (const obj of array2) {
      const title = obj.title;
      if (mergedMap.has(title)) {
        // Merge 'data' arrays if the title already exists
        mergedMap.get(title).data = mergedMap.get(title).data.concat(obj.data);
      } else {
        // If the title doesn't exist, add the object to the map
        mergedMap.set(title, { ...obj });
      }
    }

    // Convert the map values back to an array
    const mergedArray = Array.from(mergedMap.values());

    return mergedArray;
  }

  function sortArrayByTitle(array) {
    const compareDates = (a, b) => {
      const dateA = new Date(a.title);
      const dateB = new Date(b.title);
      return dateA - dateB;
    };

    return array.sort(compareDates);
  }

  function mergeAndSortArrays(array1, array2) {
    const mergedArray = mergeArrays(array1, array2);
    const sortedArray = sortArrayByTitle(mergedArray);
    const finalResultArray = fillMissingDays(sortedArray);

    return finalResultArray;
  }

  function transformEventsToAgendaItems(events) {
    return events.map((event) => {
      const startDate = new Date(event.startDate);
      const outerTitle = formatISO(startDate, {
        representation: "date",
      });
      const endDate = new Date(event.endDate);
      const durationInHours = formatDistanceStrict(endDate, startDate);

      // Create an array with a single entry for the entire event duration
      const eventData = [
        {
          hour: format(new Date(startDate), "p"),
          duration: durationInHours,
          title: event.title,
        },
      ];

      // Return a single object for the original event
      return { title: outerTitle, data: eventData };
    });
  }

  function fillMissingDays(array) {
    if (array.length === 0) {
      return [];
    }
    const filledArray = [];

    for (let i = 0; i < array.length - 1; i++) {
      filledArray.push(array[i]);

      const currentDate = parseISO(array[i].title);
      const nextDate = parseISO(array[i + 1].title);

      // Check if there are missing days between current and next dates
      while (isBefore(addDays(currentDate, 1), nextDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
        const missingDay = {
          title: format(currentDate, "yyyy-MM-dd"),
          data: [{}],
        };
        filledArray.push(missingDay);
      }
    }

    // Add the last object from the original array
    filledArray.push(array[array.length - 1]);

    return filledArray;
  }

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
        },
      ];

      // Return a single object for the original event
      return { title: outerTitle, data: shiftData };
    });
  }

  // on month change let's fetch everything again.. let's just fetch by months!
  function onMonthChange(date) {
    console.log("ExpandableCalendarScreen onMonthChange: ", date);
  }

  const renderItem = useCallback(({ item }) => {
    return <AgendaItem item={item} />;
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
    >
      <Appbar.Header>
        <Appbar.Content title="Calendar" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            setAddingShifts(!addingShifts);
          }}
        />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      {weekView ? (
        <WeekCalendar testID="weekCalendar" firstDay={1} markedDates={merged} />
      ) : (
        <ExpandableCalendar
          testID="expandableCalendar"
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          initialPosition={ExpandableCalendar.positions.OPEN}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          theme={{
            ...customCalendarTheme.current,
            // calendarBackground: "#fcfdf6",
          }}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          markedDates={merged}
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
          closeOnDayPress={false}
        />
      )}
      {addingShifts ? (
        <>
          <AddShiftsToCalendar />
        </>
      ) : (
        <AgendaList
          sections={mergedAgenda}
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
      )}
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
  section: {},
});
