import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { Context } from "../components/ContextProvider";
import {
  MyTournaments,
  TournamentDetails,
  MatchDetails,
  TeamDetails,
} from "../screens";

const Stack = createNativeStackNavigator();

export default function MyTournamentsNavigator() {
  const { setshowModalTournament } = useContext(Context);
  return (
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
      <Stack.Screen
        name="Tournament Details"
        component={TournamentDetails}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => setshowModalTournament(true)}>
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Match Details" component={MatchDetails} />
      <Stack.Screen name="Team Details" component={TeamDetails} />
    </Stack.Navigator>
  );
}
