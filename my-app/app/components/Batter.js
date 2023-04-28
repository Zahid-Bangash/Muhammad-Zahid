import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function Batter({ name, runs, balls, fours, sixes, srate }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "500", flex: 3 }}>{name}</Text>
      <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
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
        {balls}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {fours}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {sixes}
      </Text>
      <Text
        style={{
          fontWeight: "500",
          color: "grey",
          flex: 1,
          textAlign: "center",
        }}
      >
        {srate}
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
