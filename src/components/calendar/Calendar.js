import React, { useRef, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
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
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  fetchShiftsAsync,
  selectCurrentShifts,
  selectDate,
  setDate,
  fetchShiftsForMonthAsync,
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
const ExpandableCalendarScreen = ({ navigation, weekView }) => {
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

  const [addingShifts, setAddingShifts] = useState(false);
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });
  const date = useSelector(selectDate);

  useEffect(() => {
    const formattedDate = format(new Date(), "yyyy-MM");
    dispatch(
      fetchShiftsForMonthAsync({ userId: userId, month: formattedDate })
    );
  }, []);

  useEffect(() => {
    setTransformedShifts(transformArray(currentShifts));
    setAgendaShifts(transformShiftsToAgendaItems(currentShifts));
  }, [currentShifts]);

  useEffect(() => {
    setMerged(mergeOutputObjects(transformedEvents, transformedShifts));
  }, [transformedShifts, transformedEvents]);

  useEffect(() => {
    console.log("get here?");
    console.log(agendaEvents);
    console.log(agendaShifts);
    setMergedAgenda(mergeAndSortArrays(agendaEvents, agendaShifts));
  }, [agendaShifts, agendaEvents]);

  // this useEffect is taken from https://docs.expo.dev/versions/latest/sdk/calendar/#event
  useEffect(() => {
    (async () => {
      getCalendarEvents();
    })();
    // need to have transformedShifts in the dependency array, due to the weird bug of transformedEvents being altered on
    //  useEffect(() => {
    //    setTransformedShifts(transformArray(currentShifts));
    //  }, [currentShifts]);
    // this somehow stops the altering of transformed events....
  }, [transformedShifts]);

  const getCalendarEvents = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const calendarIds = calendars.map((calendar) => calendar.id);
      // const currentDate = new Date();

      const calendarsEvents = await Calendar.getEventsAsync(
        calendarIds,
        startOfMonth(new Date(date)),
        endOfMonth(new Date(date))
      );

      setTransformedEvents(transformEventArray(calendarsEvents));
      setAgendaEvents(transformEventsToAgendaItems(calendarsEvents));
    }
  };

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

    console.log("trannnnnns formmming");
    console.log(inputData);
    inputData.forEach((item) => {
      const startDate = format(new Date(item.startDate), "yyyy-MM-dd");
      console.log("start DAAAAAAAte is ");
      console.log(startDate);
      let dots = [];

      if (item.title !== "") {
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
    console.log("innnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn sort");
    console.log(array);
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

  // on month change let's fetch everything again.. let's just fetch by months!
  function onMonthChange(date) {
    const formattedDate = format(new Date(date.dateString), "yyyy-MM");

    dispatch(
      fetchShiftsForMonthAsync({ userId: userId, month: formattedDate })
    );
    dispatch(setDate(new Date(date.dateString).toString()));
  }

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <AgendaItem
          item={item}
          navigation={navigation}
          offering={false}
          postId={0}
        />
      );
    },
    [mergedAgenda, merged]
  );

  function renderItemFunc(item) {
    return <AgendaItem item={item.item} />;
  }

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
      <Appbar.Header>
        <Appbar.Content title="Your Calendar" />
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
        <View
          style={{
            flex: 1,
            padding: 15,
          }}
        >
          <AddShiftsToCalendar />
          <Button
            mode="contained"
            onPress={() => {
              setAddingShifts(!addingShifts);
            }}
          >
            Done
          </Button>
        </View>
      ) : (
        <AgendaList
          avoidDateUpdates
          sections={mergedAgenda}
          renderItem={renderItem}
          sectionStyle={{
            paddingTop: 7,
            paddingBottom: 7,
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
