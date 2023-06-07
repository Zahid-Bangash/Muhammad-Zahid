import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import PlayerCardForAddPlayer from "../components/PlayerCardForAddPlayer";

export default function TeamDetails({ route, navigation }) {
  const { team } = route.params;

  return (
    <View style={styles.container}>
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
            <PlayerCardForAddPlayer
              name={player.name}
              uri={player.image}
              location={player.location}
              key={player.id}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0dede",
  },
});
