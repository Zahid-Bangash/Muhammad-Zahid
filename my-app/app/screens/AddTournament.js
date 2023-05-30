import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Context } from "../components/ContextProvider";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useIsFocused } from "@react-navigation/native";

import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import CustomTextInput from "../components/CustomTextInput";

export default function AddTS({ navigation }) {
  const { userData, myTournaments, setmyTournaments } = useContext(Context);
  const isFocused = useIsFocused();
  const [showStartDatePicker, setshowStartDatePicker] = useState(false);
  const [showEndDatePicker, setshowEndDatePicker] = useState(false);
  const [details, setdetails] = useState({
    name: "",
    city: "",
    organizer: userData.Name,
    organizerPhone: userData.PhoneNumber,
    organizerEmail: userData.Email,
    startDate: new Date(),
    endDate: new Date(),
    ballType: "",
    matchType: "",
    image:'',
  });

  const handleStartDateChange = (event, selectedDate) => {
    setshowStartDatePicker(false);
    const currentDate = selectedDate || date;
    setdetails({ ...details, startDate: currentDate });
  };

  const handleEndDateChange = (event, selectedDate) => {
    setshowEndDatePicker(false);
    const currentDate = selectedDate || date;
    setdetails({ ...details, endDate: currentDate });
  };

  const handleCreateTournament = async () => {
    if (details.name === "") {
      alert("Enter Tournament Name");
      return;
    }
    if (details.city === "") {
      alert("Enter City Name");
      return;
    }
    if (details.ballType === "") {
      alert("Select Ball Type");
      return;
    }
    if (details.matchType === "") {
      alert("Select Match Type");
      return;
    }
    try {
      const newTournament = {
        name: details.name,
        city: details.city,
        organizer: {
          name: details.organizer,
          phone: details.organizerPhone,
          email: details.organizerEmail,
        },
        startDate: details.startDate.toLocaleDateString(),
        endDate: details.endDate.toLocaleDateString(),
        ballType: details.ballType,
        matchType: details.matchType,
        status: "Ongoing",
        mostRuns: { playerName: "Player Name", runs: 0, teamName: "Team Name" },
        mostWickets: {
          playerName: "Player Name",
          wickets: 0,
          teamName: "Team Name",
        },
        sixes: 0,
        fours: 0,
        highestScore: {
          playerName: "Player Name",
          score: 0,
          teamName: "Team Name",
        },
        bestBowling: {
          playerName: "Player Name",
          best: { wickets: 0, runs: 0 },
          teamName: "Team Name",
        },
        mostSixes: {
          playerName: "Player Name",
          sixes: 0,
          teamName: "Team Name",
        },
        mostFours: {
          playerName: "Player Name",
          fours: 0,
          teamName: "Team Name",
        },
        teams: [],
        matches: [],
      };
      const tournamentRef = await addDoc(
        collection(db, "users", auth.currentUser.uid, "Tournaments"),
        newTournament
      );
      const publicTournamentRef = doc(db, "Tournaments", tournamentRef.id);
      await setDoc(publicTournamentRef, newTournament);
      setmyTournaments([
        ...myTournaments,
        {
          id: tournamentRef.id,
          name: details.name,
          city: details.city,
          organizer: {
            name: details.organizer,
            phone: details.organizerPhone,
            email: details.organizerEmail,
          },
          startDate: details.startDate.toLocaleDateString(),
          endDate: details.endDate.toLocaleDateString(),
          ballType: details.ballType,
          matchType: details.matchType,
          status: "Ongoing",
          mostRuns: {
            playerName: "Player Name",
            runs: 0,
            teamName: "Team Name",
          },
          mostWickets: {
            playerName: "Player Name",
            wickets: 0,
            teamName: "Team Name",
          },
          sixes: 0,
          fours: 0,
          highestScore: {
            playerName: "Player Name",
            score: 0,
            teamName: "Team Name",
          },
          bestBowling: {
            playerName: "Player Name",
            best: "0-0",
            teamName: "Team Name",
          },
          mostSixes: {
            playerName: "Player Name",
            sixes: 0,
            teamName: "Team Name",
          },
          mostFours: {
            playerName: "Player Name",
            fours: 0,
            teamName: "Team Name",
          },
          teams: [],
          matches: [],
        },
      ]);
      console.log("Tournament created with ID: ", tournamentRef.id);
      navigation.navigate("Tournament Details", { id: tournamentRef.id });
    } catch (err) {
      console.error("Error creating tournament: ", err);
    }
  };

  useEffect(() => {
    const backAction = () => {
      setdetails({
        name: "",
        city: "",
        organizer: userData.Name,
        organizerPhone: userData.PhoneNumber,
        organizerEmail: userData.Email,
        startDate: new Date(),
        endDate: new Date(),
        ballType: "",
        matchType: "",
      });
      navigation.goBack();
      return true;
    };

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [isFocused, navigation]);

  return (
    <View style={styles.container}>
      <CustomTextInput
        label="Tournament Name"
        value={details.name}
        onChangeText={(text) => setdetails({ ...details, name: text })}
      />
      <CustomTextInput
        label="City"
        value={details.city}
        onChangeText={(text) => setdetails({ ...details, city: text })}
      />
      <CustomTextInput
        label="Organizer Name"
        value={details.organizer}
        onChangeText={(text) => setdetails({ ...details, organizer: text })}
      />
      <CustomTextInput
        label="Organizer Number"
        value={details.organizerPhone}
        onChangeText={(text) =>
          setdetails({ ...details, organizerPhone: text })
        }
      />
      <CustomTextInput
        label="Organizer Email"
        value={details.organizerEmail}
        onChangeText={(text) =>
          setdetails({ ...details, organizerEmail: text })
        }
      />
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Tournament Dates
      </Text>
      <View
        style={{
          flexDirection: "row",
          width: "80%",
        }}
      >
        <TouchableWithoutFeedback onPress={() => setshowStartDatePicker(true)}>
          <View style={{ width: "55%" }}>
            <AppTextInput
              editable={false}
              value={details.startDate.toLocaleDateString()}
              style={{ borderBottomWidth: 1 }}
            />
          </View>
        </TouchableWithoutFeedback>
        {showStartDatePicker && (
          <DateTimePicker
            value={details.startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        <TouchableWithoutFeedback onPress={() => setshowEndDatePicker(true)}>
          <View style={{ width: "55%" }}>
            <AppTextInput
              editable={false}
              value={details.endDate.toLocaleDateString()}
              style={{ borderBottomWidth: 1 }}
            />
          </View>
        </TouchableWithoutFeedback>
        {showEndDatePicker && (
          <DateTimePicker
            value={details.endDate}
            minimumDate={new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </View>
      <Text style={{ fontWeight: "bold", margin: 10 }}>Ball Type</Text>
      <RadioButtonGroup
        selected={details.ballType}
        onSelected={(val) => setdetails({ ...details, ballType: val })}
        radioBackground="green"
        containerStyle={{ flexDirection: "row" }}
      >
        <RadioButtonItem
          label="LEATHER"
          value="leather"
          style={{ marginHorizontal: 10 }}
        />
        <RadioButtonItem
          label="TENNIS"
          value="tennis"
          style={{ marginHorizontal: 10 }}
        />
        <RadioButtonItem
          label="OTHER"
          value="other"
          style={{ marginHorizontal: 10 }}
        />
      </RadioButtonGroup>
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Match Type</Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          width: "92%",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setdetails({ ...details, matchType: "T10" })}
        >
          <View
            style={{
              backgroundColor:
                details.matchType === "T10" ? "green" : "#e0dede",
              borderWidth: 0.5,
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>T10</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => setdetails({ ...details, matchType: "T20" })}
        >
          <View
            style={{
              backgroundColor:
                details.matchType === "T20" ? "green" : "#e0dede",
              borderWidth: 0.5,
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>T20</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => setdetails({ ...details, matchType: "ODI" })}
        >
          <View
            style={{
              backgroundColor:
                details.matchType === "ODI" ? "green" : "#e0dede",
              borderWidth: 0.5,
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>ODI</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          width: "92%",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setdetails({ ...details, matchType: "100" })}
        >
          <View
            style={{
              backgroundColor:
                details.matchType === "100" ? "green" : "#e0dede",
              borderWidth: 0.5,
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>100</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => setdetails({ ...details, matchType: "Test" })}
        >
          <View
            style={{
              backgroundColor:
                details.matchType === "Test" ? "green" : "#e0dede",
              borderWidth: 0.5,
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>Test</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => setdetails({ ...details, matchType: "Club" })}
        >
          <View
            style={{
              backgroundColor:
                details.matchType === "Club" ? "green" : "#e0dede",
              borderWidth: 0.5,
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>Club</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <AppButton
        style={{ width: "82%", marginTop: 40 }}
        onPress={handleCreateTournament}
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
    paddingTop: 20,
  },
});
