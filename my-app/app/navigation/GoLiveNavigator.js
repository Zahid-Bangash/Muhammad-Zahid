import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Streaming } from "../screens";

const Stack = createNativeStackNavigator();

const GoLiveNavigator = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#a10517",
      },
      headerTitleStyle: {
        color: "white",
      },
      headerTintColor: "white",
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Match Streamings"
      component={Streaming}
      options={{
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
        ),
      }}
    />
  </Stack.Navigator>
);

export default GoLiveNavigator;
