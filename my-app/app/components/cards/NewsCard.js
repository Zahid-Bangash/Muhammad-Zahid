import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function NewsCard({ uri, onPress, date, description }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image
          resizeMode="stretch"
          source={uri !== "" ? { uri: uri } : require("../../assets/team1.jpg")}
          style={{
            width: "100%",
            height: 120,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <Text numberOfLines={2} style={{ padding: 3 }}>
          {description}
        </Text>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: "#000",
            marginTop: 10,
          }}
        ></View>
        <Text style={{ textAlign: "center", marginTop: 5, fontWeight: "500" }}>
          {date}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.24,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 20,
    elevation: 5,
  },
});
