import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Context } from "../components/ContextProvider";

import * as ImagePicker from "expo-image-picker";
// import { Camera } from "expo-camera";

import { ref, uploadBytes } from "@firebase/storage";
import { auth, storage } from "../config/firebase-config";

import AppButton from "../components/AppButton";

export default function ProfileScreen({ navigation }) {
  const { profileImageUri, setprofileImageUri, userData } = useContext(Context);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `ProfileImages/dp${auth.currentUser.uid}`);
      await uploadBytes(imageRef, blob);
      setprofileImageUri(result.uri);
      console.log("Image uploaded successfully");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          width: 150,
          height: 150,
          marginTop: 10,
        }}
      >
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri }}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        ) : (
          <Image
            source={require("../assets/profile.jpeg")}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",
            top: -40,
          }}
          onPress={pickImage}
        >
          <Ionicons name="camera" size={30} />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>{userData.Name}</Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Ionicons name="location" size={19} color="#FE7F0A" />
        <Text style={{ marginLeft: 10, fontSize: 17 }}>
          {userData.Location}
        </Text>
      </View>
      <View
        style={{
          width: "90%",
          marginTop: 20,
          padding: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ marginTop: 20 }}>FULL NAME</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.Name}</Text>
          <Text style={{ marginTop: 20 }}>PLAYING ROLE</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.PlayingRole}</Text>
          <Text style={{ marginTop: 20 }}>BOWLING STYLE</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.BowlingStyle}</Text>
          <Text style={{ marginTop: 20 }}>EMAIL</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.Email}</Text>
        </View>
        <View>
          <Text style={{ marginTop: 20 }}>DATE OF BIRTH</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.DOB}</Text>
          <Text style={{ marginTop: 20 }}>BATTING STYLE</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.BattingStyle}</Text>
          <Text style={{ marginTop: 20 }}>Shirt Number</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.ShirtNumber}</Text>
          <Text style={{ marginTop: 20 }}>MOBILE NUMBER</Text>
          <Text style={{ fontWeight: "bold" }}>{userData.PhoneNumber}</Text>
        </View>
      </View>
      <AppButton
        style={{ width: "50%", marginTop: 70 }}
        onPress={() => navigation.navigate("Edit Profile")}
      >
        Edit Info
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
