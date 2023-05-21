import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Player({ name, location, onPress, uri }) {
  return (
    <View style={styles.container}>
      <Image
        source={uri ? { uri: uri } : require("../assets/player1.jpg")}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginHorizontal: 20,
        }}
      />
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{name}</Text>
        <Text style={{ fontSize: 15 }}>{location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "98%",
    height: 80,
    backgroundColor: "white",
    alignSelf: "center",
    elevation: 5,
    marginBottom: 5,
  },
});
