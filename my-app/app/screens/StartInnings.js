import React,{useState} from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StartInnings({ route }) {
  const { id } = route.params;
//add states for striker,non-striker and bowler then add sub-collection for first innings
  return (
    <View style={styles.container}>
      <Text>match Id {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
