import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostAsync, selectFreshPost } from "./postSlice";
import { resetProShifts, selectProShifts } from "../shifts/shiftSlice";
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
  HelperText,
  List,
  Snackbar,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { addDays, format } from "date-fns";
import { useTheme } from "react-native-paper";
import { selectUserAvatarUrl, selectUserName } from "../sessions/sessionSlice";
import {
  selectCheckboxUserState,
  selectProspectiveMembershipsObjects,
} from "../groups/memberships/membershipSlice";

function PostForm({ route, navigation }) {
  const dispatch = useDispatch();
  const proShifts = useSelector(selectProShifts);
  const checkboxUserState = useSelector(selectCheckboxUserState);
  const prospectiveMembershipsObjects = useSelector(
    selectProspectiveMembershipsObjects
  );
  const userAvatarUrl = useSelector(selectUserAvatarUrl);
  const userName = useSelector(selectUserName);
  const [reason, setReason] = useState("");
  const [solution, setSolution] = React.useState(0);
  const [errors, setErrors] = useState({});
  const freshPost = useSelector(selectFreshPost);
  const headerHeight = useHeaderHeight();
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);

  console.log("prroooooooooo shift it");
  console.log(proShifts);

  useEffect(() => {
    console.log("prooooo pppp shift it");
    console.log(proShifts);
  }, []);

  useEffect(() => {
    if (freshPost.id != 0) {
      let notification_blueprint = {
        notificationable_type: "Post",
        notificationable_id: freshPost.id,
        notification_type: 4,
      };

      createNotificationBlueprint(notification_blueprint);
    }
  }, [freshPost.id]);

  const onSubmit = () => {
    validate() ? console.log("Submitted") : console.log("Validation Failed");
  };

  const validate = () => {
    let newErrors = {};

    checkReasonForErrors(newErrors);
    checkShiftsForErrors(newErrors);
    checkSolutionForErrors(newErrors);

    setErrors({ ...errors, ...newErrors });

    if (areAllValuesNull(errors) && areAllValuesNull(newErrors)) {
      return submitPost();
    }
  };

  function submitPost() {
    console.log("making POSTTTTTTTTT");
    let post = {
      body: reason,
      shift_attributes: proShifts,
      solution: solution,
      members_attributes: checkboxUserState,
    };
    dispatch(createPostAsync(post));
    dispatch(resetProShifts());
    setReason("");
    setVisibleSnackbar(true);
    return true;
  }

  const checkReasonForErrors = (newErrors) => {
    if (reason === "") {
      newErrors["reason"] = "Reason required";
    }
  };

  const checkShiftsForErrors = (newErrors) => {
    if (proShifts.length === 0) {
      newErrors["shifts"] = "At least one Shift is requried";
    }
  };

  const checkSolutionForErrors = (newErrors) => {
    if (solution < 0 || solution > 3) {
      newErrors["solution"] = "Please choose the type of Post";
    } else {
      return;
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

  function shiftPosition(solution) {
    switch (solution) {
      case 0:
        return "AM";
      case 1:
        return "PM";
      case 2:
        return "Night";
      case 3:
        return "Custom";
      default:
        return "no shift solution...";
    }
  }

  const shiftsColors = {
    PM: {
      key: "PM",
      container: theme.colors.customBlueContainer,
      color: theme.colors.customBlue,
    },
    AM: {
      key: "AM",
      container: theme.colors.customOrangeContainer,
      color: theme.colors.customOrange,
    },
    Night: {
      key: "Night",
      container: theme.colors.customPurpleContainer,
      color: theme.colors.customPurple,
    },
    Custom: {
      key: "Custom",
      container: theme.colors.customPinkContainer,
      color: theme.colors.customPink,
    },
    Personal: { key: "personal", color: "black" },
  };

  function nextScreenButton() {
    if (proShifts.length === 0) {
      return (
        <Button
          icon="calendar"
          mode="contained-tonal"
          onPress={() => {
            const currentDate = new Date();
            navigation.navigate("Add Shift", {
              returnScreen: "Create Post",
            });
            // dispatch(resetProShifts());
          }}
          style={{ marginTop: 15 }}
        >
          Create Shift
        </Button>
      );
    } else if (checkboxUserState.length === 0) {
      return (
        <Button
          icon="account-group"
          mode="contained-tonal"
          onPress={() => {
            navigation.navigate("Share To", {});
          }}
          style={{ marginTop: 15 }}
        >
          Share to
        </Button>
      );
    } else {
      return (
        <>
          <Button
            mode="contained-tonal"
            onPress={() => {
              onSubmit();
            }}
            style={{ marginTop: 15 }}
          >
            Post
          </Button>
          <HelperText type="error" visible={!areAllValuesNull(errors)}>
            Please review form errors above
          </HelperText>
        </>
      );
    }
  }
  const LeftContent = (source) => (
    <Avatar.Image
      source={() => (
        <Image
          source={{ uri: source }}
          style={{
            width: 30,
            height: 30,
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
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
      <View
        style={{
          paddingTop: headerHeight - 5,
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <TextInput
            label="Reason"
            multiline
            mode="outlined"
            placeholder="Reason for posting the shift"
            style={{ height: 75, backgroundColor: "white", padding: 0 }}
            value={reason}
            onChangeText={(value) => {
              setErrors({ ...errors, reason: null });
              setReason(value);
            }}
          />
          <HelperText type="error" visible={errors.reason !== undefined}>
            {errors["reason"]}
          </HelperText>
          <Text variant="titleSmall" style={{ marginTop: 15 }}>
            What do you want to do with your shift?
          </Text>
          <SegmentedButtons
            value={solution}
            onValueChange={(value) => {
              setErrors({ ...errors, solution: null });
              setSolution(value);
            }}
            buttons={[
              {
                value: 0,
                label: "Swap",
                icon: "calendar-multiple",
              },
              {
                value: 1,
                label: "Cover",
                icon: "calendar-arrow-right",
              },
              { value: 2, label: "Either" },
            ]}
            style={{ marginTop: 10 }}
          />
          <HelperText type="error" visible={errors.solution !== undefined}>
            {errors["solution"]}
          </HelperText>

          {proShifts.length > 0 ? (
            <Card
              style={{
                marginTop: 15,
                backgroundColor: shiftsColors[proShifts[0].position].container,
              }}
            >
              <Card.Title
                title={
                  format(new Date(proShifts[0].start), "EEE do LLL") +
                  " - " +
                  proShifts[0].position
                }
                subtitle={userName}
                titleVariant="titleLarge"
                subtitleVariant="bodyMedium"
                left={() => LeftContent(userAvatarUrl)}
              />
              <Card.Content>
                <Text variant="bodyLarge">
                  {format(new Date(proShifts[0].start), "p") +
                    " - " +
                    format(new Date(proShifts[0].end), "p")}
                </Text>
                <Text variant="bodyMedium">{proShifts[0].description}</Text>
              </Card.Content>
              {/* <Card.Cover source={{ uri: "https://picsum.photos/700" }} /> */}
              <Card.Actions>
                <Button
                  textColor={shiftsColors[proShifts[0].position].color}
                  onPress={() => {
                    const currentDate = new Date();
                    navigation.navigate("Add Shift", {
                      returnScreen: "Create Post",
                    });
                  }}
                >
                  Edit
                </Button>
                {/* <Button buttonColor={shiftsColors[proShifts.position].color}>
              Delete
            </Button> */}
              </Card.Actions>
            </Card>
          ) : null}
          <HelperText type="error" visible={false}></HelperText>

          {checkboxUserState.length === 0 ? null : (
            <List.Section title="Share Post To">
              <List.Accordion
                title={"Coworkers (" + checkboxUserState.length + " selected)"}
                left={(props) => <List.Icon {...props} icon="account-group" />}
                expanded={expanded}
                onPress={handlePress}
              >
                <List.Item
                  title="Edit List"
                  onPress={() => {
                    navigation.navigate("Share To", {});
                  }}
                  right={(props) => <List.Icon {...props} icon="pencil" />}
                />
                {prospectiveMembershipsObjects.map((item, i) => {
                  return (
                    <List.Item
                      key={i}
                      title={item.name}
                      left={() => LeftContent(item.avatar_url)}
                    />
                  );
                })}
              </List.Accordion>
            </List.Section>
          )}
          {nextScreenButton()}
        </ScrollView>
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => setVisibleSnackbar(false)}
          action={{
            label: "Dismiss",
            onPress: () => {
              console.log("Snackbar dismissed");
            },
          }}
        >
          Post created!
        </Snackbar>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
}

export default PostForm;
