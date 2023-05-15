import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ClubCard({ name, onPress, image, address }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <ImageBackground
        blurRadius={1}
        source={image}
        style={styles.container}
        imageStyle={{ borderRadius: 20 }}
      >
        <Text
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
          }}
        >
          {name}
        </Text>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: "white",
            marginTop: 20,
          }}
        ></View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            color: "white",
            fontWeight: "bold",
          }}
        >
          {address}
        </Text>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width*0.90,
    height: Dimensions.get('screen').height*0.20,
    borderRadius: 20,
    marginLeft: 20,
    elevation: 5,
    padding: 20,
  },
});
