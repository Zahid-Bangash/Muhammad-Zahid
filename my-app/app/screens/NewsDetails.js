import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function NewsDetails({ route }) {
  const { link } = route.params;
  return <WebView style={styles.container} source={{ uri: link }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
