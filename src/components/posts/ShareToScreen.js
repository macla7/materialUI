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
    extractIdsAndAdd(myGroups, [])
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
    setCheckboxUserState(extractIdsAndAdd(coworkers, []));
  }, [coworkers]);

  useEffect(() => {
    console.log("useEffect called heere");
    setFilteredUser(filterUsersById(coworkers, checkboxGroupState));
  }, [checkboxGroupState]);

  useEffect(() => {
    console.log("useEffect called heere, cause UNIUQQQQQQ changing");
  }, [filteredUser]);

  function selectAllUsersChecked() {
    console.log("helllllllooooooooooooooooo");
    console.log(selectAllUsers);
    if (!selectAllUsers) {
      setCheckboxUserState(extractIdsAndAdd(filteredUser, checkboxUserState));
    } else {
      setCheckboxUserState(removeIdsFromArray(checkboxUserState, filteredUser));
    }
    console.log("BIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    console.log(checkboxUserState);
    setSelectAllUsers(!selectAllUsers);
  }

  function selectAllGroupsChecked() {
    console.log(selectAllGroups);
    if (!selectAllGroups) {
      setCheckboxGroupState(extractIdsAndAdd(myGroups, checkboxGroupState));
    } else {
      setCheckboxGroupState(removeIdsFromArray(checkboxGroupState, myGroups));
    }
    console.log("BIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    setSelectAllGroups(!selectAllGroups);
  }

  function filterUsersById(usersArray, idsToKeep) {
    // Use the filter method to create a new array containing only the desired users
    let filteredUsers = usersArray.filter((user) =>
      idsToKeep.includes(user.id)
    );

    // Return the array containing the filtered users
    return filteredUsers;
  }

  function extractIdsAndAdd(arrayOfObjects, existingIdsArray) {
    // Create an array to store the extracted ids
    let newStorage = [];

    // Iterate through the array of objects
    for (let i = 0; i < arrayOfObjects.length; i++) {
      // Check if the current object has the "id" property
      if (arrayOfObjects[i].hasOwnProperty("id")) {
        // Push the "id" value to the newStorage array
        newStorage.push(arrayOfObjects[i].id);
      }
    }

    // Add the new ids to the existing array of ids
    let updatedIdsArray = existingIdsArray.concat(newStorage);

    // Return the updated array containing the existing and new ids
    return updatedIdsArray;
  }

  function removeIdsFromArray(idsArray, arrayOfObjects) {
    // Create a new array to store the remaining ids
    let remainingIds = [];

    // Create a set of ids to remove for efficient lookup
    let idsToRemoveSet = new Set(arrayOfObjects.map((obj) => obj.id));

    // Iterate through the array of ids
    for (let i = 0; i < idsArray.length; i++) {
      // Check if the current id is in the set of ids to remove
      if (!idsToRemoveSet.has(idsArray[i])) {
        // If not, push the id to the remainingIds array
        remainingIds.push(idsArray[i]);
      }
    }

    // Return the array containing the remaining ids
    return remainingIds;
  }

  const handlePress = () => setExpanded(!expanded);

  function checkboxTouched(id, checkboxObject, arrayType) {
    if (isIdPresent(id, checkboxObject)) {
      if (arrayType === "users") {
        setCheckboxUserState(removeIdFromArray(id, checkboxUserState));
      } else {
        setCheckboxGroupState(removeIdFromArray(id, checkboxGroupState)); //
      }
    } else {
      if (arrayType === "users") {
        setCheckboxUserState(addIdToArray(id, checkboxUserState));
      } else {
        setCheckboxGroupState(addIdToArray(id, checkboxGroupState)); //
      }
    }

    console.log("touched");
  }

  function isIdPresent(idToCheck, idsArray) {
    // Use the includes method to check if the id is present in the array
    return idsArray.includes(idToCheck);
  }

  function removeIdFromArray(idToRemove, idsArray) {
    // Use the filter method to create a new array without the specified ID
    let newArray = idsArray.filter((id) => id !== idToRemove);

    // Return the new array without the removed ID
    return newArray;
  }

  function addIdToArray(idToAdd, idsArray) {
    // Check if the ID is not already in the array
    if (!idsArray.includes(idToAdd)) {
      // Use the concat method to create a new array with the added ID
      let newArray = idsArray.concat(idToAdd);

      // Alternatively, you can use the push method to modify the existing array in place:
      // idsArray.push(idToAdd);

      // Return the new array with the added ID
      return newArray;
    }

    // If the ID is already in the array, return the original array
    return idsArray;
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
                        status={
                          isIdPresent(item.id, checkboxGroupState)
                            ? "checked"
                            : "unchecked"
                        }
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
                        status={
                          isIdPresent(item.id, checkboxUserState)
                            ? "checked"
                            : "unchecked"
                        }
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
          dispatch(createProspectiveMemberships(checkboxUserState));
          navigation.navigate("Create Post");
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
