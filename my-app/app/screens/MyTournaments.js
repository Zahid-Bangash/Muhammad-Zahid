import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Context } from "../components/ContextProvider";

import TournamentCard from "../components/cards/TournamentCard";

export default function MyTournaments() {
  const { myTournaments } = useContext(Context);
  return (
      <ScrollView contentContainerStyle={styles.container}>
        {myTournaments.length > 0 ? (
          myTournaments.map((tournament) => (
            <TournamentCard
            style={{marginLeft:0,marginBottom:10,}}
              key={tournament.id}
              name={tournament.name}
              teams={12}
              status={tournament.status}
              image={require("../assets/t1.jpg")}
              startDate={tournament.startDate}
              endDate={tournament.endDate}
            />
          ))
        ) : (
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Team</Text>
        )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight:'100%',
    alignItems: "center",
    paddingTop:15,
  },
});
