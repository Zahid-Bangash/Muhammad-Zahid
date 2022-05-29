import React from 'react'
import { TouchableOpacity,Text,StyleSheet } from 'react-native'
export default function AppButton({children,onPress}) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.btn}>{children}</Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    margin: 5,
    borderRadius: 15,
    backgroundColor: "#d9213f",
  },
  btn: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});
