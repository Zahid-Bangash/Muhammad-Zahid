import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TournamentCard({
  name,
  city,
  teams,
  status,
  onPress,
  image,
  startDate,
  endDate,
  style,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, style]}>
        <Text style={{ position: "absolute", top: 5, right: 12, color: "red" }}>
          {status}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={image}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              numberOfLines={2}
              style={{ fontWeight: "bold", width: "95%" }}
            >
              {name} - {city}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="groups" size={22} color="#FE7F0A" />
              <Text style={{ marginLeft: 5 }}>{teams} teams</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: "#000",
            marginTop: 20,
          }}
        ></View>
        <Text
          style={{ textAlign: "center", marginTop: 20 }}
        >{`${startDate} to ${endDate}`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.2,
    borderRadius: 20,
    marginLeft: 20,
    backgroundColor: "white",
    elevation: 5,
    padding: 20,
  },
});
