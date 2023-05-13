import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function NewsCard({ uri, onPress, date, description }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image
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
    width: 320,
    height: 200,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 20,
    elevation: 5,
    // padding: 20,
  },
});
