import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
// import { Button } from "native-base";
import { logoutUserAsync } from "../sessions/sessionSlice";
// import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import {
  selectCurrentPushToken,
  destroyPushTokenAsync,
} from "../users/pushTokenSlice";

const ProfileStack = createNativeStackNavigator();

// Putting Notifications and Profile components into their own StackScreens
// might seem like overkill, and it wasn't the original plan, alas... it was
// the only way i could find to make the header heights VISUALlY, look the
// same. I stress visually, as they were apparently all 103 high. The
// difference was between the nested stack.screens and the un nested tab.screens.
// Now... they are just all nested stack screens.. as can be seen by the below.
function GroupsStackScreen() {
  const dispatch = useDispatch();
  const currentPushToken = useSelector(selectCurrentPushToken);

  function onLogout() {
    dispatch(logoutUserAsync());
    dispatch(destroyPushTokenAsync(currentPushToken));
  }

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={({ route }) => ({
          // headerRight: () => (
          //   <Button
          //     onPress={() => onLogout()}
          //     size="sm"
          //     variant="myButtonYellowVariant"
          //   >
          //     Logout
          //   </Button>
          // ),
          // headerTransparent: true,
        })}
      />
      {/* <ProfileStack.Screen
        name="Delete Account"
        component={ConfirmDeleteAccount}
        options={{
          presentation: "modal",
        }}
      /> */}
    </ProfileStack.Navigator>
  );
}

export default GroupsStackScreen;
