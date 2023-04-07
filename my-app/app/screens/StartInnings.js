import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AppButton from "../components/AppButton";

import { db } from "../config/firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

export default function StartInnings({ route }) {
  const { battingTeam, bowlingTeam, matchId } = route.params;
  const [striker, setstriker] = useState(null);
  const [nonStriker, setnonStriker] = useState(null);
  const [bowler, setbowler] = useState(null);
  const [batsmenModal, setbatsmenModal] = useState(false);
  const [bowlersModal, setbowlersModal] = useState(false);
  const [toBeSelected, settoBeSelected] = useState("striker");

  const startInnings = () => {
    if (!striker) {
      alert("Select Striker");
      return;
    }
    if (!nonStriker) {
      alert("Select Non Striker");
      return;
    }
    if (!bowler) {
      alert("Select Bowler");
      return;
    }

    const matchRef = doc(db, "matches", matchId);
    const inningsRef = collection(matchRef, "First innings");

    addDoc(inningsRef, {
      totalRuns: 0,
      wicketsDown: 0,
      totalOvers: 10,
      oversDelivered: 0,
      ballsDelivered: 0,
      runRate: 0,
      extras: {
        noBalls: 0,
        wideBalls: 0,
      },
      projectedScore: 0,
      currentBatsmen: [
        {
          name: "Batsman 1",
          runsScored: 30,
          ballsFaced: 40,
          fours: 4,
          sixes: 1,
          strikeRate: 75,
        },
        {
          name: "Batsman 2",
          runsScored: 40,
          ballsFaced: 50,
          fours: 5,
          sixes: 0,
          strikeRate: 80,
        },
      ],
      outBatsmen: [
        {
          name: "Batsman 3",
          runsScored: 10,
          ballsFaced: 15,
          dismissalType: "bowled",
        },
      ],
      currentBowler: {
        name: "Bowler 1",
        overs: 4,
        runsGiven: 25,
        wicketsTaken: 1,
        maidenOvers: 1,
      },
    })
      .then((docRef) => {
        console.log("Innings document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding innings document: ", error);
      });
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          backgroundColor: "pink",
          width: "100%",
          padding: 5,
        }}
      >
        Batting-Team A
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setbatsmenModal(true);
            settoBeSelected("striker");
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {striker ? `Striker:${striker.name}` : "Select Striker"}
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setbatsmenModal(true);
            settoBeSelected("non-striker");
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {nonStriker
              ? `Non Striker:${nonStriker.name}`
              : "Select Non Striker"}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      {/* <Modal visible={batsmenModal} animationType="slide" transparent>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#07FFF0",
            transform: [{ translateX: 28 }, { translateY: 80 }],
            width: "85%",
            height: "85%",
            alignItems: "center",
            borderRadius: 20,
            padding: 50,
          }}
        >
          <ScrollView>
            {battingTeam.players &&
              battingTeam.players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => {
                    toBeSelected === "striker"
                      ? setstriker(player)
                      : setnonStriker(player);
                    setbatsmenModal(false);
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    {player.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setbatsmenModal(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="red" />
          </TouchableOpacity>
        </View>
      </Modal> */}
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          backgroundColor: "pink",
          width: "100%",
          padding: 5,
        }}
      >
        Bowling-Team B
      </Text>
      <TouchableWithoutFeedback onPress={() => setbowlersModal(true)}>
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          {bowler ? bowler.name : "Select Bowler"}
        </Text>
      </TouchableWithoutFeedback>
      {/* <Modal visible={bowlersModal} animationType="slide" transparent>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#07FFF0",
            transform: [{ translateX: 28 }, { translateY: 80 }],
            width: "85%",
            height: "85%",
            alignItems: "center",
            borderRadius: 20,
            padding: 50,
          }}
        >
          <ScrollView>
            {bowlingTeam.players &&
              bowlingTeam.players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => {
                    setbowler(player);
                    setbowlersModal(false);
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    {player.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setbatsmenModal(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="red" />
          </TouchableOpacity>
        </View>
      </Modal> */}
      <AppButton style={{ width: "50%" }}>Start Scoring</AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
