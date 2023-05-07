import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Context } from "../components/ContextProvider";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import PlayerCardForTeamDetails from "../components/PlayerCardForTeamDetails";

export default function TeamDetails({ route, navigation }) {
  const { teams, setTeams } = useContext(Context);
  const { teamId } = route.params;
  let team = teams.find((team) => team.id === teamId);

  const deletePlayer = async (index) => {
    const teamDocRef = doc(db, "users", auth.currentUser.uid, "Teams", teamId);
    const publicTeamRef = collection(db, "Teams", teamId);
    const updatedTeam = team.players.splice(index, 1);
    await updateDoc(publicTeamRef, {
      players: updatedTeam,
    });
    updateDoc(teamDocRef, {
      players: updatedTeam,
    })
      .then(() => {
        const updatedTeams = [...teams];
        team = updatedTeam;
        setTeams(updatedTeams);
        console.log("Removed");
      })
      .catch((error) => {
        console.error("Error deleting player:", error);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 30, textAlign: "center" }}>
        {team.name}
      </Text>
      <ScrollView>
        {team.players &&
          team.players.map((player, index) => (
            <PlayerCardForTeamDetails
              name={player.name}
              contact={player.contact}
              key={index}
              onPress={() => deletePlayer(index)}
            />
          ))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          justifyContent: "space-around",
          width: "100%",
          backgroundColor: "red",
          height: 50,
          alignItems: "center",
        }}
      >
        <TouchableOpacity style={{}}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Add Player", { teamId: teamId })}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Add Player</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0dede",
  },
});
