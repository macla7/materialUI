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
  Image,
} from "react-native";
import {
  TextInput,
  Text,
  SegmentedButtons,
  Button,
  Card,
  Avatar,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { addDays } from "date-fns";
import { useTheme } from "react-native-paper";
import { selectUserAvatarUrl } from "../sessions/sessionSlice";

function PostForm({ route, navigation }) {
  const dispatch = useDispatch();
  const { members_attributes, shifts_attributes } = route.params;
  const shifts = useSelector(selectShifts);
  const userAvatarUrl = useSelector(selectUserAvatarUrl);
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

  useEffect(() => {
    console.log("whhhaaaaaaaaaaaa");
    console.log(shifts.description);
    console.log(userAvatarUrl);
  });

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
    console.log("making POSTTTTTTTTT");
    let post = {
      body: description,
      group_id: groupId,
      shifts_attributes: shifts,
      solution: 0,
      group_id_attributes: {
        temporary: true,
      },
      members_attributes: [],
    };
    console.log(post);
    navigation.navigate({
      name: "Home",
    });
    // dispatch(createPostAsync(post));
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
    1: {
      key: "PM",
      container: theme.colors.customBlueContainer,
      color: theme.colors.customBlue,
    },
    0: {
      key: "AM",
      container: theme.colors.customOrangeContainer,
      color: theme.colors.customOrange,
    },
    2: {
      key: "Night",
      container: theme.colors.customPurpleContainer,
      color: theme.colors.customPurple,
    },
    5: { key: "personal", color: "black" },
  };

  const LeftContent = (source) => (
    <Avatar.Image
      source={() => (
        <Image
          source={{ uri: source }}
          style={{
            width: 40,
            height: 40,
          }} // Set the width and height of the image
        />
      )}
      size={48}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        shadowRadius: "5",
        shadowColor: theme.colors.shadow,
        shadowOffset: "1 1",
        shadowOpacity: 0.1,
        backgroundColor: "white",
      }}
    />
  );

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

            {shifts.description !== undefined ? (
              <Card
                style={{
                  marginTop: 25,
                  backgroundColor: shiftsColors[shifts.position].container,
                }}
              >
                <Card.Title
                  title={shiftPosition(shifts.position)}
                  subtitle={shifts.description}
                  titleVariant="titleLarge"
                  subtitleVariant="bodyMedium"
                  left={() => LeftContent(userAvatarUrl)}
                />
                {/* <Card.Content></Card.Content> */}
                {/* <Card.Cover source={{ uri: "https://picsum.photos/700" }} /> */}
                <Card.Actions>
                  <Button textColor={shiftsColors[shifts.position].color}>
                    Edit
                  </Button>
                  <Button buttonColor={shiftsColors[shifts.position].color}>
                    Delete
                  </Button>
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
            <Button
              icon="calendar"
              mode="contained-tonal"
              onPress={() => {
                navigation.navigate("Share To", {});
                setErrors({ ...errors, shifts: null });
              }}
              style={{ marginTop: 25 }}
            >
              Share to
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
