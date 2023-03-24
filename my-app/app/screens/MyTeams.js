import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";

import TeamCard from "../components/cards/TeamCard";
import TeamDetails from "./TeamDetails";

export default function MyTeams({ navigation }) {
  const [teams, setTeams] = useState([]);

  const getAllTeams = async () => {
    const teams = [];
    const querySnapshot = await getDocs(collection(db, "teams"));

    querySnapshot.forEach((doc) => {
      teams.push({ id: doc.id, ...doc.data() });
    });

    return teams;
  };
  const deleteTeam = async (id) => {
    try {
      await deleteDoc(doc(db, 'teams', id)).then(()=>fetchTeams())
      console.log('Team deleted successfully')
    } catch (error) {
      console.error('Error deleting team: ', error);
    }
  };
  const fetchTeams = async () => {
    const allTeams = await getAllTeams();
    setTeams(allTeams);
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchTeams();
    }, [])
  );
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
            // captain={team.captain}
            onDelete={()=>deleteTeam(team.id)}
            onPress={() => navigation.navigate("Team Details", { team: team })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0dede",
    paddingBottom: 40,
  },
});
