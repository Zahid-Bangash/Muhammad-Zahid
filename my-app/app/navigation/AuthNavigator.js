import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  WelcomeScreen,
  LoginScreen,
  ForgotPassword,
  RegisterScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
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
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen
      name="Forgot Password"
      component={ForgotPassword}
      options={{ headerShown: true }}
    />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
