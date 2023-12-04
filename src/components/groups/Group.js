import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMemberships,
  isUserAMember,
  isUserAnAdmin,
  selectIsAdmin,
  fetchMembershipsAsync,
} from "./memberships/membershipSlice";
import { selectPosts, fetchPostsAsync } from "../posts/postSlice";
// import Posts from "../posts/Posts";
import { View, Text, ScrollView, Image } from "react-native";
import { selectUserId } from "../sessions/sessionSlice";
import {
  List,
  Avatar,
  useTheme,
  Appbar,
  IconButton,
  Portal,
  Modal,
  Button,
} from "react-native-paper";

// Atm getting user through props so I can have it 'on mount' to determine
// admin status from memberships API. It doesn't seem to work
// if I try and grab from state.
function Group({ route, navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { group } = route.params;
  const userId = useSelector(selectUserId);
  const isAdmin = useSelector(selectIsAdmin);
  const memberships = useSelector(selectMemberships);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 10,
    marginRight: "10%",
    marginLeft: "10%",
    borderRadius: 12,
    height: 135,
  };

  useEffect(() => {
    dispatch(fetchMembershipsAsync(group.id));
  }, []);

  useEffect(() => {
    dispatch(isUserAMember(userId));
    dispatch(isUserAnAdmin(userId));
  }, [memberships.length]);

  function refresh() {
    dispatch(fetchPostsAsync(group.id));
  }

  const handleDelete = async () => {
    // delete membership
  };

  const LeftContent = (source) => {
    return (
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
  };

  const RightContent = (source) => {
    if (isAdmin) {
      return (
        <IconButton
          icon="pencil"
          mode="contained"
          size={16}
          iconColor={theme.colors.onTertiary}
          containerColor={theme.colors.tertiary}
          onPress={showModal}
        />
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "stretch",
      }}
    >
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={group.name} />
        <Appbar.Action icon="information" />
        <Appbar.Action icon="plus" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      {/* <CScrollBackgroundRefresh refreshAction={() => refresh()}> */}
      {/* <Posts navigation={navigation} posts={posts} /> */}
      {/* </CScrollBackgroundRefresh> */}
      <ScrollView
        style={{
          paddingLeft: 15,
        }}
      >
        {memberships.map((item, i) => {
          return (
            <List.Item
              key={i}
              title={item.user.name}
              description={item.role}
              left={() => LeftContent(item.user.avatar_url)}
              right={() => RightContent()}
              onPress={() => {
                if (isAdmin) {
                  showModal();
                }
              }}
            />
          );
        })}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate("CreatePostStack", {
                  screen: "Create Post",
                  params: {
                    id: shift.id,
                    returnScreen: "Calendar",
                  },
                });
                hideModal();
              }}
              icon="calendar-multiple"
            >
              Promote to Admin
            </Button>
            {/* <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              icon="pencil"
              onPress={() => {
                navigation.navigate("CreatePostStack", {
                  screen: "Add Shift",
                  params: {
                    id: shift.id,
                    returnScreen: "Calendar",
                  },
                });
                hideModal();
              }}
              buttonColor={theme.colors.tertiary}
            >
              Edit
            </Button> */}
            <Button
              mode="contained"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              icon="delete"
              onPress={handleDelete}
              buttonColor={theme.colors.customPink}
            >
              Kick from Group
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

export default Group;
