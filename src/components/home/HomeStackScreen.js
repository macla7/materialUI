import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Home.js";
// import BidForm from "../posts/bids/BidForm";
// import BidConfirmation from "../posts/bids/BidConfirmation";
// import PostScreen from "../posts/PostScreen.js";
// import PostSettings from "../posts/PostSettings";
// import ConfirmDeletePost from "../posts/ConfirmDeletePost";
// import InfoStackScreen from "./InfoStackScreen";
// import { Text, Pressable, InfoOutlineIcon, Center } from "native-base";
// import ConfirmBids from "../groups/ConfirmBids";
// import CommentSettings from "../posts/comments/CommentSettings";
// import ConfirmDeleteComment from "../posts/comments/ConfirmDeleteComment";
import { View, Text } from "react-native-paper";
import BidForm from "../posts/bids/BidForm.js";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen name="Offer Shift" component={BidForm} />
      {/* <HomeStack.Screen
        name="Home Feed"
        component={Home}
        options={({ route }) => ({
          headerTitle: (props) => (
            <Text fontSize="3xl" color="#fff" fontWeight="500">
              Shift It.
            </Text>
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate("InfoStackScreen")}>
              <InfoOutlineIcon color="#fff" size="6" />
            </Pressable>
          ),
        })}
      />
      <HomeStack.Screen name="Bid" component={BidForm} />
      <HomeStack.Screen name="Bid Confirmation" component={BidConfirmation} />
      <HomeStack.Screen
        name="Post"
        component={PostScreen}
        options={{
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="Post Settings"
        component={PostSettings}
        options={{
          presentation: "modal",
        }}
      />
      <HomeStack.Screen
        name="Comment Settings"
        component={CommentSettings}
        options={{
          presentation: "modal",
        }}
      />
      <HomeStack.Screen
        name="Confirm Delete Post"
        component={ConfirmDeletePost}
        options={{
          presentation: "modal",
        }}
      />
      <HomeStack.Screen
        name="Confirm Delete Comment"
        component={ConfirmDeleteComment}
        options={{
          presentation: "modal",
        }}
      />
      <HomeStack.Screen
        name="InfoStackScreen"
        component={InfoStackScreen}
        options={{
          presentation: "modal",
          title: "Info",
        }}
      />
      <HomeStack.Screen
        name="Approve Bids"
        component={ConfirmBids}
        options={{
          presentation: "modal",
        }}
      /> */}
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
