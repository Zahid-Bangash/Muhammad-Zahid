import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";

export default function MyStats() {
  const [swiperIndex, setSwiperIndex] = useState(0);

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        onPress={() => setSwiperIndex(0)}
        style={[styles.button, swiperIndex === 0 && styles.activeButton]}
      >
        <Text
          style={[
            styles.buttonText,
            swiperIndex === 0 && { fontWeight: "bold" },
          ]}
        >
          Batting
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSwiperIndex(1)}
        style={[styles.button, swiperIndex === 1 && styles.activeButton]}
      >
        <Text
          style={[
            styles.buttonText,
            swiperIndex === 1 && { fontWeight: "bold" },
          ]}
        >
          Bowling
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSwiperIndex(2)}
        style={[styles.button, swiperIndex === 2 && styles.activeButton]}
      >
        <Text
          style={[
            styles.buttonText,
            swiperIndex === 2 && { fontWeight: "bold" },
          ]}
        >
          Fielding
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <Swiper
      loop={false}
      index={swiperIndex}
      onIndexChanged={(index) => setSwiperIndex(index)}
      renderPagination={renderPagination}
    >
      <View style={styles.slide}>
        <View style={[styles.row, { marginTop: 44, backgroundColor: "pink" }]}>
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Overall</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Leather</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Tennis</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Other</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Matches</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Innings</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Runs</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Balls</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Highest</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Average</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>SR</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Not out</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Ducks</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>100s</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>50s</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>30s</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>6s</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>4s</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.slide}>
        <View style={[styles.row, { marginTop: 44, backgroundColor: "pink" }]}>
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Overall</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Leather</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Tennis</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Other</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Matches</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Innings</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Overs</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Balls</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Runs</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Dots</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Wides</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>No Balls</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Maidens</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Wickets</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Average</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Economy</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Best</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>SR</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>3W</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>5W</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
      </ScrollView>
      <View style={styles.slide}>
        <View style={[styles.row, { marginTop: 44, backgroundColor: "pink" }]}>
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Overall</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Leather</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Tennis</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Other</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Catches</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Stumps</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Run Outs</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
          <Text style={styles.cell}>0</Text>
        </View>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "#d4d0cd",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  buttonText: {
    fontSize: 16,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderColor: "black",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
