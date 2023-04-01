import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";

export default function MatchCenter() {
  const [swiperIndex, setSwiperIndex] = useState(0);

  const handleButtonPress = (index) => {
    setSwiperIndex(index);
  };
  const renderPagination = () => (
    <View
      style={{
        flexDirection: "row",
        position: "absolute",
        borderBottomWidth: 1,
        borderColor: "gray",
      }}
    >
      <TouchableOpacity
        onPress={() => handleButtonPress(1)}
        style={[styles.button, swiperIndex === 0 && styles.activeButton]}
      >
        <Text style={styles.buttonText}>Scoring</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress(0)}
        style={[styles.button, swiperIndex === 1 && styles.activeButton]}
      >
        <Text style={styles.buttonText}>Scorecard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress(2)}
        style={[styles.button, swiperIndex === 2 && styles.activeButton]}
      >
        <Text style={styles.buttonText}>Info</Text>
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
        <View
          style={{
            flex: 2.5,
            width: "100%",
            marginTop: 44,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: "gray",
          }}
        >
          <Text>Team</Text>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>150-0</Text>
          <Text>(0.4/5)</Text>
        </View>
        <View
          style={{
            flex: 2.5,
            borderBottomWidth: 1,
            borderColor: "gray",
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <View
            style={{
              flex: 2.5,
              justifyContent: "space-around",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Batsman</Text>
            <Text>Zahid*</Text>
            <Text>Bangash</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>R</Text>
            <Text>54</Text>
            <Text>54</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>B</Text>
            <Text>54</Text>
            <Text>54</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>4s</Text>
            <Text>5</Text>
            <Text>54</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>6s</Text>
            <Text>1</Text>
            <Text>54</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>SR</Text>
            <Text>254</Text>
            <Text>54</Text>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            borderBottomWidth: 1,
            borderColor: "gray",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 2.5,
              justifyContent: "space-around",
              height: "100%",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Bowler</Text>
            <Text>Zahid</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>O</Text>
            <Text>54</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>M</Text>
            <Text>54</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>R</Text>
            <Text>5</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>W</Text>
            <Text>1</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Eco</Text>
            <Text>254</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1.5,
            borderBottomWidth: 1,
            borderColor: "gray",
            width: "100%",
          }}
        ></View>
        <View
          style={{
            flex: 1.3,
            borderBottomWidth: 1,
            borderColor: "gray",
            width: "100%",
          }}
        ></View>
        <View style={{ flex: 4, backgroundColor: "red", width: "100%" }}></View>
      </View>
      <View style={styles.slide}>
        <Text style={styles.buttonText}>Scorecard Screen</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.buttonText}>Info Screen</Text>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    borderBottomWidth: 3,
    borderColor: "black",
  },
});
