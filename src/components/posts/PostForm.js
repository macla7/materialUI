import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostAsync, selectFreshPost } from "./postSlice";
import { resetShifts, selectShifts } from "./shifts/shiftSlice";
import { createNotificationBlueprint } from "../notifications/notificationBlueprintAPI";
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
  Card,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { addDays } from "date-fns";
import { useTheme } from "react-native-paper";

function PostForm({ route, navigation }) {
  const dispatch = useDispatch();
  const shifts = useSelector(selectShifts);
  const [description, setDescription] = useState("");
  const [value, setValue] = React.useState("");
  const [errors, setErrors] = useState({});
  const freshPost = useSelector(selectFreshPost);
  const headerHeight = useHeaderHeight();
  const theme = useTheme();

  useEffect(() => {
    if (freshPost.id != 0) {
      let notification_blueprint = {
        notificationable_type: "Post",
        notificationable_id: freshPost.id,
        notification_type: 4,
      };

      createNotificationBlueprint(notification_blueprint);

      dispatch(resetShifts());
    }
  }, [freshPost.id]);

  // useEffect(() => {
  //   dispatch(resetShifts());
  // }, []);

  const onSubmit = () => {
    validate() ? console.log("Submitted") : console.log("Validation Failed");
  };

  const validate = () => {
    let newErrors = {};

    checkDescriptionForErrors(newErrors);
    checkShiftsForErrors(newErrors);
    checkGroupForErrors(newErrors);

    setErrors({ ...errors, ...newErrors });

    if (areAllValuesNull(errors) && areAllValuesNull(newErrors)) {
      return submitPost();
    }
  };

  function submitPost() {
    let post = {
      body: description,
      group_id: groupId,
      shifts_attributes: shifts,
    };
    navigation.navigate({
      name: "Home",
    });
    dispatch(createPostAsync(post));
    return true;
  }

  const checkDescriptionForErrors = (newErrors) => {
    if (description === "") {
      newErrors["description"] = "Description required";
    }
  };

  const checkShiftsForErrors = (newErrors) => {
    if (shifts.length === 0) {
      newErrors["shifts"] = "At least one Shift is requried";
    }
  };

  const checkGroupForErrors = (newErrors) => {
    if (groupId === 0) {
      newErrors["group"] = "Need to pick a group";
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

  function shiftPosition(position) {
    switch (position) {
      case "0":
        return "AM";
      case "1":
        return "PM";
      case "2":
        return "Night";
      case "3":
        return "Custom";
      default:
        return "no shift position...";
    }
  }

  const shiftsColors = {
    1: { key: "PM", color: theme.colors.customBlueContainer },
    0: { key: "AM", color: theme.colors.customOrangeContainer },
    2: { key: "Night", color: theme.colors.customPurpleContainer },
    5: { key: "personal", color: "black" },
  };

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
              label="Description"
              multiline
              mode="outlined"
              placeholder="Information for shift"
              style={{ height: 75, backgroundColor: "white", padding: 0 }}
              value={description}
              onChangeText={setDescription}
            />
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: "0",
                  label: "Swap",
                  icon: "calendar-multiple",
                },
                {
                  value: "1",
                  label: "Cover",
                  icon: "calendar-arrow-right",
                },
                { value: "2", label: "Either" },
              ]}
              style={{ marginTop: 25 }}
            />

            {shifts.description !== undefined > 0 ? (
              <Card
                style={{
                  marginTop: 25,
                  backgroundColor: shiftsColors[shifts.position].color,
                }}
              >
                {/* <Card.Title
                title=""
                subtitle=""
                // left={LeftContent}
              /> */}
                <Card.Content>
                  <Text variant="titleLarge">
                    {shiftPosition(shifts.position)}
                  </Text>
                  <Text variant="bodyMedium">{shifts.description}</Text>
                </Card.Content>
                {/* <Card.Cover source={{ uri: "https://picsum.photos/700" }} /> */}
                <Card.Actions>
                  <Button>Edit</Button>
                  <Button>Delete</Button>
                </Card.Actions>
              </Card>
            ) : null}

            <Button
              icon="calendar"
              mode="contained-tonal"
              onPress={() => {
                const currentDate = new Date();
                navigation.navigate("Add Shift", {
                  initStart: addDays(currentDate, 7).toString(),
                  initEnd: addDays(currentDate, 7).toString(),
                  returnScreen: "Create Post",
                });
                setErrors({ ...errors, shifts: null });
                dispatch(resetShifts());
              }}
              style={{ marginTop: 25 }}
            >
              Create Shift
            </Button>
            <Text style={{ marginTop: 25 }}>
              next screen is the groups/people select
            </Text>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default PostForm;
