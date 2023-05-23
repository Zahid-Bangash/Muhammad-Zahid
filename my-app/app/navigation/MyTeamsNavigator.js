import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { MyTeams, TeamDetails, AddTeam, AddPlayer } from "../screens";

import { Context } from "../components/ContextProvider";

const Stack = createNativeStackNavigator();

export default function MyTeamsNavigator({ navigation }) {
  const { setshowModal } = useContext(Context);

  return (
    <Stack.Navigator
      initialRouteName="Teams"
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
              <Ionicons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Add Your Team" component={AddTeam} />
      <Stack.Screen
        name="Team Details"
        component={TeamDetails}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => setshowModal(true)}>
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Add Player" component={AddPlayer} />
    </Stack.Navigator>
  );
}
