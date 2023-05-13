import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Context } from "../components/ContextProvider";

export default function MyMatches() {
  const { myMacthes } = useContext(Context);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          width: "95%",
          height: 150,
          borderRadius: 20,
          backgroundColor: "white",
          elevation: 5,
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "grey",
            fontWeight: "bold",
          }}
        >{`Open match, Club Cricket, 09/02/23`}</Text>
        <Text
          style={{
            color: "red",
            position: "absolute",
            top: 5,
            right: 10,
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          live
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../assets/team3.jpg")}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              Abid
            </Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>53-1(0.3)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "#e0dede",
    paddingTop: 10,
  },
});
