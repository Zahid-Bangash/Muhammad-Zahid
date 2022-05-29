import React from "react";
import { StyleSheet, Text } from "react-native";

export default function PrayerTitle({ children }) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
    width:90,
  },
});
