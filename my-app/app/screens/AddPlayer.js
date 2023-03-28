import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const { teamId } = route.params;

  const [name, setname] = useState("");
  const [results, setresults] = useState([]);

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
      setresults(matchingDocuments);
      console.log(`Matching documents:`, matchingDocuments);
      return matchingDocuments;
    } catch (error) {
      console.error(error);
    }
  };

  const addPlayerToTeam = async (player) => {
    const teamRef = doc(db, "teams", teamId);
    try {
      await updateDoc(teamRef, {
        players: arrayUnion({
          id: player.id,
          name: player.Name,
          contact: player.PhoneNumber,
        })
      });
      console.log("Player added successfully!");
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
      {results.map((user,index) => (
        <TouchableOpacity
        key={index}
          style={{ width: "100%" }}
          onPress={() => {
            addPlayerToTeam(user);
            alert("Player Added to team");
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
