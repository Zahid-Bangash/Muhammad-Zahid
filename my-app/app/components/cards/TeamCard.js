import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

export default function MatchCard({ name, place, captain, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View
          style={{
            width: 60,
            height: 60,
            borderWidth: 1,
            borderColor: "#07FFF0",
            borderRadius: 30,
            marginHorizontal: 20,
          }}
        ></View>
        <View style={{}}>
          <Text>{name}</Text>
          <View
            style={{
              flexDirection: "row",
              width: "60%",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text>{place}</Text>
            <Text>{captain}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 340,
    height: 100,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
