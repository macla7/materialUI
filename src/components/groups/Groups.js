import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyGroupsAsync, selectMyGroups } from "./groupSlice";
import { selectUserId } from "../sessions/sessionSlice";
import { View, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  Avatar,
  Button,
  Card,
  List,
  Appbar,
  Portal,
  Dialog,
  Text,
} from "react-native-paper";
import { useTheme } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";

function Groups({ navigation }) {
  const myGroups = useSelector(selectMyGroups);
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  const [visible, setVisible] = useState(false);

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
    <View style={{ paddingTop: headerHeight - 5, flex: 1 }}>
      <Appbar.Header mode="small">
        <Appbar.Content title="Groups" />
        <Appbar.Action
          icon="information"
          onPress={() => {
            setVisible(true);
          }}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            setVisible(true);
          }}
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => {
            setVisible(true);
          }}
        />
      </Appbar.Header>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Button fucntionality not yet implemented for MVP 2.0
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView
        style={{
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        {myGroups.map((item, i) => {
          return (
            <List.Item
              key={i}
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
