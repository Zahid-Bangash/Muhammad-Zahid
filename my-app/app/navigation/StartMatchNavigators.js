import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StartMatch,
  StartInnings,
  MatchCenter,
  MatchDetails,
} from "../screens";

const Stack = createNativeStackNavigator();

function StartMatchNavigator() {
  return (
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
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginRight: 30 }}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                });
              }}
            >
              <Ionicons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Start Innings" component={StartInnings} />
      <Stack.Screen name="Match Center" component={MatchCenter} />
      <Stack.Screen name="Match Details" component={MatchDetails} />
    </Stack.Navigator>
  );
}

export default StartMatchNavigator;
