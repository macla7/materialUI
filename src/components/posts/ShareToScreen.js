import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from "react-native";
import {
  Button,
  Avatar,
  List,
  Checkbox,
  Chip,
  Divider,
} from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTheme } from "react-native-paper";
import { selectCoworkers, fetchCoworkersAsync } from "../users/userSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { fetchMyGroupsAsync, selectMyGroups } from "../groups/groupSlice";
import {
  setCheckboxUserState,
  createProspectiveMembershipsObjects,
  selectCheckboxUserState,
  selectCheckboxGroupState,
  setCheckboxGroupState,
} from "../groups/memberships/membershipSlice";

function ShareToScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const coworkers = useSelector(selectCoworkers);
  const myGroups = useSelector(selectMyGroups);
  const userId = useSelector(selectUserId);
  const headerHeight = useHeaderHeight();
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);
  const [expanded2, setExpanded2] = React.useState(false);
  const checkboxUserState = useSelector(selectCheckboxUserState);
  const checkboxGroupState = useSelector(selectCheckboxGroupState);
  const [filteredUser, setFilteredUser] = useState([]);
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  const [selectAllGroups, setSelectAllGroups] = useState(false);

  useEffect(() => {
    dispatch(fetchCoworkersAsync(userId));
    dispatch(fetchMyGroupsAsync());
  }, []);

  useEffect(() => {
    setFilteredUser(filterUsersByGroup(coworkers, checkboxGroupState));
    setExpanded2(false);
  }, [checkboxGroupState]);

  function filterGroupsById(groups, groupIds) {
    return groups.filter((group) => groupIds.includes(group.id));
  }

  function makeChipsForUser(shared_groups) {
    let filteredGroups = filterGroupsById(myGroups, checkboxGroupState);
    let moreFilteredGroups = filterGroupsById(filteredGroups, shared_groups);

    return moreFilteredGroups;
  }

  function selectAllUsersChecked() {
    if (!selectAllUsers) {
      dispatch(
        setCheckboxUserState(extractIdsAndAdd(filteredUser, checkboxUserState))
      );
    } else {
      dispatch(
        setCheckboxUserState(
          removeIdsFromArray(checkboxUserState, filteredUser)
        )
      );
    }
    setSelectAllUsers(!selectAllUsers);
  }

  function selectAllGroupsChecked() {
    if (!selectAllGroups) {
      // user matters
      setSelectAllUsers(true);
      let newGroupState = extractIdsAndAdd(myGroups, checkboxGroupState);
      let newFiltteredUsers = filterUsersByGroup(coworkers, newGroupState);
      dispatch(
        setCheckboxUserState(
          extractIdsAndAdd(newFiltteredUsers, checkboxUserState)
        )
      );

      // group matters
      dispatch(
        setCheckboxGroupState(extractIdsAndAdd(myGroups, checkboxGroupState))
      );
    } else {
      // user matters
      setSelectAllUsers(false);
      dispatch(setCheckboxUserState([]));

      // group matters
      dispatch(
        setCheckboxGroupState(removeIdsFromArray(checkboxGroupState, myGroups))
      );
    }
    setSelectAllGroups(!selectAllGroups);
  }

  function onSubmit() {
    dispatch(
      createProspectiveMembershipsObjects(
        filterUsersById(coworkers, checkboxUserState)
      )
    );
    navigation.navigate("Create Post");
  }

  function filterUsersById(usersArray, idsToKeep) {
    // Use the filter method to create a new array containing only the desired users
    let filteredUsers = usersArray.filter((user) =>
      idsToKeep.includes(user.id)
    );

    // Return the array containing the filtered users
    return filteredUsers;
  }

  function filterUsersByGroup(users, inputGroupIds) {
    return users.filter((user) =>
      user.shared_groups.some((group) => inputGroupIds.includes(group))
    );
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

  // function checkboxTouched(id, checkboxObject, arrayType) {
  //   if (isIdPresent(id, checkboxObject)) {
  //     if (arrayType === "users") {
  //       setSelectAllUsers(false);
  //       dispatch(
  //         setCheckboxUserState(removeIdFromArray(id, checkboxUserState))
  //       );
  //     } else {
  //       setSelectAllGroups(false);
  //       let newFiltteredUsers = filterUsersByGroup(
  //         coworkers,
  //         checkboxGroupState
  //       );
  //       dispatch(
  //         setCheckboxUserState(
  //           extractIdsAndAdd(newFiltteredUsers, checkboxUserState)
  //         )
  //       );
  //       dispatch(
  //         setCheckboxGroupState(removeIdFromArray(id, checkboxGroupState))
  //       );
  //     }
  //   } else {
  //     if (arrayType === "users") {
  //       dispatch(setCheckboxUserState(addIdToArray(id, checkboxUserState)));
  //     } else {
  //       let newFiltteredUsers = filterUsersByGroup(
  //         coworkers,
  //         checkboxGroupState
  //       );
  //       dispatch(
  //         setCheckboxUserState(
  //           extractIdsAndAdd(newFiltteredUsers, checkboxUserState)
  //         )
  //       );
  //       dispatch(setCheckboxGroupState(addIdToArray(id, checkboxGroupState)));
  //     }
  //   }
  // }

  function checkboxTouched(id, checkboxObject, arrayType) {
    if (arrayType === "users") {
      // checkbox is currently selected
      if (isIdPresent(id, checkboxObject)) {
        setSelectAllUsers(false);
        dispatch(
          setCheckboxUserState(removeIdFromArray(id, checkboxUserState))
        );
      } else {
        dispatch(setCheckboxUserState(addIdToArray(id, checkboxUserState)));
      }
    } else {
      // Group checkbox matters
      // If the checkbox has been selected
      if (isIdPresent(id, checkboxObject)) {
        setSelectAllGroups(false);
        setSelectAllUsers(true);

        let newGroupState = removeIdFromArray(id, checkboxGroupState);
        let newFiltteredUsers = filterUsersByGroup(coworkers, newGroupState);

        dispatch(setCheckboxUserState(extractIdsAndAdd(newFiltteredUsers, [])));
        dispatch(setCheckboxGroupState(newGroupState));
      } else {
        // if the group checkbox is currently not selected
        setSelectAllUsers(true);

        let newGroupState = addIdToArray(id, checkboxGroupState);
        let newFiltteredUsers = filterUsersByGroup(coworkers, newGroupState);

        dispatch(
          setCheckboxUserState(
            extractIdsAndAdd(newFiltteredUsers, checkboxUserState)
          )
        );
        dispatch(setCheckboxGroupState(newGroupState));
      }
    }
  }

  function isIdPresent(idToCheck, idsArray) {
    // Use the includes method to check if the id is present in the array
    return idsArray.includes(idToCheck);
  }

  function removeIdFromArray(idToRemove, idsArray) {
    // Use the filter method to create a new array without the specified ID

    console.log("id to remove: " + idToRemove);

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
      <View
        style={{
          paddingTop: headerHeight - 5,
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <List.Section>
            <List.Accordion
              title="Groups"
              left={(props) => <List.Icon {...props} icon="account-group" />}
              expanded={expanded}
              onPress={() => setExpanded(!expanded)}
            >
              <List.Item
                key={1}
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
              {myGroups.map((item, i) => {
                return (
                  <List.Item
                    key={i + 1}
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
            title={"Users (" + checkboxUserState.length + " selected)"}
            left={(props) => <List.Icon {...props} icon="account" />}
            expanded={expanded2}
            onPress={() => setExpanded2(!expanded2)}
          >
            <List.Item
              key={1}
              style={{ paddingRight: 0 }}
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
            {filteredUser.map((item, i) => {
              return (
                <View key={i + 1} style={{ paddingLeft: 0 }}>
                  <List.Item
                    style={{
                      paddingRight: 0,
                      paddingVertical: 0,
                      paddingTop: 8,
                    }}
                    title={item.name}
                    descriptionEllipsizeMode="tail"
                    descriptionNumberOfLines={1}
                    descriptionStyle={{
                      display: "flex",
                      backgroundColor: "red",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
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
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginBottom: 5,
                    }}
                  >
                    {makeChipsForUser(item.shared_groups).map((group, i) => {
                      return (
                        <Chip
                          key={i}
                          textStyle={{
                            fontSize: 10,
                          }}
                        >
                          {group.name}
                        </Chip>
                      );
                    })}
                  </View>
                  <Divider />
                </View>
              );
            })}
          </List.Accordion>
          <Button
            mode="contained"
            onPress={() => onSubmit()}
            style={{ marginTop: 25 }}
          >
            Save List
          </Button>
        </ScrollView>
      </View>

      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
}

export default ShareToScreen;
