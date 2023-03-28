import React from "react";
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
          <Ionicons
            name="arrow-back"
            size={25}
            style={{ marginRight: 30 }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
      }}
    />
  </Stack.Navigator>
);

export default StartMatchNavigator;
