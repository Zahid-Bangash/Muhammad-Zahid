import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Context } from "../components/ContextProvider";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { auth, db, storage } from "../config/firebase-config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";

export default function Addteam({ navigation }) {
  const { teams, setTeams } = useContext(Context);

  const [teamDetails, setteamDetails] = useState({
    name: "",
    place: "",
    captain: { name: "", id: "" },
    players: [],
  });
  const [image, setimage] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setimage(result.uri);
    }
  };

  const addTeam = async () => {
    if (teamDetails.name === "" || teamDetails.place === "") {
      alert("Empty fields");
      return;
    }
    try {
      const id = image.substring(image.lastIndexOf("/") + 1);
      const response = await fetch(image);
      const blob = await response.blob();
      const imageRef = ref(storage, `TeamLogos/${id}`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      const userRef = doc(db, "users", auth.currentUser.uid);
      const teamsRef = collection(userRef, "Teams");
      const docRef = await addDoc(teamsRef, {
        name: teamDetails.name,
        place: teamDetails.place,
        captain: teamDetails.captain,
        players: teamDetails.players,
        image: url,
      });
      const updatedTeams = [
        ...teams,
        { id: docRef.id, image: url, ...teamDetails },
      ];
      setTeams(updatedTeams);
      const publicTeamRef = doc(db, "Teams", docRef.id);
      await setDoc(publicTeamRef, {
        name: teamDetails.name,
        place: teamDetails.place,
        captain: teamDetails.captain,
        players: teamDetails.players,
        image: url,
      });
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
        {image !== "" ? (
          <Image
            source={{ uri: image }}
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
