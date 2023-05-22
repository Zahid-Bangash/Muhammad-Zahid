import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
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
import { SlideInLeft } from "react-native-reanimated";

export default function TeamDetails({ route, navigation }) {
  const { teams, setTeams, showModal, setshowModal } = useContext(Context);
  const { teamId, modalVisible } = route.params;
  let team = teams.find((team) => team.id === teamId);

  const deletePlayer = async (index) => {
    const teamDocRef = doc(db, "users", auth.currentUser.uid, "Teams", teamId);
    const publicTeamRef = doc(db, "Teams", teamId);
    const updatedPlayers = team.players.splice(index, 1);
    await updateDoc(publicTeamRef, {
      players: updatedPlayers,
    });
    updateDoc(teamDocRef, {
      players: updatedPlayers,
    })
      .then(() => {
        const updatedTeams = [...teams];
        team = updatedPlayers;
        setTeams(updatedTeams);
        console.log("Removed");
      })
      .catch((error) => {
        console.error("Error deleting player:", error);
      });
  };
  return (
    <View style={styles.container}>
      <Modal
        isVisible={showModal}
        animationType="slide"
        animationIn={"slideInRight"}
        animationOut={"slideOutRight"}
        onRequestClose={() => setshowModal(false)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          margin: 0,
          width: Dimensions.get("screen").width * 0.6,
          height: Dimensions.get("screen").height * 0.3,
          backgroundColor: "#b7afa6",
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                marginLeft: 20,
              }}
            >
              <AntDesign name="delete" size={25} color="black" />
              <Text
                style={{ fontWeight: "bold", fontSize: 17, marginLeft: 20 }}
              >
                Delete Team
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
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
