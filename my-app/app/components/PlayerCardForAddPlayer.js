import React from "react";
import { View, Text, StyleSheet,TouchableOpacity } from "react-native";

export default function Player({ name,contact,onPress }) {
  return (
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
      <View>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{name}</Text>
      <Text style={{fontSize:15}}>{contact}</Text>
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
    marginBottom:5,
  },
});
