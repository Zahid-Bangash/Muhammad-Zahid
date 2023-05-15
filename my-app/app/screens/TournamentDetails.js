import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";
import AppButton from "../components/AppButton";
import TeamCard from "../components/cards/TeamCard";
export default function TournamnetDetails({ navigation }) {
  const [swiperIndex, setSwiperIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Create Tournament" }],
      });
    });

    return unsubscribe;
  }, [navigation]);

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
          Home
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
          Teams
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
          Matches
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSwiperIndex(3)}
        style={[styles.button, swiperIndex === 3 && styles.activeButton]}
      >
        <Text
          style={[
            styles.buttonText,
            swiperIndex === 3 && { fontWeight: "bold" },
          ]}
        >
          Statistics
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
      nestedScrollEnabled
    >
      <View style={[styles.slide, { backgroundColor: "white" }]}>
        <Image
          source={require("../assets/team4.jpg")}
          style={{ width: "100%", height: "27%" }}
        />
        <View
          style={{
            alignSelf: "flex-start",
            marginLeft: "2%",
            height: "10%",
            justifyContent: "space-around",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Hazro night tournament
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Organized by : Zahid
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Dates: 01/02/23 - 05/02/23
          </Text>
        </View>
        <AppButton
          style={{
            borderRadius: 0,
            width: "100%",
            height: "8%",
            marginVertical: "3%",
          }}
        >
          Start Match
        </AppButton>
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "flex-start",
            marginLeft: "2%",
            fontSize: 17,
          }}
        >
          Top Players
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            margin: "3%",
            height: "17%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Most Runs</Text>
            <Text style={{ fontWeight: "bold", fontSize: 70 }}>0</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>Team Name</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Most Runs</Text>
            <Text style={{ fontWeight: "bold", fontSize: 70 }}>0</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>Team Name</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "grey",
            width: "100%",
            margin: "5%",
          }}
        ></View>
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "flex-start",
            marginLeft: "2%",
            fontSize: 17,
          }}
        >
          Tournament Boundaries
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            margin: "3%",
            height: "17%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Sixes</Text>
            <Text style={{ fontWeight: "bold", fontSize: 70 }}>0</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Fours</Text>
            <Text style={{ fontWeight: "bold", fontSize: 70 }}>0</Text>
          </View>
        </View>
      </View>
      <View style={styles.slide}>
        <ScrollView>
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            height: "8%",
            position: "absolute",
            bottom: 0,
            justifyContent: "space-between",
          }}
        >
          <AppButton
            style={{
              width: "49.5%",
              borderRadius: 0,
              backgroundColor: "green",
              height: "100%",
            }}
          >
            Add Team
          </AppButton>
          <AppButton
            style={{
              width: "49.5%",
              borderRadius: 0,
              height: "100%",
              backgroundColor: "green",
            }}
          >
            Remove Team
          </AppButton>
        </View>
      </View>
      <View style={styles.slide}>
        <Text>matches</Text>
      </View>
      <View style={styles.slide}>
        <Text>stats</Text>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    padding: 10,
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
});
