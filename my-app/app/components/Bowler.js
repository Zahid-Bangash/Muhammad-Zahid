import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function Bowler({ overs, middens, runs, wickets, eco, name }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "500", flex: 3 }}>{name}</Text>
      <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
        {overs}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {runs}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {middens}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {wickets}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {eco}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
});
