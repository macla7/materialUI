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
  Switch,
  List,
  Checkbox,
  RadioButton,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { addDays } from "date-fns";
import { useTheme } from "react-native-paper";
import { selectUserAvatarUrl } from "../sessions/sessionSlice";
import { selectCoworkers, fetchCoworkersAsync } from "../users/userSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { fetchMyGroupsAsync, selectMyGroups } from "../groups/groupSlice";
import {
  createProspectiveMemberships,
  selectProspectiveMemberships,
} from "../groups/memberships/membershipSlice";

function ShareToScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const coworkers = useSelector(selectCoworkers);
  const myGroups = useSelector(selectMyGroups);
  const userId = useSelector(selectUserId);
  const shifts = useSelector(selectShifts);
  const userAvatarUrl = useSelector(selectUserAvatarUrl);
  const [description, setDescription] = useState("");
  const [value, setValue] = React.useState("");
  const [errors, setErrors] = useState({});
  const freshPost = useSelector(selectFreshPost);
  const headerHeight = useHeaderHeight();
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);
  const [expanded2, setExpanded2] = React.useState(true);
  const [checkboxGroupState, setCheckboxGroupState] = useState(
    getStartingCheckboxState(myGroups)
  );
  const [checkboxUserState, setCheckboxUserState] = useState({});
  const [filteredUser, setFilteredUser] = useState([]);
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  const [selectAllGroups, setSelectAllGroups] = useState(false);

  const hi = { a: 1, b: 2, c: 3, d: 4 };

  useEffect(() => {
    dispatch(fetchCoworkersAsync(userId));
    dispatch(fetchMyGroupsAsync());
  }, []);

  useEffect(() => {
    console.log("useEffect called");
    setFilteredUser(coworkers);
    setCheckboxUserState(getStartingCheckboxState(coworkers));
  }, [coworkers]);

  useEffect(() => {
    console.log("useEffect called heere");
    setFilteredUser(filterUsersByCheckedGroups(coworkers, checkboxGroupState));
  }, [checkboxGroupState]);

  useEffect(() => {
    console.log("useEffect called heere, cause UNIUQQQQQQ changing");
  }, [filteredUser]);

  function selectAllUsersChecked() {
    console.log("helllllllooooooooooooooooo");
    console.log(selectAllUsers);
    if (!selectAllUsers) {
      setCheckboxUserState({
        ...checkboxUserState,
        ...getStartingCheckboxState(filteredUser, "checked"),
      });
    } else {
      setCheckboxUserState({
        ...checkboxUserState,
        ...getStartingCheckboxState(filteredUser, "unchecked"),
      });
    }
    console.log("BIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    setSelectAllUsers(!selectAllUsers);
  }

  function selectAllGroupsChecked() {
    console.log(selectAllGroups);
    if (!selectAllGroups) {
      setCheckboxGroupState({
        ...checkboxGroupState,
        ...getStartingCheckboxState(myGroups, "checked"),
      });
    } else {
      setCheckboxGroupState({
        ...checkboxGroupState,
        ...getStartingCheckboxState(myGroups, "unchecked"),
      });
    }
    console.log("BIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    setSelectAllGroups(!selectAllGroups);
  }

  function filterGroups(coworkers, checkboxState) {
    const filteredObject = Object.fromEntries(
      Object.keys(coworkers)
        .filter((key) => checkboxState[key] === "checked")
        .map((key) => [key, coworkers[key]])
    );
    return filteredObject;
  }

  function filterUsersByCheckedGroups(users, filterIds) {
    return users.filter((user) =>
      user.shared_groups.some((groupId) => filterIds[groupId] === "checked")
    );
  }

  // function getUniqueUsers(coworkers) {
  //   const filteredUser = {};

  //   Object.values(coworkers).forEach((usersInGroup) => {
  //     usersInGroup.forEach((user) => {
  //       // Use the user's ID as a key to check for uniqueness
  //       if (!filteredUser[user.id]) {
  //         // If the user's ID is not in 'filteredUser', add the user
  //         filteredUser[user.id] = user;
  //       }
  //     });
  //   });

  //   // Convert the filteredUser object into an array of user objects
  //   const filteredUserArray = Object.values(filteredUser);

  //   return filteredUserArray;
  // }

  function getStartingCheckboxState(myGroups, status = "unchecked") {
    const resultObject = myGroups.reduce((result, item) => {
      result[item.id] = status;
      return result;
    }, {});
    return resultObject;
  }

  const handlePress = () => setExpanded(!expanded);

  function checkboxTouched(id, checkboxObject, arrayType) {
    let newCheckboxState = {};

    switch (checkboxObject[id]) {
      case "checked":
        newCheckboxState[id] = "unchecked";
        break;
      case "unchecked":
        newCheckboxState[id] = "checked";
        break;
    }

    console.log("touched");
    console.log({ ...checkboxObject, ...newCheckboxState });
    if (arrayType === "users") {
      setCheckboxUserState({ ...checkboxObject, ...newCheckboxState });
    } else {
      setCheckboxGroupState({ ...checkboxObject, ...newCheckboxState });
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

  function checkObject(obj) {
    for (const key in obj) {
      if (obj[key] === "unchecked") {
        return "unchecked";
      }
    }
    console.log("getting hereeee");
    return "checked";
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* For some reason, the touchable without feedback here is causing the scrollview to not work...... */}
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
      <View style={{ paddingTop: headerHeight - 5 }}>
        <ScrollView
          style={{
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <List.Section>
            <List.Accordion
              title="Groups"
              left={(props) => <List.Icon {...props} icon="folder" />}
              expanded={expanded}
              onPress={() => setExpanded(!expanded)}
            >
              <List.Item
                title="Select All"
                onPress={() => selectAllGroupsChecked()}
                left={(props) => <List.Icon {...props} icon="select-all" />}
                right={(props) => (
                  <View style={{ justifyContent: "center" }}>
                    <Checkbox.Item
                      status={selectAllGroups ? "checked" : "unchecked"}
                      mode="android"
                      style={{ height: 20 }}
                    />
                  </View>
                )}
              />
              {myGroups.map((item) => {
                return (
                  <List.Item
                    title={item.name}
                    onPress={() =>
                      checkboxTouched(item.id, checkboxGroupState, "groups")
                    }
                    right={(props) => (
                      <Checkbox.Item
                        status={checkboxGroupState[item.id]}
                        mode="android"
                        style={{ height: 20 }}
                      />
                    )}
                  />
                );
              })}
            </List.Accordion>
          </List.Section>
          <List.Accordion
            title="Users"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            expanded={expanded2}
            onPress={() => setExpanded2(!expanded2)}
          >
            <List.Item
              title="Select All"
              onPress={() => selectAllUsersChecked()}
              left={(props) => <List.Icon {...props} icon="select-all" />}
              right={(props) => (
                <View style={{ justifyContent: "center" }}>
                  <Checkbox.Item
                    status={selectAllUsers ? "checked" : "unchecked"}
                    mode="android"
                    style={{ height: 20 }}
                  />
                </View>
              )}
            />
            {filteredUser.map((item) => {
              return (
                <List.Item
                  title={item.name}
                  onPress={() =>
                    checkboxTouched(item.id, checkboxUserState, "users")
                  }
                  left={() => LeftContent(item.avatar_url)}
                  right={(props) => (
                    <View style={{ justifyContent: "center" }}>
                      <Checkbox.Item
                        status={checkboxUserState[item.id]}
                        mode="android"
                        style={{ height: 20 }}
                      />
                    </View>
                  )}
                />
              );
            })}
          </List.Accordion>
        </ScrollView>
      </View>
      <Button
        mode="contained"
        onPress={() => {
          dispatch(createProspectiveMemberships());
          onSubmit();
        }}
        style={{ marginTop: 25 }}
      >
        Done
      </Button>

      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
}

export default ShareToScreen;
