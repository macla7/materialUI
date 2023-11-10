import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyGroupsAsync, selectMyGroups } from "./groupSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { View, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Avatar, Button, Card, Text, List } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";

function Groups({ navigation }) {
  const myGroups = useSelector(selectMyGroups);
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const headerHeight = useHeaderHeight();

  // Called on initialise, because dispatch changes (on intialise)
  // and on myGroups.length change
  useEffect(() => {
    dispatch(fetchMyGroupsAsync());
  }, [dispatch, myGroups.length, isFocused]);

  function refresh() {
    dispatch(fetchMyGroupsAsync());
  }

  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

  return (
    <View style={{ paddingTop: headerHeight - 5 }}>
      <ScrollView
        style={{
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        {myGroups.map((item) => {
          return (
            <List.Item
              title={item.name}
              description={item.number_of_memberships + " members"}
              onPress={() => {
                console.log("moving to group " + item.name);
                navigation.navigate("Group", {
                  group: item,
                });
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

export default Groups;
