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
      <View style={styles.slide}>
        <Image
          source={require("../assets/team4.jpg")}
          style={{ width: "100%", height: 200 }}
        />
        <Text style={{ fontWeight: "bold" }}>Name</Text>
        <Text style={{ fontWeight: "bold" }}>Organizer</Text>
        <Text style={{ fontWeight: "bold" }}>01/02/23 - 05/02/23</Text>
        <AppButton style={{ borderRadius: 0, width: "100%" }}>
          Start Match
        </AppButton>
        <Text>Teams</Text>
      </View>
      <View style={styles.slide}>
        <Text>teams</Text>
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
    paddingTop: 40,
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
