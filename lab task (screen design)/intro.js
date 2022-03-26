import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Logo() {
  return (
    <View style={styles.parentContainer}>
      <View style={styles.childContainer}>
        <Image style={styles.pic} source={require("../assets/logo.png")} />
      </View>
      <Text style={styles.txt}>Discover Your Own Dream House</Text>
      <Text style={styles.txt2}>
        hi there how are fine and you etc hi there how are fine and you etc hi
        there how are fine and you etc
      </Text>
      <View style={{ flexDirection: "row", paddingTop: 30 }}>
        <Text style={styles.btn}>Sign in</Text>
        <Text style={styles.btn2}>Register</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: "black",
    borderRadius: 40,
    width: 320,
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 8,
  },
  childContainer: {
    backgroundColor: "pink",
    borderRadius: 40,
    width: 300,
    height: 340,
  },
  pic: {
    width: 300,
    height: 300,
  },
  txt: {
    color: "white",
    fontSize: 30,
    width: 280,
    textAlign: "center",
    paddingTop: 20,
  },
  txt2: {
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "pink",
    color: "white",
    width: 160,
    lineHeight: 50,
    textAlign: "center",
    fontSize: 25,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  btn2: {
    fontSize: 25,
    width: 140,
    backgroundColor: "white",
    color: "black",
    lineHeight: 50,
    textAlign: "center",
    borderBottomRightRadius: 10,
    borderTopEndRadius: 10,
  },
});
