import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

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
import { db } from "../config/firebase-config";

import Player from "../components/Player";

export default function TeamDetails({ route, navigation }) {
  const { teamName, players, teamId } = route.params;
  const [playersArray, setplayersArray] = useState(players);

  const deletePlayer = async (index) => {
    const teamDocRef = doc(db, 'teams', teamId);
  const newPlayers = [...playersArray]; // make a copy of players array
  newPlayers.splice(index, 1); // remove player from the copied array

  // update the players field of the team document with the newPlayers array
  updateDoc(teamDocRef, {
    players: newPlayers,
  })
    .then(() => {
      setplayersArray(newPlayers); // update the players state with the newPlayers array
      console.log("Removed");
    })
    .catch((error) => {
      console.error('Error deleting player:', error);
    });
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 30, textAlign: "center" }}>
        {teamName}
      </Text>
      <ScrollView>
        {playersArray &&
          playersArray.map((player, index) => (
            <Player
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
