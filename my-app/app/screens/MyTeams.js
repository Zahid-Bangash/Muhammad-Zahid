import React, { useState, useContext } from "react";
import { Context } from "../components/ContextProvider";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import TeamCard from "../components/cards/TeamCard";
import TeamDetails from "./TeamDetails";
import AppButton from "../components/AppButton";

export default function MyTeams({ navigation }) {
  const { teams, setTeams } = useContext(Context);

  const deleteTeam = (teamId) => {
    Alert.alert("Confirm", "Are you sure you want to remove the team?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: async () => {
          const updatedTeams = teams.filter((team) => team.id !== teamId);
          setTeams(updatedTeams);
          await deleteDoc(
            doc(db, "users", auth.currentUser.uid, "Teams", teamId)
          );
          await deleteDoc(doc(db, "Teams", teamId));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppButton
        style={{
          position: "absolute",
          bottom: 0,
          width: "95%",
          borderRadius: 0,
          height: "8%",
        }}
        onPress={() => navigation.navigate("Add Your Team")}
      >
        Add Team
      </AppButton>
      {teams.length > 0 ? (
        teams.map((team) => (
          <ScrollView key={team.id}>
            <TeamCard
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
          </ScrollView>
        ))
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Team Added</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0dede",
    paddingTop: 10,
    paddingBottom: 40,
  },
});
