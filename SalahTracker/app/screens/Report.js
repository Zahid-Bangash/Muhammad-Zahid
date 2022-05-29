import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import HorizontalBarGraph from "@chartiful/react-native-horizontal-bar-graph";

export default function Report({ data, labels, title, message }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={styles.title}>{title}</Text>
      <HorizontalBarGraph
        data={data}
        labels={labels}
        width={Dimensions.get("screen").width - 10}
        height={400}
        barColor="pink"
        style={styles.chartStyle}
        baseConfig={{
          hasYAxisBackgroundLines: true,
          xAxisLabelStyle: {
            rotation: 0,
            fontSize: 11,
            width: 50,
            yOffset: 4,
            xOffset: -15,
          },
          yAxisLabelStyle: {
            fontSize: 13,
            prefix: "",
            position: "bottom",
            // xOffset: 15,
            height: 90,
          },
        }}
      />
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 30,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#a83299",
  },
  chartStyle: {
    // backgroundColor: "#a5b6b8",
  },
  msg: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});
