import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

export default function NewsItem({ title, description, date, uri, onPress,navigation }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image
          source={uri === "" ? require("../assets/team1.jpg") : { uri: uri }}
          style={{
            width: "100%",
            height: 150,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <Text
          numberOfLines={2}
          style={{
            fontWeight: "bold",
            marginTop: 5,
            marginBottom: 5,
            fontSize: 16,
            width: "96%",
          }}
        >
          {title}
        </Text>
        <Text numberOfLines={3} style={{ fontSize: 16, width: "96%" }}>
          {description}
        </Text>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "#000",
            marginTop: 5,
            width: "96%",
          }}
        ></View>
        <Text style={{ padding: 5, fontWeight: "600" }}>{date}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 3,
  },
});
