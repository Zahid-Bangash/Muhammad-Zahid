import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

import { StartMatch } from "../screens";

const Stack = createNativeStackNavigator();

const StartMatchNavigator = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Create Match">
    <Stack.Screen
      name="Create Match"
      component={StartMatch}
      options={{
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>
        ),
      }}
    />
  </Stack.Navigator>
);

export default StartMatchNavigator;
