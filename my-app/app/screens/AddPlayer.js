import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import TeamsContext from "../components/TeamsContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

import AppTextInput from "../components/AppTextInput";
import PlayerCardForAddPlayer from "../components/PlayerCardForAddPlayer";

export default function AddPlayer({ route }) {
  const { teams, updateTeams } = useContext(TeamsContext);
  const { teamId } = route.params;

  const [name, setname] = useState("");
  const [users, setUsers] = useState([]);

  const searchDocumentByField = async () => {
    if (name === "") {
      alert("Please type a name");
      return;
    }
    try {
      const q = query(collection(db, "users"), where("Name", "==", name));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("No User found");
        return null;
      }
      const matchingDocuments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(matchingDocuments);
      console.log(`Matching documents:`, matchingDocuments);
    } catch (error) {
      console.error(error);
    }
  };

  const addPlayerToTeam = async (user) => {
    const teamRef = doc(db, "teams", teamId);
    try {
      await updateDoc(teamRef, {
        players: arrayUnion({
          id: user.id,
          name: user.Name,
          contact: user.PhoneNumber,
        }),
      });
      const updatedTeams = [...teams];
      let teamToUpdate = updatedTeams.find((team) => team.id === teamId);
      const updatedTeam = { ...teamToUpdate };
      updatedTeam.players.push({
        id: user.id,
        name: user.Name,
        contact: user.PhoneNumber,
      });
      teamToUpdate = updatedTeam;
      updateTeams(updatedTeams);
      alert("Player Added to team");
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <AppTextInput
        placeholder="Search Player"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        rightIcon="search"
        value={name}
        onChangeText={(text) => setname(text)}
        onPress={searchDocumentByField}
        style={{ marginBottom: 50 }}
      />
      {users.map((user, index) => (
        <TouchableOpacity
          key={index}
          style={{ width: "100%" }}
          onPress={() => {
            addPlayerToTeam(user);
          }}
        >
          <PlayerCardForAddPlayer name={user.Name} contact={user.PhoneNumber} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
