import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MatchCard({ name, place, captain, onPress, onDelete }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/team4.jpg")}
          style={{ width: 60, height: 60, borderRadius: 30, marginLeft: 10 }}
        />
        <View style={{ marginLeft: 5, width: "78%" }}>
          <Text style={{ fontWeight: "bold", fontSize: 15, marginLeft: "30%" }}>
            {name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="location" size={19} color="#FE7F0A" />
              <Text>{place}</Text>
            </View>
            <Text>{`Captain: ${captain}`}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ position: "absolute", top: 5, right: 5 }}
          onPress={onDelete}
        >
          <AntDesign name="delete" size={25} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.1,
    borderRadius: 15,
    backgroundColor: "#e3cda3",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
