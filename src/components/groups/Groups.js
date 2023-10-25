import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyGroupsAsync, selectMyGroups } from "./groupSlice";
import { selectUserId } from "../sessions/sessionSlice";

import { View, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";

function Groups({ navigation }) {
  // const myGroups = useSelector(selectMyGroups);
  // const userId = useSelector(selectUserId);
  // const dispatch = useDispatch();
  // const isFocused = useIsFocused();

  // // Called on initialise, because dispatch changes (on intialise)
  // // and on myGroups.length change
  // useEffect(() => {
  //   dispatch(fetchMyGroupsAsync());
  // }, [dispatch, myGroups.length, isFocused]);

  // function refresh() {
  //   dispatch(fetchMyGroupsAsync());
  // }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Groups!</Text>
    </View>
  );
}

export default Groups;
