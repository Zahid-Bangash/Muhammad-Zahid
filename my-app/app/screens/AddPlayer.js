import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Context } from "../components/ContextProvider";
import { collection, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import AppTextInput from "../components/AppTextInput";
import PlayerCardForAddPlayer from "../components/PlayerCardForAddPlayer";

export default function AddPlayer({ route }) {
  const { teams, setTeams, players } = useContext(Context);
  const { teamId } = route.params;

  const [name, setname] = useState("");
  const [users, setUsers] = useState([]);
  const [searchStatus, setsearchStatus] = useState("");

  const updatedTeams = [...teams];
  let teamToUpdate = updatedTeams.find((team) => team.id === teamId);
  const updatedTeam = { ...teamToUpdate };

  const searchByName = async () => {
    const searchResults = players.filter((doc) =>
      doc["Name"].toLowerCase().includes(name.toLowerCase())
    );

    const resultFinal = searchResults.filter(
      (teamSearch) =>
        !updatedTeam.players.some((team) => team.id === teamSearch.id)
    );

    if (resultFinal.length > 0) {
      setUsers(resultFinal);
      setsearchStatus("");
    } else {
      setUsers([]);
      setsearchStatus("No player to be added");
    }
  };

  const addPlayerToTeam = async (user) => {
    const teamRef = doc(db, "users", auth.currentUser.uid, "Teams", teamId);
    const publicTeamRef = doc(db, "Teams", teamId);
    try {
      await updateDoc(teamRef, {
        players: arrayUnion(user),
      });
      await updateDoc(publicTeamRef, {
        players: arrayUnion(user),
      });
      updatedTeam.players.push(user);
      teamToUpdate = updatedTeam;
      setTeams(updatedTeams);
      alert("Player added");
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else {
      setUsers([]);
      setsearchStatus("");
    }
  }, [name]);

  return (
    <View style={styles.container}>
      <AppTextInput
        placeholder="Search Player"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        value={name}
        onChangeText={(text) => setname(text)}
        style={{ marginBottom: 50 }}
      />
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ padding: 10, alignItems: "center" }}
      >
        {users.length > 0 ? (
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
                location={user.Location}
                uri={user.image}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {searchStatus}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
