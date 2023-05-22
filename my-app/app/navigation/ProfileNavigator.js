import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ProfileScreen, EditProfile } from "../screens";

const Stack = createNativeStackNavigator();

const ProfileNavigator = ({ navigation }) => (
  <Stack.Navigator
    initialRouteName="Your Profile"
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
      name="My Profile"
      component={ProfileScreen}
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
    <Stack.Screen name="Edit Profile" component={EditProfile} />
  </Stack.Navigator>
);

export default ProfileNavigator;
