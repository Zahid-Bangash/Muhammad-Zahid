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

import TeamCard from "../components/cards/TeamCard";
import TeamDetails from "./TeamDetails";
import AppButton from "../components/AppButton";

export default function MyTeams({ navigation }) {
  const { teams, setTeams } = useContext(Context);

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
