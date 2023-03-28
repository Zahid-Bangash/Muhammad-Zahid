import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { auth, db } from "../config/firebase-config";
import { getFirestore, setDoc, doc, addDoc, collection } from "firebase/firestore";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";

export default function Addteam({ navigation }) {
  const [teamDetails, setteamDetails] = useState({
    name: "",
    place: "",
    players: [],
  });

  const addTeam = async (teamName, players) => {
    if (teamDetails.name === "" && teamDetails.place === "") {
      alert("Empty field");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "teams"), {
        name: teamDetails.name,
        place: teamDetails.place,
        players: teamDetails.players,
      }).then(() => {
        console.log("Team added");
        navigation.goBack();
      })
    } catch (error) {
      console.error("Error adding team: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 1,
          borderColor: "black",
          marginTop: 50,
        }}
      ></View>
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Team logo</Text>
      <AppTextInput
        placeholder="Enter Team Name"
        value={teamDetails.name}
        onChangeText={(text) => setteamDetails({ ...teamDetails, name: text })}
      />
      <AppTextInput
        placeholder="Enter Place"
        value={teamDetails.place}
        onChangeText={(text) => setteamDetails({ ...teamDetails, place: text })}
      />
      <AppButton
        onPress={addTeam}
        style={{ position: "absolute", bottom: 100, width: "82%" }}
      >
        Add
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   justifyContent:'center',
    alignItems: "center",
  },
});
