import React from "react";
import { View, Text, StyleSheet, TextInput, Modal } from "react-native";

import AppButton from "./AppButton";

export default function ScoringModal({
  visibility,
  setVisibility,
  title,
  value,
  setValue,
  onOkPress,
}) {
  return (
    <Modal visible={visibility} animationType="fade" transparent>
      <View style={styles.container}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "70%",
          }}
        >
          <View
            style={{
              width: 180,
              height: 45,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder={title}
              keyboardType="numeric"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "black",
                width: "100%",
              }}
              placeholderTextColor="black"
              value={value.toString()}
              onChangeText={(val) => setValue(isNaN(parseInt(val))? 0 :parseInt(val))}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", height: 50 }}>
          <AppButton
            style={{
              width: "50%",
              borderRadius: 0,
              backgroundColor: "#727369",
              height: "100%",
            }}
            onPress={() => {
              setVisibility(false);
              setValue(1);
            }}
          >
            Cancel
          </AppButton>
          <AppButton
            style={{
              width: "50%",
              borderRadius: 0,
              height: "100%",
              backgroundColor: "green",
            }}
            onPress={onOkPress}
          >
            OK
          </AppButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: 200,
    backgroundColor: "#ebc67f",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
  },
});
