import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity
  Modal
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";

export default function EditProfile() {
  const [userData, setUserData] = useState({
    name: "",
    location: "",
    dob: new Date("2010-01-01"),
    email: "",
    number: null,
    playingRole: "",
  });
  const [showDatePicker, setshowDatePicker] = useState(false);

  const [playinngRole, setSelectedValue] = useState("");
  const [showPlayingRoleModal, setShowPlayingRoleModal] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setshowDatePicker(false);
    const currentDate = selectedDate || date;
    setUserData({ ...userData, dob: currentDate });
  };

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppTextInput
        placeholder="Full Name"
        value={userData.name}
        onChangeText={(text) => setuserData({ ...userData, name: text })}
      />
      <AppTextInput
        placeholder="Location"
        value={userData.location}
        onChangeText={(text) => setuserData({ ...userData, location: text })}
      />
      <TouchableWithoutFeedback onPress={() => setshowDatePicker(true)}>
        <View style={{ width: "80%" }}>
          <AppTextInput
            placeholder="Date of Birth"
            autoComplete="off"
            autoCorrect={false}
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
      <AppTextInput
        placeholder="Email"
        keyboardType="email-address"
        value={userData.email}
        onChangeText={(text) => setuserData({ ...userData, email: text })}
      />
      <AppTextInput
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={userData.email}
        onChangeText={(text) => setuserData({ ...userData, email: text })}
      />
      <TouchableWithoutFeedback onPress={() =>setShowPlayingRoleModal(true) }>
        <View style={{ width: "80%" }}>
          <AppTextInput
            placeholder="batting style"
            autoComplete="off"
            autoCorrect={false}
            editable={false}
            value={playinngRole}
            style={{ width: "100%" }}
          />
        </View>
        {showPlayingRoleModal && (
          <Modal visible={showPlayingRoleModal} transparent animationType="slide">
            <View>
              {options.map((option)=>{
                <TouchableOpacity onPress={()=>console.log(option.value)}>
                  <Text key={option.label}>{option.label}</Text>
                </TouchableOpacity>
              })}
            </View>
          </Modal>
        )}
      </TouchableWithoutFeedback>
      <AppButton style={{ width: "50%" }}>Save</AppButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
