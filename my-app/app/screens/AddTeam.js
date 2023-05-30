import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Context } from "../components/ContextProvider";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { auth, db } from "../config/firebase-config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";

export default function Addteam({ navigation }) {
  const { teams, setTeams } = useContext(Context);

  const [teamDetails, setteamDetails] = useState({
    name: "",
    place: "",
    captain: { name: "", id: "" },
    players: [],
    image: "",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setteamDetails({ ...teamDetails, image: result.uri });
    }
  };

  const addTeam = async () => {
    if (teamDetails.name === "" || teamDetails.place === "") {
      alert("Empty fields");
      return;
    }
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const teamsRef = collection(userRef, "Teams");
      const docRef = await addDoc(teamsRef, teamDetails);
      const publicTeamRef = doc(db, "Teams", docRef.id);
      await setDoc(publicTeamRef, teamDetails);
      const updatedTeams = [...teams, { id: docRef.id, ...teamDetails }];
      setTeams(updatedTeams);
      console.log("Team created");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating team: ", error);
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
        {teamDetails.image !== "" ? (
          <Image
            source={{ uri: teamDetails.image }}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        ) : (
          <Image
            source={require("../assets/team.jpg")}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "brown",
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
          <Ionicons name="camera" size={25} color="white" />
        </TouchableOpacity>
      </View>
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
