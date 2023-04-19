import * as React from "react";
import { StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { auth } from "./app/config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";
export default function App() {
  const [currentUser, setcurrentUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setcurrentUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#743a04" />
      {currentUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
