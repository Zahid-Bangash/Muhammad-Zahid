import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

export default function MyMatchCard({
  team1,
  team2,
  matchFormat,
  status,
  result,
  date,
  firstInningsBalls,
  secondInningsBalls,
  firstInningsWickets,
  secondInningsWickets,
  firstInningsRuns,
  secondInningsRuns,
  style,
  onPress,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, style]}>
        <Text
          style={{
            color: "grey",
            fontWeight: "bold",
          }}
        >{`Open match, ${matchFormat}, ${date}`}</Text>
        <Text
          style={{
            color: "red",
            position: "absolute",
            top: 10,
            right: 10,
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          {status}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/team1.jpg")}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              {team1}
            </Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>
            {firstInningsBalls === 0
              ? "Yet to Bat"
              : `${firstInningsRuns}-${firstInningsWickets} (${
                  Math.floor(firstInningsBalls / 6) +
                  (firstInningsBalls % 6) / 10
                })`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/team2.jpg")}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              {team2}
            </Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>
            {secondInningsBalls === 0
              ? "Yet to Bat"
              : `${secondInningsRuns}-${secondInningsWickets} (${
                  Math.floor(secondInningsBalls / 6) +
                  (secondInningsBalls % 6) / 10
                })`}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: "#000",
            marginTop: 5,
          }}
        ></View>
        <Text
          style={{
            alignSelf: "flex-end",
            marginTop: 5,
            color: "grey",
            fontWeight: "bold",
          }}
        >
          {result}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: Dimensions.get('screen').height*0.20,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
