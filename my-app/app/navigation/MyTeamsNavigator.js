import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MyTeams, TeamDetails, AddTeam, AddPlayer } from "../screens";

const Stack = createNativeStackNavigator();

const MyTeamsNavigator = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Teams">
    <Stack.Screen
      name="Teams"
      component={MyTeams}
      options={{
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen name="Add Your Team" component={AddTeam} />
    <Stack.Screen name="Team Details" component={TeamDetails} />
    <Stack.Screen name="Add Player" component={AddPlayer} />
  </Stack.Navigator>
);

export default MyTeamsNavigator;
