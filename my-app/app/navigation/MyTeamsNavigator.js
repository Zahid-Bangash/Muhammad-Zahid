import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MyTeams, TeamDetails, AddTeam,AddPlayer } from "../screens";

const Stack = createNativeStackNavigator();

const MyTeamsNavigator = ({navigation}) => (
  <Stack.Navigator initialRouteName="Teams">
    <Stack.Screen name="Teams" component={MyTeams} options={{
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={25}
            style={{ marginRight: 30 }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
      }}/>
    <Stack.Screen name="Add Your Team" component={AddTeam} />
    <Stack.Screen name="Team Details" component={TeamDetails} />
    <Stack.Screen name="Add Player" component={AddPlayer} />
  </Stack.Navigator>
);

export default MyTeamsNavigator;
