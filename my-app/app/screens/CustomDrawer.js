import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Screen from "../components/Screen";

import { auth, db, storage } from "../config/firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";

import { Context } from "../components/ContextProvider";

export default function CustomDrawer(props) {
  const { profileImageUri, userData } = useContext(Context);
  const navigation = useNavigation();
  return (
    <Screen>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#07FFF0" }}
      >
        <View
          style={{
            height: 150,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Profile")}
          >
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Image
                source={require("../assets/profile.jpeg")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            )}
          </TouchableWithoutFeedback>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {userData.Name}
            </Text>
            <Text style={{ fontSize: 15 }}>{userData.PhoneNumber}</Text>
            <Text style={{ fontSize: 15, textTransform: "capitalize" }}>
              {userData.Email}
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: "white" }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{ backgroundColor: "white", position: "absolute", bottom: 0 }}
        onPress={() => {
          signOut(auth);
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 16 }}
        >
          <Ionicons name="log-out-outline" size={30} color="red" />
          <Text style={{ color: "red", fontWeight: "bold", marginLeft: 27 }}>
            Log out
          </Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
}
