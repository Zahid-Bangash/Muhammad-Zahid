import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  HomeScreen,
  Search,
  News,
  MatchDetails,
  ProfileScreen,
  NewsDetails,
  PublicTournamentDetails,
  PlayerProfile,
  PlayerStats,
  Team,
} from "../screens";

const Stack = createNativeStackNavigator();

const HomeNavigator = () => (
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
      name="DashBoard"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Search" component={Search} />
    <Stack.Screen name="Match Details" component={MatchDetails} />
    <Stack.Screen name="User Info" component={PlayerProfile} />
    <Stack.Screen name="Statistics" component={PlayerStats} />
    <Stack.Screen name="Team Details" component={Team} />
    <Stack.Screen name="Tournament" component={PublicTournamentDetails} />
    <Stack.Screen name="News" component={News} />
    <Stack.Screen
      name="News Details"
      component={NewsDetails}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
