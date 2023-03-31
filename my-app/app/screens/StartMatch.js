import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TeamsContext from "../components/TeamsContext";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";

export default function StartMatch({ navigation }) {
  const { teams } = useContext(TeamsContext);
  const [matchDetails, setmatchDetails] = useState({
    venue: "",
    date: new Date(),
    time: new Date(),
    overs: 0,
  });
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [teamBoBeSelected, setteamBoBeSelected] = useState("A");
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setmatchDetails({ ...matchDetails, date: currentDate });
  };

  const handleSelectTeam = (team) => {
    if (teamBoBeSelected === "A" && team2 && team2.name === team.name) {
      alert("Choose different teams");
      setModalVisible(false);
      return;
    }
    if (teamBoBeSelected === "B" && team1 && team1.name === team.name) {
      alert("Choose different teams");
      setModalVisible(false);
      return;
    }
    teamBoBeSelected === "A" ? setTeam1(team) : setTeam2(team);
    setModalVisible(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setmatchDetails({ ...matchDetails, time: currentTime });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          height: 150,
        }}
      >
        <View style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text>Select Team</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              setteamBoBeSelected("A");
              setModalVisible(true);
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                elevation: 5,
                backgroundColor: "white",
              }}
            ></View>
          </TouchableWithoutFeedback>
          <Text style={{ fontWeight: "bold" }}>
            {team1 ? team1.name : "Team A"}
          </Text>
        </View>
        <View style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text>Select Team</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              setteamBoBeSelected("B");
              setModalVisible(true);
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                elevation: 5,
                backgroundColor: "white",
              }}
            ></View>
          </TouchableWithoutFeedback>
          <Text style={{ fontWeight: "bold" }}>
            {team2 ? team2.name : "Team B"}
          </Text>
        </View>
      </View>
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Select a Team</Text>
          <ScrollView>
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => handleSelectTeam(team)}
              >
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  {team.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ fontSize: 18, color: "blue" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <AppTextInput
        placeholder="Venue"
        autoComplete="off"
        autoCorrect={false}
        value={matchDetails.venue}
        onChangeText={(text) =>
          setmatchDetails({ ...matchDetails, venue: text })
        }
        style={{ marginTop: 40 }}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          width: "80%",
        }}
      >
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
          <View style={{ width: "55%" }}>
            <AppTextInput
              placeholder="Date"
              autoComplete="off"
              autoCorrect={false}
              editable={false}
              value={matchDetails.date.toLocaleDateString()}
            />
          </View>
        </TouchableWithoutFeedback>
        {showDatePicker && (
          <DateTimePicker
            value={matchDetails.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TouchableWithoutFeedback onPress={() => setShowTimePicker(true)}>
          <View style={{ width: "55%" }}>
            <AppTextInput
              placeholder="Time"
              autoComplete="off"
              autoCorrect={false}
              editable={false}
              value={matchDetails.time.toLocaleTimeString()}
            />
          </View>
        </TouchableWithoutFeedback>
        {showTimePicker && (
          <DateTimePicker
            value={matchDetails.time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      <AppTextInput
        placeholder="Total Overs"
        keyboardType="numeric"
        autoComplete="off"
        autoCorrect={false}
        value={matchDetails.overs}
        onChangeText={(text) =>
          setmatchDetails({ ...matchDetails, overs: text })
        }
        style={{ marginTop: 20 }}
      />
      <AppButton style={{ marginTop: 50, width: "82%" }}>Create</AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e0dede",
    padding: 20,
  },
});
