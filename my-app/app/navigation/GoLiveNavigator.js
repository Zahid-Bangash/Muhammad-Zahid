import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GoLive } from "../screens";

const Stack = createNativeStackNavigator();

const GoLiveNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Start Streaming" component={GoLive} />
  </Stack.Navigator>
);

export default GoLiveNavigator;
