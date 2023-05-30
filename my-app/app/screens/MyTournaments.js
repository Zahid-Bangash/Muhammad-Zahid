import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, ScrollView,Dimensions, } from "react-native";

import { Context } from "../components/ContextProvider";

import TournamentCard from "../components/cards/TournamentCard";
import AppButton from "../components/AppButton";

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
              city={tournament.city}
              teams={tournament.teams.length}
              status={tournament.status}
              image={require("../assets/t1.jpg")}
              startDate={tournament.startDate}
              endDate={tournament.endDate}
              onPress={() =>
                navigation.navigate("Add Tournament", {
                  screen: "Tournament Details",
                  params: {
                    id: tournament.id,
                  },
                })
              }
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Tournaments</Text>
      )}
      <AppButton
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderRadius: 0,
          height: "8%",
          marginVertical: 0,
        }}
        onPress={() => navigation.navigate("Add Tournament")}
      >
        Add Tournament
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    padding: 15,
    paddingBottom: Dimensions.get('screen').height*0.08,
  },
});
