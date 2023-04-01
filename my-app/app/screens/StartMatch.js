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
import Entypo from "@expo/vector-icons/Entypo";

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
  const [tossModalVisible, setTossModalVisible] = useState(false);
  const [teamBoBeSelected, setteamBoBeSelected] = useState("A");

  const handleSelectTeam = (team) => {
    if (teamBoBeSelected === "A" && team2 && team2.id === team.id) {
      alert("Choose different teams");
      setModalVisible(false);
      return;
    }
    if (teamBoBeSelected === "B" && team1 && team1.id === team.id) {
      alert("Choose different teams");
      setModalVisible(false);
      return;
    }
    teamBoBeSelected === "A" ? setTeam1(team) : setTeam2(team);
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setmatchDetails({ ...matchDetails, date: currentDate });
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setmatchDetails({ ...matchDetails, time: currentTime });
  };

  const createMatch = async () => {
    try {
      const matchRef = await addDoc(collection(db, "matches"), {
        team1: team1,
        team2: team2,
        date: matchDetails.date,
        venue: matchDetails.venue,
        result: "",
        isCompleted: false,
      });
      console.log("Match started with ID: ", matchRef.id);
    } catch (err) {
      console.error("Error starting match: ", err);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#07FFF0",
            transform: [{ translateX: 35 }, { translateY: 105 }],
            width: "80%",
            height: "80%",
            alignItems: "center",
            borderRadius: 20,
            padding: 50,
          }}
        >
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Choose a Team</Text>
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
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setModalVisible(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
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
      <Modal visible={tossModalVisible} transparent animationType="fade">
        <View
          style={{
            position: "absolute",
            backgroundColor: "#FE7F0A",
            transform: [{ translateX: 35 }, { translateY: 170 }],
            width: "80%",
            height: "60%",
            alignItems: "center",
            borderRadius: 20,
            padding: 20,
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setTossModalVisible(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="white" />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
            Who won the toss?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 15,
                width: "45%",
                height: 150,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: "#07FFF0",
                  borderRadius: 30,
                }}
              ></View>
              <Text>Team</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 15,
                width: "45%",
                height: 150,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: "#07FFF0",
                  borderRadius: 30,
                }}
              ></View>
              <Text>Team</Text>
            </View>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
            Decided to ?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 10,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Bat</Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 10,
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Bowl</Text>
            </View>
          </View>
          <AppButton style={{ backgroundColor: "#000", width: "60%" }}>
            Start Match
          </AppButton>
        </View>
      </Modal>
      <AppButton
        style={{ marginTop: 50, width: "82%" }}
        onPress={() => setTossModalVisible(true)}
      >
        Create
      </AppButton>
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
