import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AppButton from "../components/AppButton";

import { db } from "../config/firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

export default function StartInnings({ route, navigation }) {
  const { battingTeam, bowlingTeam, squad1, squad2, matchId } = route.params;

  const [batsmen, setbatsmen] = useState(
    squad1.type === "batting" ? squad1.players : squad2.players
  );
  const [remainingBatsmen, setremainingBatsmen] = useState([]);
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
      oversDelivered: 0,
      ballsDelivered: 0,
      runRate: 0,
      extras: 0,
      partnership: { runs: 0, balls: 0 },
      projectedScore: 0,
      currentOver: [],
      currentBatsmen: [
        {
          name: striker.name,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: "",
          dismissalBowler: "",
        },
        {
          name: nonStriker.name,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: "",
          dismissalBowler: "",
        },
      ],
      outBatsmen: [],
      remainingBatsmen: remainingBatsmen,
      currentBowler: {
        name: bowler.name,
        overs: 0,
        runsGiven: 0,
        wicketsTaken: 0,
        maidenOvers: 0,
        eco: 0,
      },
      bowlers: [],
      isCompleted: false,
    })
      .then((docRef) => {
        console.log("Innings document written with ID: ", docRef.id);
        navigation.navigate("Match Center", {
          matchId: matchId,
          inningsId: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error adding innings document: ", error);
      });
  };

  // let batsmen = squad1.type === "batting" ? squad1.players : squad2.players;
  const bowlers = squad1.type === "bowling" ? squad1.players : squad2.players;

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
        Batting-{battingTeam}
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
            {striker ? `Striker: ${striker.name}` : "Select Striker"}
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
              ? `Non Striker: ${nonStriker.name}`
              : "Select Non Striker"}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <Modal visible={batsmenModal} animationType="slide" transparent>
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
            {batsmen.map((player) => (
              <TouchableOpacity
                key={player.id}
                onPress={() => {
                  if (toBeSelected === "striker" && player === nonStriker) {
                    alert("Choose different players");
                    return;
                  }
                  if (toBeSelected === "non-striker" && player === striker) {
                    alert("Choose different players");
                    return;
                  }
                  toBeSelected === "striker"
                    ? setstriker(player)
                    : setnonStriker(player);
                  setbatsmenModal(false);
                  setremainingBatsmen(batsmen.filter((p) => p !== player));
                  setbatsmen(batsmen.filter((p) => p !== player));
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
      </Modal>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          backgroundColor: "pink",
          width: "100%",
          padding: 5,
        }}
      >
        Bowling-{bowlingTeam}
      </Text>
      <TouchableWithoutFeedback onPress={() => setbowlersModal(true)}>
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          {bowler ? `Bowler: ${bowler.name}` : "Select Bowler"}
        </Text>
      </TouchableWithoutFeedback>
      <Modal visible={bowlersModal} animationType="slide" transparent>
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
            {bowlers.map((player) => (
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
            onPress={() => setbowlersModal(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="red" />
          </TouchableOpacity>
        </View>
      </Modal>
      <AppButton style={{ width: "50%" }} onPress={startInnings}>
        Start Scoring
      </AppButton>
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
