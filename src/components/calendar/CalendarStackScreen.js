import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calendar from "./Calendar";

// import { Button, HStack, Text } from "native-base";

const CalendarStack = createNativeStackNavigator();

// Putting Calendar and Profile components into their own StackScreens
// might seem like overkill, and it wasn't the original plan, alas... it was
// the only way i could find to make the header heights VISUALlY, look the
// same. I stress visually, as they were apparently all 103 high. The
// difference was between the nested stack.screens and the un nested tab.screens.
// Now... they are just all nested stack screens.. as can be seen by the below.
function CalendarStackScreen({ navigation }) {
  return (
    <CalendarStack.Navigator>
      <CalendarStack.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: false,
        }}
      />
    </CalendarStack.Navigator>
  );
}

export default CalendarStackScreen;
