import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function NewsDetails({ route }) {
  const { link } = route.params;
  return (
    <View style={styles.container}>
      <WebView source={{ uri: link }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
