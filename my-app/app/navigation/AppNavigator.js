import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
//icons
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import ContextProvider from "../components/ContextProvider";
import { MyTournaments, MyClubs, CustomDrawer } from "../screens";

import TournamentNavigator from "./TournamentNavigator";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";
import MyTeamsNavigator from "./MyTeamsNavigator";
import StartMatchNavigator from "./StartMatchNavigators";
import MyStatsNavigator from "./MyStatsNavigator";
import GoLiveNavigator from "./GoLiveNavigator";
import MyMatchesNavigator from "./MyMatchesNavigator";

const Drawer = createDrawerNavigator();

const AppNavigator = () => (
  <ContextProvider>
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#FE7F0A",
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "red",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="Add Tournament/series"
        component={TournamentNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="tournament"
              size={size}
              color={color}
            />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="Start a Match"
        component={StartMatchNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="play-sharp" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="Go Live"
        component={GoLiveNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <Entypo name="video-camera" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="My Matches"
        component={MyMatchesNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="cricket" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="My Teams"
        component={MyTeamsNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="My Tournaments"
        component={MyTournaments}
        options={{
          drawerIcon: ({ size, color }) => (
            <Entypo name="trophy" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="My Clubs"
        component={MyClubs}
        options={{
          drawerIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="cards-club"
              size={size}
              color={color}
            />
          ),
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="My Stats"
        component={MyStatsNavigator}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
          swipeEnabled: false,
        }}
      />
    </Drawer.Navigator>
  </ContextProvider>
);

export default AppNavigator;
