import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

import { Context } from "../components/ContextProvider";
import { AddTournament, TournamnetDetails } from "../screens";

const Stack = createNativeStackNavigator();

export default function TournamentNavigator() {
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
        name="Create Tournament"
        component={AddTournament}
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
      <Stack.Screen
        name="Tournament Details"
        component={TournamnetDetails}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => setshowModalTournament(true)}>
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
