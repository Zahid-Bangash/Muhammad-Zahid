import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  HomeScreen,
  Search,
  News,
  MatchDetails,
  TournamnetDetails,
  ProfileScreen,
  NewsDetails,
} from "../screens";

const Stack = createNativeStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DashBoard"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Search" component={Search} />
    <Stack.Screen name="News" component={News} />
    <Stack.Screen
      name="News Details"
      component={NewsDetails}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
