import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MyTeams, TeamDetails, AddTeam,AddPlayer } from "../screens";

const Stack = createNativeStackNavigator();

const MyTeamsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Teams" component={MyTeams} />
    <Stack.Screen name="Add Your Team" component={AddTeam} />
    <Stack.Screen name="Team Details" component={TeamDetails} />
    <Stack.Screen name="Add Player" component={AddPlayer} />
  </Stack.Navigator>
);

export default MyTeamsNavigator;
