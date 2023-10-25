import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Notifications from "./Notifications";
// import { Button, HStack, Text } from "native-base";

const NotificationsStack = createNativeStackNavigator();

// Putting Notifications and Profile components into their own StackScreens
// might seem like overkill, and it wasn't the original plan, alas... it was
// the only way i could find to make the header heights VISUALlY, look the
// same. I stress visually, as they were apparently all 103 high. The
// difference was between the nested stack.screens and the un nested tab.screens.
// Now... they are just all nested stack screens.. as can be seen by the below.
function NotificationsStackScreen({ navigation }) {
  return (
    <NotificationsStack.Navigator>
      <NotificationsStack.Screen
        name="Notifications"
        component={Notifications}
      />
    </NotificationsStack.Navigator>
  );
}

export default NotificationsStackScreen;
