import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import Swiper from "react-native-swiper";
import Entypo from "@expo/vector-icons/Entypo";

import { db } from "../config/firebase-config";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";

import Batter from "../components/Batter";
import Bowler from "../components/Bowler";
import ScoringModal from "../components/ScoringModal";
import AppButton from "../components/AppButton";

export default function MatchCenter({ route, navigation }) {
  const { matchId, inningsId } = route.params;
  const [swiperIndex, setSwiperIndex] = useState(0);

  //extras states
  const [customScoreVisible, setcustomScoreVisible] = useState(false);
  const [noBallVisible, setnoBallVisible] = useState(false);
  const [wideBallVisible, setwideBallVisible] = useState(false);
  const [byeVisible, setbyeVisible] = useState(false);
  const [legByeVisible, setlegByeVisible] = useState(false);

  const [customScore, setcustomScore] = useState(0);
  const [noBall, setnoBall] = useState(1);
  const [wideRuns, setwideRuns] = useState(1);
  const [bye, setbye] = useState(1);
  const [legBye, setlegBye] = useState(1);

  //Out states
  const [outModal, setoutModal] = useState(false);
  const [dismissalType, setdismissalType] = useState("");
  const [selectedDType, setselectedDType] = useState(null);

  //Initial Data
  const [matchData, setMatchData] = useState({});
  const intitialInningsData = {
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
        name: "Striker",
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissalType: "",
      },
      {
        name: "Non Striker",
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissalType: "",
      },
    ],
    outBatsmen: [],
    currentBowler: {
      name: "Bowler",
      overs: 0,
      runsGiven: 0,
      wicketsTaken: 0,
      maidenOvers: 0,
      eco: 0,
    },
    bowlers: [],
    isCompleted: false,
  };

  const [inningsData, setInningsData] = useState(intitialInningsData);

  const [previousState, setpreviousState] = useState([]);

  //functions
  const handleScore = (
    runs,
    isWide = false,
    wdRuns = 0,
    isNoBall = false,
    noBallRuns = 0,
    isBye = false,
    byeRuns = 0,
    isLegBye = false,
    legByeRuns = 0,
    isOut = false,
    dismissalType = ""
  ) => {
    //Undo
    setpreviousState([
      ...previousState,
      JSON.parse(JSON.stringify(inningsData)),
    ]);

    const inningsDataCopy = { ...inningsData };
    if (inningsDataCopy.isComplete === true) {
      alert("Innings is completed");
      return;
    }
    //Handle extras
    if (isWide) {
      inningsDataCopy.extras += wdRuns;
      inningsDataCopy.totalRuns += wdRuns;
      inningsDataCopy.currentOver.push(`Wd${wdRuns}`);
      inningsDataCopy.currentBowler.runsGiven += wdRuns;
    }
    if (isBye) {
      inningsDataCopy.extras += byeRuns;
      inningsDataCopy.totalRuns += byeRuns;
      inningsDataCopy.currentOver.push(`bye${byeRuns}`);
    }
    if (isLegBye) {
      inningsDataCopy.extras += legByeRuns;
      inningsDataCopy.totalRuns += legByeRuns;
      inningsDataCopy.currentOver.push(`lb${legByeRuns}`);
    }
    if (isNoBall) {
      inningsDataCopy.extras += noBallRuns;
      inningsDataCopy.totalRuns += noBallRuns;
      inningsDataCopy.currentOver.push(`nb${noBallRuns}`);
      inningsDataCopy.currentBowler.runsGiven += noBallRuns;
    }
    //Handle runs
    inningsDataCopy.totalRuns += runs;
    inningsDataCopy.partnership.runs += runs;
    if (!isWide && !isNoBall) inningsDataCopy.partnership.balls++;
    inningsDataCopy.currentBatsmen[0].runsScored += runs;
    if (!isWide && !isNoBall) inningsDataCopy.currentBatsmen[0].ballsFaced++;
    const strikeRate =
      inningsDataCopy.currentBatsmen[0].runsScored === 0
        ? 0
        : (inningsDataCopy.currentBatsmen[0].runsScored /
            inningsDataCopy.currentBatsmen[0].ballsFaced) *
          100;
    inningsDataCopy.currentBatsmen[0].strikeRate = strikeRate.toFixed(2);
    inningsDataCopy.currentBowler.runsGiven += runs;
    const economy =
      inningsDataCopy.currentBowler.overs === 0
        ? inningsDataCopy.currentBowler.runsGiven
        : inningsDataCopy.currentBowler.runsGiven /
          inningsDataCopy.currentBowler.overs;
    inningsDataCopy.currentBowler.eco = economy.toFixed(2);
    inningsDataCopy.runRate =
      inningsDataCopy.oversDelivered === 0
        ? inningsDataCopy.totalRuns
        : inningsDataCopy.totalRuns / inningsDataCopy.oversDelivered;
    if (!isNoBall && !isWide && !isBye && !isLegBye)
      inningsDataCopy.currentOver.push(runs);
    //Handle boundaries
    if (runs === 4) {
      inningsDataCopy.currentBatsmen[0].fours += 1;
    }
    if (runs === 6) {
      inningsDataCopy.currentBatsmen[0].sixes += 1;
    }
    if (!isWide && !isNoBall) inningsDataCopy.ballsDelivered++;
    //changing strike
    if (
      runs % 2 !== 0 ||
      (wdRuns !== 1 && wdRuns % 2 !== 0) ||
      legByeRuns % 2 !== 0 ||
      byeRuns % 2 !== 0 ||
      (noBallRuns !== 1 && noBallRuns % 2 !== 0)
    ) {
      const temp = inningsDataCopy.currentBatsmen[0];
      inningsDataCopy.currentBatsmen[0] = inningsDataCopy.currentBatsmen[1];
      inningsDataCopy.currentBatsmen[1] = temp;
    }
    //over ends
    if (inningsDataCopy.ballsDelivered === 6) {
      inningsDataCopy.oversDelivered += 1;
      inningsDataCopy.currentBowler.overs += 1;
      inningsDataCopy.ballsDelivered = 0;
      if (inningsData.currentBowler.runsGiven === 0)
        inningsDataCopy.currentBowler.maidenOvers++;
      alert("Over End");
      inningsDataCopy.currentOver = [];
      //changing strike
      const temp = inningsDataCopy.currentBatsmen[0];
      inningsDataCopy.currentBatsmen[0] = inningsDataCopy.currentBatsmen[1];
      inningsDataCopy.currentBatsmen[1] = temp;
    }
    if (inningsDataCopy.oversDelivered === matchData.totalOvers)
      inningsDataCopy.isComplete = true;
    updateData(inningsDataCopy);
    if (inningsDataCopy.isComplete === true) alert("Innings completed");
  };

  const updateData = async (updatedData) => {
    try {
      const matchRef = doc(db, "matches", matchId);
      const inningsRef = collection(matchRef, "First innings");
      const inningsDocRef = doc(inningsRef, inningsId);

      await updateDoc(inningsDocRef, updatedData, { merge: true });
      console.log("Innings data updated successfully!");
    } catch (error) {
      console.error("Error updating innings data:", error);
    }
  };

  const getBgColor = (runs) => {
    if (runs === 4) return "blue";
    else if (runs === 6) return "#3db106";
    else return "#5e6959";
  };

  const handleUndo = () => {
    if (previousState.length > 0) {
      const prevState = previousState.pop();
      setpreviousState([...previousState]);
      updateData(prevState);
    }
  };

  const changeStrike = () => {
    Alert.alert("Change Strike", "Are you sure you want to change strike?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: () => {
          const inningsDataCopy = { ...inningsData };
          const temp = inningsDataCopy.currentBatsmen[0];
          inningsDataCopy.currentBatsmen[0] = inningsDataCopy.currentBatsmen[1];
          inningsDataCopy.currentBatsmen[1] = temp;
          updateData(inningsDataCopy);
        },
      },
    ]);
  };

  useEffect(() => {
    const matchDocRef = doc(db, "matches", matchId);
    const inningsDocRef = doc(
      db,
      "matches",
      matchId,
      "First innings",
      inningsId
    );

    const matchUnsubscribe = onSnapshot(matchDocRef, (doc) => {
      const data = doc.data();
      setMatchData(data);
    });

    const inningsUnsubscribe = onSnapshot(inningsDocRef, (doc) => {
      const data = doc.data();
      setInningsData(data);
    });

    return () => {
      matchUnsubscribe();
      inningsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      Alert.alert("Confirm", "Are you sure you want to leave the match?", [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: () => {
            unsubscribe();
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          },
        },
      ]);
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
          Scoring
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
          Scorecard
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
          Info
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
      <View style={[styles.slide]}>
        <View
          style={{
            flex: 2.5,
            width: "100%",
            marginTop: 44,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderColor: "gray",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {Object.keys(matchData).length > 0
              ? matchData.battingTeam
              : "Batting-Team"}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 40, color: "#8f4705" }}>
            {inningsData.totalRuns}-{inningsData.wicketsDown}
          </Text>
          <Text>
            ({inningsData.ballsDelivered}.{inningsData.oversDelivered}/
            {Object.keys(matchData).length > 0 ? matchData.totalOvers : "0"})
          </Text>
        </View>
        <View
          style={{
            flex: 1.3,
            borderBottomWidth: 1,
            borderColor: "gray",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Extras - {inningsData.extras}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {`Partnership - ${inningsData.partnership.runs}(${inningsData.partnership.balls})`}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            CRR - {inningsData.runRate}
          </Text>
        </View>
        <View
          style={{
            flex: 2.5,
            borderBottomWidth: 0.5,
            borderColor: "gray",
            width: "100%",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <View
            style={{
              flex: 2,
              justifyContent: "space-around",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Batsman</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].name}*
            </Text>
            <TouchableWithoutFeedback onPress={changeStrike}>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {inningsData.currentBatsmen[1].name}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>R</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].runsScored}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1].runsScored}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>B</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].ballsFaced}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1].ballsFaced}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>4s</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].fours}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1].fours}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>6s</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].sixes}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1].sixes}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>SR</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].strikeRate}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1].strikeRate}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            borderBottomWidth: 0.5,
            borderColor: "gray",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 2,
              justifyContent: "space-around",
              height: "100%",
              padding: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Bowler</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBowler.name}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>O</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBowler.overs}.{inningsData.ballsDelivered}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>M</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBowler.maidenOvers}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>R</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBowler.runsGiven}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>W</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBowler.wicketsTaken}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Eco</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBowler.eco}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1.3,
            borderBottomWidth: 0.5,
            borderColor: "gray",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <ScrollView horizontal>
            {inningsData.currentOver.length > 0 &&
              inningsData.currentOver.map((element, index) => (
                <View
                  key={index}
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: getBgColor(element),
                    borderRadius: 20,
                    marginHorizontal: 5,
                    backgroundColor: getBgColor(element),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {element}
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>
        <View
          style={{
            flex: 4,
            backgroundColor: "pink",
            width: "100%",
            padding: 5,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => handleScore(0)}>
              <View style={styles.buttonCell}>
                <Entypo name="dot-single" size={30} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleScore(1)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>1</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleScore(2)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>2</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleScore(3)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>3</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleUndo}>
              <View style={[styles.buttonCell, { borderRightWidth: 0 }]}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 17, color: "green" }}
                >
                  Undo
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => setwideBallVisible(true)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>Wide</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setbyeVisible(true)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>Bye</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleScore(4)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>4</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleScore(6)}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>6</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setoutModal(true)}>
              <View style={[styles.buttonCell, { borderRightWidth: 0 }]}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 17, color: "red" }}
                >
                  Out
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => setnoBallVisible(true)}>
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>NB</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setlegByeVisible(true)}>
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>LB</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setcustomScoreVisible(true)}
            >
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>5,7</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("more")}>
              <View
                style={[
                  styles.buttonCell,
                  { borderRightWidth: 0, borderBottomWidth: 0, flex: 2 },
                ]}
              >
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>More</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <ScoringModal
          title="Custom Runs"
          visibility={customScoreVisible}
          setVisibility={setcustomScoreVisible}
          value={customScore}
          setValue={setcustomScore}
          onOkPress={() => {
            handleScore(customScore);
            setcustomScore(0);
            setcustomScoreVisible(false);
          }}
        />
        <ScoringModal
          title="No Ball"
          visibility={noBallVisible}
          setVisibility={setnoBallVisible}
          value={noBall}
          setValue={setnoBall}
          onOkPress={() => {
            handleScore(
              (runs = 0),
              (isWide = false),
              (wdRuns = 0),
              (isNoBall = true),
              (noBallRuns = noBall),
              (isBye = false),
              (byeRuns = 0),
              (isLegBye = false),
              (legByeRuns = 0)
            );
            setnoBall(1);
            setnoBallVisible(false);
          }}
        />
        <ScoringModal
          title="Wide Runs"
          visibility={wideBallVisible}
          setVisibility={setwideBallVisible}
          value={wideRuns}
          setValue={setwideRuns}
          onOkPress={() => {
            handleScore(
              (runs = 0),
              (isWide = true),
              (wdRuns = wideRuns),
              (isNoBall = false),
              (noBallRuns = 0),
              (isBye = false),
              (byeRuns = 0),
              (isLegBye = false),
              (legByeRuns = 0)
            );
            setwideRuns(1);
            setwideBallVisible(false);
          }}
        />
        <ScoringModal
          title="Bye Runs"
          visibility={byeVisible}
          setVisibility={setbyeVisible}
          value={bye}
          setValue={setbye}
          onOkPress={() => {
            handleScore(
              (runs = 0),
              (isWide = false),
              (wdRuns = 0),
              (isNoBall = false),
              (noBallRuns = 0),
              (isBye = true),
              (byeRuns = bye),
              (isLegBye = false),
              (legByeRuns = 0)
            );
            setbye(1);
            setbyeVisible(false);
          }}
        />
        <ScoringModal
          title="Leg  Bye Runs"
          visibility={legByeVisible}
          setVisibility={setlegByeVisible}
          value={legBye}
          setValue={setlegBye}
          onOkPress={() => {
            handleScore(
              (runs = 0),
              (isWide = false),
              (wdRuns = 0),
              (isNoBall = false),
              (noBallRuns = 0),
              (isBye = false),
              (byeRuns = 0),
              (isLegBye = true),
              (legByeRuns = legBye)
            );
            setlegBye(1);
            setlegByeVisible(false);
          }}
        />
        <Modal animationType="fade" visible={outModal} transparent>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: 300,
              backgroundColor: "#ebc67f",
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>How?</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity onPress={() => console.log("aaa")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Bowled</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("bbb")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Caught</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("ccc")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Stumped
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("ddd")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>LBW</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity onPress={() => setdismissalType("Run Out")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Run Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("bbb")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Hit Wicket
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("ccc")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Retired
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("ddd")}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Hit the ball Twice
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", height: 50 }}>
              <AppButton
                style={{
                  width: "50%",
                  borderRadius: 0,
                  backgroundColor: "#727369",
                  height: "100%",
                }}
                onPress={() => setoutModal(false)}
              >
                Cancel
              </AppButton>
              <AppButton
                style={{
                  width: "50%",
                  borderRadius: 0,
                  height: "100%",
                  backgroundColor: "green",
                }}
              >
                OK
              </AppButton>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.slide}>
        <ScrollView contentContainerStyle={{ marginTop: 44, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#5ca5a9",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Team1</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
              <Text>(2.0 Ov)</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#d8dede",
              width: "100%",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "500", flex: 3 }}>Batters</Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              B
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              4s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              6s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              SR
            </Text>
          </View>
          <Batter
            name="Zahid"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
          <Batter
            name="Bangash"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 0.5,
              borderColor: "grey",
            }}
          >
            <Text>Extras</Text>
            <Text>0</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 0.5,
              borderColor: "grey",
            }}
          >
            <Text>Total</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "58%",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
                <Text>(2.0 Ov)</Text>
              </View>
              <Text>RR 20.60</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#d8dede",
              width: "100%",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "500", flex: 3 }}>Bowlers</Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              O
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              M
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              W
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              Eco
            </Text>
          </View>
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Dharkan"
          />
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Janu"
          />
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#5ca5a9",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Team1</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
              <Text>(2.0 Ov)</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#d8dede",
              width: "100%",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "500", flex: 3 }}>Batters</Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              B
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              4s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              6s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              SR
            </Text>
          </View>
          <Batter
            name="Zahid"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
          <Batter
            name="Bangash"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 0.5,
              borderColor: "grey",
            }}
          >
            <Text>Extras</Text>
            <Text>0</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 0.5,
              borderColor: "grey",
            }}
          >
            <Text>Total</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "58%",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
                <Text>(2.0 Ov)</Text>
              </View>
              <Text>RR 20.60</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#d8dede",
              width: "100%",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "500", flex: 3 }}>Bowlers</Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              O
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              M
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              W
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              Eco
            </Text>
          </View>
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Dharkan"
          />
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Janu"
          />
        </ScrollView>
      </View>
      <View style={styles.slide}>
        <Text style={styles.buttonText}>Info Screen</Text>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  cell: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonCell: {
    flex: 1,
    borderColor: "black",
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
