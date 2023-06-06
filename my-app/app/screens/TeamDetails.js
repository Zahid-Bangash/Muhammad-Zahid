import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import { Context } from "../components/ContextProvider";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase-config";
import { ref, deleteObject } from "@firebase/storage";
import PlayerCardForTeamDetails from "../components/PlayerCardForTeamDetails";
import AppButton from "../components/AppButton";

export default function TeamDetails({ route, navigation }) {
  const { teams, setTeams, showModal, setshowModal } = useContext(Context);
  const { teamId, modalVisible } = route.params;
  let team = teams.find((team) => team.id === teamId);

  const deleteTeam = () => {
    Alert.alert("Confirm", "Are you sure you want to remove the team?", [
      {
        text: "No",
        onPress: () => {
          setshowModal(false);
        },
      },
      {
        text: "Yes",
        onPress: async () => {
          const updatedTeams = teams.filter((team) => team.id !== teamId);
          setTeams(updatedTeams);
          setshowModal(false);
          navigation.goBack();
          await deleteDoc(
            doc(db, "users", auth.currentUser.uid, "Teams", teamId)
          );
          await deleteDoc(doc(db, "Teams", teamId));
          if (team.image !== "") {
            const storageRef = ref(storage, team.image);
            await deleteObject(storageRef);
          }
        },
      },
    ]);
  };

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
        backdropColor="transparent"
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
          height: Dimensions.get("screen").height * 0.068,
          backgroundColor: "#d4d8d8",
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={deleteTeam}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 15,
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
        {team?.name}
      </Text>
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          alignItems: "center",
          padding: 15,
          paddingBottom: "15%",
        }}
      >
        {team?.players &&
          team?.players.map((player, index) => (
            <PlayerCardForTeamDetails
              name={player.Name}
              uri={player.image}
              contact={player.PhoneNumber}
              key={player.id}
              onPress={() => deletePlayer(index)}
            />
          ))}
      </ScrollView>
      <AppButton
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderRadius: 0,
          height: "8%",
          marginVertical: 0,
        }}
        onPress={() => navigation.navigate("Add Player", { teamId: teamId })}
      >
        Add Player
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0dede",
  },
});
