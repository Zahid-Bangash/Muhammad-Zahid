import React, { useState ,useContext} from "react";
import { View, Text, StyleSheet } from "react-native";
import {Context} from "../components/ContextProvider";

import { auth, db } from "../config/firebase-config";
import { addDoc, collection,doc } from "firebase/firestore";

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

  const addTeam = async () => {
    if (teamDetails.name === "" || teamDetails.place === "") {
      alert("Empty fields");
      return;
    }
    try {
      const userRef=doc(db,"users",auth.currentUser.uid);
      const teamsRef=collection(userRef,"Teams");
      const docRef = await addDoc(teamsRef, teamDetails);
      const updatedTeams = [...teams, { id: docRef.id, ...teamDetails }];
      setTeams(updatedTeams);
      console.log("Team added");
      navigation.goBack();
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
