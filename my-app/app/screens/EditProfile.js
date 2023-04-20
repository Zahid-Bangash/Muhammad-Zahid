import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";

import { db, auth } from "../config/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
export default function EditProfile({ navigation }) {
  const [userData, setUserData] = useState({
    name: "",
    location: "",
    dob: new Date("2010-01-01"),
    number: "",
    playingRole: "",
    shirtNumber: "",
  });
  console.log(userData.dob);
  const [showDatePicker, setshowDatePicker] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [playinngRole, setPlayingRole] = useState("None");
  const [battingStyle, setbattingStyle] = useState("Right-Hand Bat");
  const [bowlingStyle, setbowlingStyle] = useState("Right-Arm Fast");

  const handleDateChange = (event, selectedDate) => {
    setshowDatePicker(false);
    const currentDate = selectedDate || date;
    setUserData({ ...userData, dob: currentDate });
  };

  const toggleDropdown = (name) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const SaveInfo = async () => {
    if (userData.name === "") {
      alert("Enter your name");
      return;
    }
    if (userData.location === "") {
      alert("Enter your location");
      return;
    }
    if (userData.number === "") {
      alert("Enter your number");
      return;
    }
    if (userData.shirtNumber === "") {
      alert("Enter your shirt number");
      return;
    }
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(
        docRef,
        {
          Name: userData.name,
          Location: userData.location,
          DOB: userData.dob.toLocaleDateString(),
          PlayingRole: playinngRole,
          BattingStyle: battingStyle,
          BowlingStyle: bowlingStyle,
          PhoneNumber: userData.number,
          ShirtNumber: userData.shirtNumber,
        },
        { merge: true }
      );
      console.log("Info updated successfully!");
      navigation.pop();
    } catch (error) {
      console.error("Error updating info:", error);
    }
  };

  const playingRoles = [
    "Top-Order Batter",
    "Middle-Order Batter",
    "Wicket-Keeper Batter",
    "Bowler",
    "All-Rounder",
    "Lower-Order Batter",
    "Openinig Batter",
    "None",
  ];

  const battingStyles = ["Right-Hand Bat", "Left-Hand Bat"];

  const bowlingStyles = [
    "Right-Arm Fast",
    "Right-Arm Medium",
    "Left-Arm Fast",
    "Left-Arm Medium",
    "Slow Left-Arm Orthodox",
    "Slow Left-Arm Chinaman",
    "Right-Arm Off Break",
    "Right-Arm Leg Break",
    "None",
  ];

  return (
    <View style={styles.container}>
      <AppTextInput
        placeholder="Full Name"
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />
      <AppTextInput
        placeholder="Location"
        value={userData.location}
        onChangeText={(text) => setUserData({ ...userData, location: text })}
      />
      <TouchableWithoutFeedback onPress={() => setshowDatePicker(true)}>
        <View style={{ width: "80%" }}>
          <AppTextInput
            placeholder="Date of Birth"
            autoComplete="off"
            editable={false}
            value={userData.dob.toLocaleDateString()}
            style={{ width: "100%" }}
          />
        </View>
      </TouchableWithoutFeedback>
      {showDatePicker && (
        <DateTimePicker
          value={userData.dob}
          mode="date"
          minimumDate={new Date("1980-01-01")}
          maximumDate={new Date("2018-01-01")}
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableWithoutFeedback onPress={() => toggleDropdown("playingRole")}>
        <View style={{ width: "80%" }}>
          <AppTextInput
            placeholder="Playing Role"
            editable={false}
            value={playinngRole}
            style={{ width: "100%" }}
            rightIcon={
              openDropdown === "playingRole" ? "chevron-up" : "chevron-down"
            }
            onPress={() => toggleDropdown("playingRole")}
          />
        </View>
      </TouchableWithoutFeedback>

      {openDropdown === "playingRole" && (
        <View
          style={{
            position: "absolute",
            width: "70%",
            height: 195,
            alignSelf: "center",
            backgroundColor: "#877a65",
            top: 270,
            padding: 5,
            zIndex: 1,
            elevation: 5,
          }}
        >
          {playingRoles.map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => {
                setPlayingRole(role);
                setOpenDropdown(null);
              }}
            >
              <Text style={{ fontSize: 17, color: "white" }}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableWithoutFeedback onPress={() => toggleDropdown("battingStyle")}>
        <View style={{ width: "80%" }}>
          <AppTextInput
            placeholder="Batting Style"
            editable={false}
            value={battingStyle}
            style={{ width: "100%" }}
            rightIcon={
              openDropdown === "battingStyle" ? "chevron-up" : "chevron-down"
            }
            onPress={() => toggleDropdown("battingStyle")}
          />
        </View>
      </TouchableWithoutFeedback>

      {openDropdown === "battingStyle" && (
        <View
          style={{
            position: "absolute",
            width: "70%",
            height: 70,
            alignSelf: "center",
            backgroundColor: "#877a65",
            bottom: 285,
            padding: 5,
            zIndex: 1,
            elevation: 5,
          }}
        >
          {battingStyles.map((style) => (
            <TouchableOpacity
              key={style}
              onPress={() => {
                setbattingStyle(style);
                setOpenDropdown(null);
              }}
            >
              <Text style={{ fontSize: 17, color: "white" }}>{style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableWithoutFeedback onPress={() => toggleDropdown("bowlingStyle")}>
        <View style={{ width: "80%" }}>
          <AppTextInput
            placeholder="Bowling Style"
            editable={false}
            value={bowlingStyle}
            style={{ width: "100%" }}
            rightIcon={
              openDropdown === "bowlingStyle" ? "chevron-up" : "chevron-down"
            }
            onPress={() => toggleDropdown("bowlingStyle")}
          />
        </View>
      </TouchableWithoutFeedback>

      {openDropdown === "bowlingStyle" && (
        <View
          style={{
            position: "absolute",
            width: "70%",
            height: 225,
            alignSelf: "center",
            backgroundColor: "#877a65",
            bottom: 80,
            padding: 5,
            zIndex: 1,
            elevation: 5,
          }}
        >
          {bowlingStyles.map((style) => (
            <TouchableOpacity
              key={style}
              onPress={() => {
                setbowlingStyle(style);
                setOpenDropdown(null);
              }}
            >
              <Text style={{ fontSize: 17, color: "white" }}>{style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <AppTextInput
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={userData.number}
        onChangeText={(text) => setUserData({ ...userData, number: text })}
      />
      <AppTextInput
        placeholder="Shirt Number"
        keyboardType="numeric"
        value={userData.shirtNumber}
        onChangeText={(text) => setUserData({ ...userData, shirtNumber: text })}
      />
      <AppButton style={{ width: "50%", marginTop: 80 }} onPress={SaveInfo}>
        Save
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
