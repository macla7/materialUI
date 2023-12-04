import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostForm from "./PostForm";
import ShiftForm from "../shifts/ShiftForm";
import TimeAndDateScreen from "../shifts/TimeAndDateScreen";
import ShareToScreen from "./ShareToScreen";
// import GroupSearch from "../groups/GroupSearch";
// import ReserveForm from "./ReserveForm";

const CreatePostStack = createNativeStackNavigator();

function CreatePostStackScreen({ navigation }) {
  return (
    <CreatePostStack.Navigator initialRouteName="Create Post">
      <CreatePostStack.Screen
        name="Create Post"
        component={PostForm}
        initialParams={{
          postEndsDate: Date.now(),
          groupId: 0,
          groupName: "Select Group",
          description: "",
          reserve: 0,
        }}
        options={{
          headerShown: false,
        }}
      />
      <CreatePostStack.Screen
        name="Add Shift"
        component={ShiftForm}
        options={{
          headerTransparent: true,
        }}
      />
      <CreatePostStack.Screen
        name="Time and Date"
        component={TimeAndDateScreen}
        options={({ route }) => ({
          title: route.params.mode,
          headerTransparent: true,
        })}
      />
      <CreatePostStack.Screen
        name="Share To"
        component={ShareToScreen}
        options={({ route }) => ({
          headerTransparent: true,
        })}
      />

      {/* <CreatePostStack.Screen
        name="Create Post"
        component={PostForm}
        initialParams={{
          postEndsDate: Date.now(),
          groupId: 0,
          groupName: "Select Group",
          description: "",
          reserve: 0,
        }}
        options={{
          headerTransparent: true,
        }}
      />
      <CreatePostStack.Screen
        name="Time and Date"
        component={DateTimePicker}
        options={({ route }) => ({
          title: route.params.mode,
        })}
      />
      <CreatePostStack.Screen name="Your Groups" component={GroupSearch} />
      <CreatePostStack.Screen
        name="Add Shift"
        component={ShiftForm}
        options={{
          headerTransparent: true,
        }}
      />
      <CreatePostStack.Screen name="Add Reserve" component={ReserveForm} /> */}
    </CreatePostStack.Navigator>
  );
}

export default CreatePostStackScreen;
