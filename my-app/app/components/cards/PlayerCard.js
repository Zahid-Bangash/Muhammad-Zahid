import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

export default function PlayerCard({
  name,
  onPressProfile,
  onPressInsight,
  image,
  matches,
  runs,
  wickets,
  type,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={image}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <View style={{ justifyContent: "center", marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            {name}
          </Text>
          <Text style={{ color: "white" }}>{type}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", color: "white" }}>Matches</Text>
          <Text style={{ color: "white" }}>{matches}</Text>
        </View>
        <View
          style={{ borderWidth: 0.5, borderLeftColor: "white", height: 25 }}
        ></View>
        <View>
          <Text style={{ fontWeight: "bold", color: "white" }}>Runs</Text>
          <Text style={{ color: "white" }}>{runs}</Text>
        </View>
        <View
          style={{ borderWidth: 0.5, borderLeftColor: "white", height: 25 }}
        ></View>
        <View>
          <Text style={{ fontWeight: "bold", color: "white" }}>wickets</Text>
          <Text style={{ color: "white" }}>{wickets}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "red",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <TouchableOpacity
          onPress={onPressProfile}
          style={{
            width: "50%",
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Profile</Text>
        </TouchableOpacity>
        <View
          style={{ borderWidth: 0.5, borderLeftColor: "white", height: 28 }}
        ></View>
        <TouchableOpacity
          onPress={onPressInsight}
          style={{
            width: "50%",
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Insight</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width * 0.9,
    height: Dimensions.get("screen").height * 0.2,
    backgroundColor: "#000",
    borderRadius: 20,
    marginLeft: 20,
    elevation: 5,
    padding: 20,
  },
});
