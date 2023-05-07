import React, { useState, useContext } from "react";
import { Context } from "../components/ContextProvider";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import TeamCard from "../components/cards/TeamCard";
import TeamDetails from "./TeamDetails";

export default function MyTeams({ navigation }) {
  const { teams, setTeams } = useContext(Context);

  const deleteTeam = async (teamId) => {
    const updatedTeams = teams.filter((team) => team.id !== teamId);
    setTeams(updatedTeams);
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "Teams", teamId));
    await deleteDoc(doc(db, "Teams", teamId));
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <Text>Add New Team</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Add Your Team")}>
          <Ionicons name="add" size={45} color="green" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            name={team.name}
            place={team.place}
            // captain={team.captain.name}
            onDelete={() => deleteTeam(team.id)}
            onPress={() =>
              navigation.navigate("Team Details", {
                teamId: team.id,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e0dede",
    paddingBottom: 40,
  },
});
