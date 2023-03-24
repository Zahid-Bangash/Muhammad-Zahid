import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function Counter() {
  const [counter, setcounter] = useState(0);

  //   useEffect(() => {
  //     setcounter(counter + 1);
  //   }, []);
  return (
    <View style={styles.container}>
      <Button onPress={() => setcounter(counter + 1)}>Increment</Button>
      <Text>{counter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
