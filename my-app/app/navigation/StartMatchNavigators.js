import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

import { StartMatch, StartInnings, MatchCenter } from "../screens";

const Stack = createNativeStackNavigator();

const StartMatchNavigator = ({ navigation }) => (
  <Stack.Navigator
    initialRouteName="Create Match"
    screenOptions={{
      headerStyle: {
        backgroundColor: "#a10517",
      },
      headerTitleStyle: {
        color: "white",
      },
      headerTintColor: "white",
    }}
  >
    <Stack.Screen
      name="Create Match"
      component={StartMatch}
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
    <Stack.Screen name="Start Innings" component={StartInnings} />
    <Stack.Screen name="Match Center" component={MatchCenter} />
  </Stack.Navigator>
);

export default StartMatchNavigator;
