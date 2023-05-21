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
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1, }}>
      {teams.length > 0 ? (
        <ScrollView contentContainerStyle={styles.container}>
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
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Team Added</Text>
      )}
      <AppButton
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderRadius: 0,
          height: "8%",
          marginVertical:0,
        }}
        onPress={() => navigation.navigate("Add Your Team")}
      >
        Add Team
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    padding: 15,
    paddingBottom: "12.5%",
  },
});
