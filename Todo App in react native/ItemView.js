import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";

export default function ItemView(props) {
  const [ischecked, setischecked] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>{props.item}</Text>
      <Checkbox
        color={ischecked ? "#4630EB" : undefined}
        value={ischecked}
        onValueChange={setischecked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e394cf",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txt: {
    fontWeight: "bold",
  },
});
