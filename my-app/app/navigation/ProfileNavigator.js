import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {ProfileScreen,EditProfile} from "../screens";

const Stack = createNativeStackNavigator();

const ProfileNavigator = ({navigation}) => (
  <Stack.Navigator initialRouteName="Your Profile">
    <Stack.Screen name="Your Profile" component={ProfileScreen} options={{
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
    <Stack.Screen name="Edit Profile" component={EditProfile} />
  </Stack.Navigator>
);

export default ProfileNavigator;