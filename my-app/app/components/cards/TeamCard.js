import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MatchCard({
  name,
  place,
  captain,
  onPress,
  onDelete,
  uri,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image
          source={uri ? { uri: uri } : require("../../assets/team4.jpg")}
          style={{ width: 60, height: 60, borderRadius: 30, marginLeft: 10 }}
        />
        <View style={{ marginLeft: 5, width: "78%" }}>
          <Text style={{ fontWeight: "bold", fontSize: 15, marginLeft: "27%" }}>
            {name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="location" size={17} color="green" />
              <Text style={{ fontWeight: "500" }}>{place}</Text>
            </View>
            <Text
              style={{
                fontWeight: "500",
                textTransform: "capitalize",
                marginRight: 10,
              }}
            >{`C: ${captain}`}</Text>
          </View>
        </View>
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
