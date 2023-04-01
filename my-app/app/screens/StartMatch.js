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

import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";

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
  const [tossWinner, setTossWinner] = useState(null);
  const [selected, setselected] = useState(null);

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

  const handleCreateMatch = () => {
    if (team1 === null || team2 === null) {
      alert("Select team to create a match");
      return;
    }
    if (matchDetails.venue === "") {
      alert("Enter Venue");
      return;
    }
    if (matchDetails.overs === 0) {
      alert("Enter no of overs");
      return;
    }
    setTossModalVisible(true);
  };

  const startMatch = async () => {
    if (!tossWinner) {
      alert("Select who won the toss");
      return;
    }
    if (!selected) {
      alert("Selected to bowl or bat first?");
      return;
    }
    try {
      const matchRef = await addDoc(collection(db, "matches"), {
        team1: team1,
        team2: team2,
        date: matchDetails.date.toLocaleDateString(),
        time: matchDetails.time.toLocaleTimeString(),
        venue: matchDetails.venue,
        result: "",
        isCompleted: false,
      });
      console.log("Match started with ID: ", matchRef.id);
      navigation.navigate("Match Center");
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
            <Entypo name="circle-with-cross" size={45} color="red" />
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
            onPress={() => {
              setTossModalVisible(false);
              setTossWinner(null);
              setselected(null);
            }}
          >
            <Entypo name="circle-with-cross" size={45} color="#b10a19" />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
            Who won the toss?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              height: "35%",
            }}
          >
            <TouchableWithoutFeedback onPress={() => setTossWinner(team1)}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: tossWinner !== team1 ? "white" : "black",
                  borderWidth: tossWinner !== team1 ? 1 : 2,
                  backgroundColor:
                    tossWinner === team1
                      ? "rgba(0, 0, 0, 0.5)"
                      : "rgba(0, 0, 0, 0)",
                  borderRadius: 15,
                  width: "45%",
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
                <Text>{team1 && team1.name}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setTossWinner(team2)}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: tossWinner !== team2 ? "white" : "black",
                  borderWidth: tossWinner !== team2 ? 1 : 2,
                  backgroundColor:
                    tossWinner === team2
                      ? "rgba(0, 0, 0, 0.5)"
                      : "rgba(0, 0, 0, 0)",
                  borderRadius: 15,
                  width: "45%",
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
                <Text>{team2 && team2.name}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
            Selected to ?
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableWithoutFeedback onPress={() => setselected("Bat")}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: selected !== "Bat" ? "white" : "black",
                  backgroundColor:
                    selected === "Bat"
                      ? "rgba(0, 0, 0, 0.5)"
                      : "rgba(0, 0, 0, 0)",
                  borderRadius: 10,
                  width: "45%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Bat</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setselected("Bowl")}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: selected !== "Bowl" ? "white" : "black",
                  backgroundColor:
                    selected === "Bowl"
                      ? "rgba(0, 0, 0, 0.5)"
                      : "rgba(0, 0, 0, 0)",
                  borderRadius: 10,
                  width: "45%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Bowl</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <AppButton
            style={{ backgroundColor: "green", width: "60%" }}
            onPress={startMatch}
          >
            Start Match
          </AppButton>
        </View>
      </Modal>
      <AppButton
        style={{ marginTop: 50, width: "82%" }}
        onPress={handleCreateMatch}
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
