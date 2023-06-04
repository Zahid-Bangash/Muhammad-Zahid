import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  MyTournaments,
  TournamentDetails,
  MatchDetails,
  TeamDetails,
} from "../screens";

const Stack = createNativeStackNavigator();

const MyTournamentsNavigator = ({ navigation }) => (
  <Stack.Navigator
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
      name="All My Tournaments"
      component={MyTournaments}
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
    <Stack.Screen name="Tournament Details" component={TournamentDetails} />
    <Stack.Screen name="Match Details" component={MatchDetails} />
    <Stack.Screen name="Team Details" component={TeamDetails} />
  </Stack.Navigator>
);

export default MyTournamentsNavigator;
