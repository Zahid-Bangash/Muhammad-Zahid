import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Context } from "../components/ContextProvider";

import TournamentCard from "../components/cards/TournamentCard";

export default function MyTournaments({ navigation }) {
  const { myTournaments } = useContext(Context);
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      {myTournaments.length > 0 ? (
        <ScrollView contentContainerStyle={styles.container}>
          {myTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              style={{ marginLeft: 0, marginBottom: 10 }}
              name={tournament.name}
              teams={12}
              status={tournament.status}
              image={require("../assets/t1.jpg")}
              startDate={tournament.startDate}
              endDate={tournament.endDate}
              onPress={() =>
                navigation.navigate("Add Tournament", {
                  screen: "Tournament Details",
                  params: {
                    id: tournament.id,
                    tournamentTeams: tournament.teams,
                  },
                })
              }
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Tournaments</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    padding: 15,
  },
});
