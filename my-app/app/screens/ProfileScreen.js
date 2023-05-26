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

  useEffect(() => {
    const data = {
      Team_A: ["alyan team"],
      Team_B: ["abdullah team"],
      Venue: ["attock"],
      Toss_Winner: ["alyan team"],
      Batting_First: ["alyan team"],
      Weather: ["cloudy"],
      Prev_Match_Result_A: ["loss"],
      Prev_Match_Result_B: ["loss"],
      Prev_Match_Runs_A: [95],
      Prev_Match_Runs_B: [115],
      Team_A_Player_1: ["player29"],
      Team_A_Player_2: ["player24"],
      Team_A_Player_3: ["player28"],
      Team_A_Player_4: ["player27"],
      Team_A_Player_5: ["player26"],
      Team_A_Player_6: ["player23"],
      Team_A_Player_7: ["player32"],
      Team_A_Player_8: ["player30"],
      Team_A_Player_9: ["player31"],
      Team_A_Player_10: ["player33"],
      Team_A_Player_11: ["player25"],
      Team_B_Player_1: ["player55"],
      Team_B_Player_2: ["player56"],
      Team_B_Player_3: ["player63"],
      Team_B_Player_4: ["player58"],
      Team_B_Player_5: ["player64"],
      Team_B_Player_6: ["player62"],
      Team_B_Player_7: ["player61"],
      Team_B_Player_8: ["player57"],
      Team_B_Player_9: ["player60"],
      Team_B_Player_10: ["player65"],
      Team_B_Player_11: ["player59"],
      Team_A_Batting_Average: [84],
      Team_B_Batting_Average: [117],
      Player_of_the_Match: ["player55"],
      Win_By_Runs: [22],
      Win_By_Wickets: [32],
      Run_Rate_A: [25],
      Run_Rate_B: [19],
      // OutCome: [0],
    };
    
    fetch("http://192.168.43.222:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Prediction: ", data.prediction*100);
      })
      .catch((error) => {
        console.error("Error:aa", error);
      });
  }, []);

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
