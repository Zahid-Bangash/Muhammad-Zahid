import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Context } from "../components/ContextProvider";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import AppTextInput from "../components/AppTextInput";
import PlayerCardForAddPlayer from "../components/PlayerCardForAddPlayer";

export default function AddPlayer({ route }) {
  const { teams, setTeams } = useContext(Context);
  const { teamId } = route.params;

  const [name, setname] = useState("");
  const [users, setUsers] = useState([]);

  const searchByName = async () => {
    const searchRef = collection(db, "users");
    const snapshot = await getDocs(searchRef);
    const searchResults = snapshot.docs.filter((doc) =>
      doc.data()["Name"].toLowerCase().includes(name.toLowerCase())
    );
    const result = searchResults.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(result);
  };

  const addPlayerToTeam = async (user) => {
    const teamRef = doc(db, "users", auth.currentUser.uid, "Teams", teamId);
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
      setTeams(updatedTeams);
      alert("Player Added to team");
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else setUsers([]);
  }, [name]);

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
        style={{ marginBottom: 50 }}
      />
      {users.length > 0 &&
        users.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={{ width: "100%" }}
            onPress={() => {
              addPlayerToTeam(user);
            }}
          >
            <PlayerCardForAddPlayer
              name={user.Name}
              contact={user.PhoneNumber}
            />
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
