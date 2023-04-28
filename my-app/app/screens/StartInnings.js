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

import { auth, db } from "../config/firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

export default function StartInnings({ route, navigation }) {
  const { battingTeam, bowlingTeam, squad1, squad2, matchId } = route.params;
  const [battingSquad, setbattingSquad] = useState(
    squad1.type === "batting" ? squad1.players : squad2.players
  );
  const [bowlers, setbowlers] = useState(
    squad1.type === "bowling" ? squad1.players : squad2.players
  );
  const [remainingBatsmen, setremainingBatsmen] = useState(battingSquad);
  const [striker, setstriker] = useState(null);
  const [nonStriker, setnonStriker] = useState(null);
  const [bowler, setbowler] = useState(null);
  const [batsmenModal, setbatsmenModal] = useState(false);
  const [bowlersModal, setbowlersModal] = useState(false);
  const [toBeSelected, settoBeSelected] = useState("striker");

  const [inningsNo, setinningsNo] = useState(1);

  const startFirstInnings = () => {
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

    const matchRef = doc(db, "users", auth.currentUser.uid, "Matches", matchId);
    const inningsRef = collection(matchRef, "innings");

    addDoc(inningsRef, {
      inningsNo: 1,
      battingTeam: battingTeam,
      bowlingTeam: bowlingTeam,
      totalRuns: 0,
      wicketsDown: 0,
      oversDelivered: 0,
      ballsDelivered: 0,
      runRate: 0,
      extras: 0,
      projectedScore: 0,
      partnership: { runs: 0, balls: 0 },
      currentOver: [],
      battingSquad: battingSquad,
      bowlingSquad: bowlers,
      currentBatsmen: [
        {
          name: striker.name,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: null,
        },
        {
          name: nonStriker.name,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: null,
        },
      ],
      outBatsmen: [],
      remainingBatsmen: remainingBatsmen,
      currentBowler: {
        name: bowler.name,
        balls: 0,
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
        console.log("First Innings started with ID: ", docRef.id);
        setinningsNo(2);
        setstriker(null);
        setnonStriker(null);
        setbowler(null);
        const temp = battingSquad;
        setbowlers(temp);
        setbattingSquad(bowlers);
        setremainingBatsmen(bowlers);
        navigation.navigate("Match Center", {
          matchId: matchId,
          inningsId: docRef.id,
        });
      })
      .catch((error) => {
        console.error("Error adding innings document: ", error);
      });
  };
  const startSecondInnings = () => {
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

    const matchRef = doc(db, "users", auth.currentUser.uid, "Matches", matchId);
    const inningsRef = collection(matchRef, "innings");

    addDoc(inningsRef, {
      inningsNo: 2,
      battingTeam: bowlingTeam,
      bowlingTeam: battingTeam,
      totalRuns: 0,
      wicketsDown: 0,
      oversDelivered: 0,
      ballsDelivered: 0,
      runRate: 0,
      extras: 0,
      projectedScore: 0,
      partnership: { runs: 0, balls: 0 },
      currentOver: [],
      battingSquad: bowlers,
      bowlingSquad: battingSquad,
      currentBatsmen: [
        {
          name: striker.name,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: null,
        },
        {
          name: nonStriker.name,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: null,
        },
      ],
      outBatsmen: [],
      remainingBatsmen: remainingBatsmen,
      currentBowler: {
        name: bowler.name,
        balls: 0,
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
        console.log("Second Innings started with ID: ", docRef.id);
        setinningsNo(2);
        navigation.navigate("Match Center", {
          matchId: matchId,
          inningsId: docRef.id,
        });
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
        Batting-{inningsNo === 1 ? battingTeam : bowlingTeam}
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
            if (striker) setremainingBatsmen([...remainingBatsmen, striker]);
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
            if (nonStriker)
              setremainingBatsmen([...remainingBatsmen, nonStriker]);
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
            {remainingBatsmen.map((player) => (
              <TouchableOpacity
                key={player.id}
                onPress={() => {
                  toBeSelected === "striker"
                    ? setstriker(player)
                    : setnonStriker(player);
                  setbatsmenModal(false);
                  setremainingBatsmen(
                    remainingBatsmen.filter((p) => p !== player)
                  );
                  setbatsmenModal(false);
                }}
              >
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                  {player.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
        Bowling-{inningsNo === 1 ? bowlingTeam : battingTeam}
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
      <AppButton
        style={{ width: "50%" }}
        onPress={() =>
          inningsNo === 1 ? startFirstInnings() : startSecondInnings()
        }
      >
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
