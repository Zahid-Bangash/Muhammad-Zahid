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
  Image,
} from "react-native";
import Swiper from "react-native-swiper";
import Entypo from "@expo/vector-icons/Entypo";

import { auth, db } from "../config/firebase-config";
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  getDoc,
} from "firebase/firestore";

import Batter from "../components/Batter";
import Bowler from "../components/Bowler";
import ScoringModal from "../components/ScoringModal";
import AppButton from "../components/AppButton";

export default function MatchCenter({ route, navigation }) {
  const { matchId, inningsId } = route.params;
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [moreModal, setmoreModal] = useState(false);
  //new over
  const [oversModal, setoversModal] = useState(false);
  const [newBowler, setnewBowler] = useState(null);
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
  const [dismissalTypesModal, setDismissalTypesModal] = useState(false);
  const [dismissalType, setdismissalType] = useState(null);
  const [newBatsmanModal, setnewBatsmanModal] = useState(false);
  //Initial Data
  const intitialInningsData = {
    inningsNo: 1,
    battingTeam: "Batting Team",
    bowlingTeam: "Bowling Team",
    totalRuns: 0,
    wicketsDown: 0,
    oversDelivered: 0,
    ballsDelivered: 0,
    runRate: 0,
    extras: 0,
    partnership: { runs: 0, balls: 0 },
    projectedScore: 0,
    currentOver: [],
    battingSquad: [],
    bowlingSquad: [],
    allBatsmen: [
      {
        name: "striker",
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissalType: null,
        status: "not out",
        id: 1,
      },
      {
        name: "Non striker",
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissalType: null,
        status: "not out",
        id: 2,
      },
    ],
    currentBatsmen: [
      {
        name: "Striker",
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissalType: null,
        status: "not out",
        id: 1,
      },
      {
        name: "Non Striker",
        runsScored: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        dismissalType: null,
        status: "not out",
        id: 2,
      },
    ],
    outBatsmen: [],
    remainingBatsmen: [],
    currentBowler: {
      name: "Bowler",
      balls: 0,
      overs: 0,
      runsGiven: 0,
      wicketsTaken: 0,
      maidenOvers: 0,
      eco: 0,
      id: 1,
    },
    bowlers: [
      {
        name: "Bowler",
        balls: 0,
        overs: 0,
        runsGiven: 0,
        wicketsTaken: 0,
        maidenOvers: 0,
        eco: 0,
        id: 1,
      },
    ],
    isCompleted: false,
  };
  const [matchData, setMatchData] = useState({
    title: "match Title",
    teams: {
      team1: { name: "Team A", squad: [] },
      team2: { name: "Team B", squad: [] },
    },
    venue: "Venue",
    date: "Date",
    time: "Time",
    ballType: "ball type",
    matchFormat: "match format",
    tossResult: {
      winnerTeam: "winner team",
      decision: "decision",
    },
    totalOvers: "overs",
    target: 0,
    status: "InProgress",
    result: "",
    battingTeam: " Batting Team",
    bowlingTeam: "bowling Team",
  });
  const [firstInnings, setfirstInnings] = useState({
    inningsNo: 1,
    battingTeam: "Batting Team",
    bowlingTeam: "Bowling Team",
    totalRuns: 0,
    wicketsDown: 0,
    oversDelivered: 0,
    ballsDelivered: 0,
    runRate: 0,
    extras: 0,
    partnership: { runs: 0, balls: 0 },
    projectedScore: 0,
    currentOver: [],
    battingSquad: [],
    bowlingSquad: [],
    allBatsmen: [],
    currentBatsmen: [],
    outBatsmen: [],
    remainingBatsmen: [],
    currentBowler: {},
    bowlers: [],
    isCompleted: false,
  });
  const [secondInnings, setsecondInnings] = useState({
    inningsNo: 2,
    battingTeam: "Batting Team",
    bowlingTeam: "Bowling Team",
    totalRuns: 0,
    wicketsDown: 0,
    oversDelivered: 0,
    ballsDelivered: 0,
    runRate: 0,
    extras: 0,
    partnership: { runs: 0, balls: 0 },
    projectedScore: 0,
    currentOver: [],
    battingSquad: [],
    bowlingSquad: [],
    allBatsmen: [],
    currentBatsmen: [],
    outBatsmen: [],
    remainingBatsmen: [],
    currentBowler: {},
    bowlers: [],
    isCompleted: false,
  });

  const [inningsData, setInningsData] = useState(intitialInningsData);
  let availableBowlers = inningsData.bowlingSquad;
  let batsmen = inningsData.currentBatsmen;
  const [previousState, setpreviousState] = useState([]);
  //functions
  const handleScore = (
    runs = 0,
    isWide = false,
    wdRuns = 0,
    isNoBall = false,
    noBallRuns = 0,
    isBye = false,
    byeRuns = 0,
    isLegBye = false,
    legByeRuns = 0,
    isOut = false,
    newBatsman = null,
    newbatsmanId = null
  ) => {
    const inningsDataCopy = { ...inningsData };
    if (inningsDataCopy.isCompleted === true) {
      alert("Innings is completed");
      return;
    }
    //Undo
    setpreviousState([
      ...previousState,
      JSON.parse(JSON.stringify(inningsData)),
    ]);
    //Handle extras
    if (isWide) {
      inningsDataCopy.extras += wdRuns;
      inningsDataCopy.totalRuns += wdRuns;
      inningsDataCopy.currentOver.push(`Wd${wdRuns}`);
      inningsDataCopy.currentBowler.runsGiven += wdRuns;
      inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
        if (bowler.id === inningsDataCopy.currentBowler.id) {
          return {
            ...bowler,
            runsGiven: bowler.runsGiven + wdRuns,
          };
        }
        return bowler;
      });
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
      inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
        if (bowler.id === inningsDataCopy.currentBowler.id) {
          return {
            ...bowler,
            runsGiven: bowler.runsGiven + noBallRuns,
          };
        }
        return bowler;
      });
    }
    //Handle runs
    inningsDataCopy.totalRuns += runs;
    inningsDataCopy.partnership.runs += runs;
    inningsDataCopy.currentBatsmen[0].runsScored += runs;
    inningsDataCopy.allBatsmen = inningsDataCopy.allBatsmen.map((batter) => {
      if (batter.id === inningsDataCopy.currentBatsmen[0].id) {
        return {
          ...batter,
          runsScored: batter.runsScored + runs,
        };
      }
      return batter;
    });
    inningsDataCopy.currentBowler.runsGiven += runs;
    inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
      if (bowler.id === inningsDataCopy.currentBowler.id) {
        return {
          ...bowler,
          runsGiven: bowler.runsGiven + runs,
        };
      }
      return bowler;
    });
    //increment balls
    if (!isWide && !isNoBall) {
      inningsDataCopy.ballsDelivered++;
      inningsDataCopy.currentBowler.balls++;
      inningsDataCopy.partnership.balls++;
      inningsDataCopy.currentBatsmen[0].ballsFaced++;
      inningsDataCopy.allBatsmen = inningsDataCopy.allBatsmen.map((batter) => {
        if (batter.id === inningsDataCopy.currentBatsmen[0].id) {
          return {
            ...batter,
            ballsFaced: batter.ballsFaced + 1,
          };
        }
        return batter;
      });
      inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
        if (bowler.id === inningsDataCopy.currentBowler.id) {
          return {
            ...bowler,
            balls: bowler.balls + 1,
          };
        }
        return bowler;
      });
    }
    const economy =
      inningsDataCopy.currentBowler.runsGiven /
      (inningsDataCopy.currentBowler.balls / 6);
    inningsDataCopy.currentBowler.eco = economy.toFixed(2);
    inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
      if (bowler.id === inningsDataCopy.currentBowler.id) {
        return {
          ...bowler,
          eco: economy.toFixed(2),
        };
      }
      return bowler;
    });
    const strikeRate =
      inningsDataCopy.currentBatsmen[0].runsScored === 0
        ? 0
        : (inningsDataCopy.currentBatsmen[0].runsScored /
            inningsDataCopy.currentBatsmen[0].ballsFaced) *
          100;
    inningsDataCopy.currentBatsmen[0].strikeRate = strikeRate.toFixed(2);
    inningsDataCopy.allBatsmen = inningsDataCopy.allBatsmen.map((batter) => {
      if (batter.id === inningsDataCopy.currentBatsmen[0].id) {
        return {
          ...batter,
          strikeRate: strikeRate.toFixed(2),
        };
      }
      return batter;
    });
    const runrate =
      inningsDataCopy.totalRuns / (inningsDataCopy.ballsDelivered / 6);
    inningsDataCopy.runRate = runrate.toFixed(2);
    if (!isNoBall && !isWide && !isBye && !isLegBye && !isOut)
      inningsDataCopy.currentOver.push(runs);
    //Handle boundaries
    if (runs === 4) {
      inningsDataCopy.currentBatsmen[0].fours += 1;
      inningsDataCopy.allBatsmen = inningsDataCopy.allBatsmen.map((batter) => {
        if (batter.id === inningsDataCopy.currentBatsmen[0].id) {
          return {
            ...batter,
            fours: batter.fours + 1,
          };
        }
        return batter;
      });
    }
    if (runs === 6) {
      inningsDataCopy.currentBatsmen[0].sixes += 1;
      inningsDataCopy.allBatsmen = inningsDataCopy.allBatsmen.map((batter) => {
        if (batter.id === inningsDataCopy.currentBatsmen[0].id) {
          return {
            ...batter,
            sixes: batter.sixes + 1,
          };
        }
        return batter;
      });
    }
    //Handle out
    if (isOut) {
      inningsDataCopy.wicketsDown++;
      inningsDataCopy.currentBowler.wicketsTaken++;
      inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
        if (bowler.id === inningsDataCopy.currentBowler.id) {
          return {
            ...bowler,
            wicketsTaken: bowler.wicketsTaken + 1,
          };
        }
        return bowler;
      });
      inningsDataCopy.currentBatsmen[0].dismissalType = dismissalType;
      inningsDataCopy.currentBatsmen[0].status = `b ${inningsDataCopy.currentBowler.name}`;
      inningsDataCopy.allBatsmen = inningsDataCopy.allBatsmen.map((batter) => {
        if (batter.id === inningsDataCopy.currentBatsmen[0].id) {
          return {
            ...batter,
            dismissalType: dismissalType,
            status: `b ${inningsDataCopy.currentBowler.name}`,
          };
        }
        return batter;
      });
      inningsDataCopy.outBatsmen.push(inningsDataCopy.currentBatsmen[0]);
      inningsDataCopy.currentBatsmen.splice(0, 1);
      inningsDataCopy.currentOver.push("W");
      setdismissalType(null);
      if (inningsDataCopy.remainingBatsmen.length !== 0) {
        inningsDataCopy.currentBatsmen.push({
          name: newBatsman,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: null,
          id: newbatsmanId,
          status: "not out",
        });
        inningsDataCopy.allBatsmen.push({
          name: newBatsman,
          runsScored: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          dismissalType: null,
          id: newbatsmanId,
          status: "not out",
        });
        //strike
        const temp = inningsDataCopy.currentBatsmen[0];
        inningsDataCopy.currentBatsmen[0] = inningsDataCopy.currentBatsmen[1];
        inningsDataCopy.currentBatsmen[1] = temp;
        inningsDataCopy.remainingBatsmen =
          inningsDataCopy.remainingBatsmen.filter((p) => p.name !== newBatsman);
      } else {
        inningsDataCopy.isCompleted = true;
      }
    }
    //changing strike
    if (
      runs % 2 !== 0 ||
      (wdRuns !== 0 && wdRuns % 2 === 0) ||
      (noBallRuns !== 0 && noBallRuns % 2 === 0) ||
      byeRuns % 2 !== 0 ||
      legByeRuns % 2 !== 0
    ) {
      const temp = inningsDataCopy.currentBatsmen[0];
      inningsDataCopy.currentBatsmen[0] = inningsDataCopy.currentBatsmen[1];
      inningsDataCopy.currentBatsmen[1] = temp;
    }
    //over ends
    if (
      inningsDataCopy.ballsDelivered % 6 === 0 &&
      inningsDataCopy.ballsDelivered !== 0
    ) {
      inningsDataCopy.oversDelivered += 1;
      inningsDataCopy.currentBowler.overs += 1;
      inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
        if (bowler.id === inningsDataCopy.currentBowler.id) {
          return {
            ...bowler,
            overs: bowler.overs + 1,
          };
        }
        return bowler;
      });
      // handling maiden over
      let isMaiden = true;
      inningsDataCopy.currentOver.forEach((ball) => {
        if (ball !== 0) isMaiden = false;
      });
      if (isMaiden) {
        inningsDataCopy.currentBowler.maidenOvers++;
        inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
          if (bowler.id === inningsDataCopy.currentBowler.id) {
            return {
              ...bowler,
              maidenOvers: bowler.maidenOvers + 1,
            };
          }
          return bowler;
        });
      }
      if (inningsDataCopy.oversDelivered !== matchData.totalOvers) {
        const index = availableBowlers.findIndex(
          (bowler) => bowler.id === inningsDataCopy.currentBowler.id
        );
        if (index !== -1) {
          availableBowlers.splice(index, 1);
        }
        setoversModal(true);
      }
    }
    if (inningsDataCopy.oversDelivered === matchData.totalOvers)
      inningsDataCopy.isCompleted = true;
    if (
      inningsDataCopy.inningsNo === 2 &&
      inningsDataCopy.totalRuns >= matchData.target
    )
      inningsDataCopy.isCompleted = true;
    updateInningsData(inningsDataCopy);

    if (inningsDataCopy.isCompleted === true) {
      const matchDataCopy = { ...matchData };
      if (inningsDataCopy.inningsNo === 2) {
        if (inningsDataCopy.totalRuns >= matchData.target) {
          matchDataCopy.result = `${inningsDataCopy.battingTeam} won by ${
            inningsDataCopy.battingSquad.length - inningsDataCopy.wicketsDown
          } wickets`;
          matchDataCopy.status = "Completed";
          updateMatchData(matchDataCopy);
        } else {
          matchDataCopy.result = `${inningsDataCopy.bowlingTeam} won by ${
            matchData.target - inningsDataCopy.totalRuns - 1
          } runs`;
          matchDataCopy.status = "Completed";
          updateMatchData(matchDataCopy);
        }
        Alert.alert(matchData.result, "End Match?", [
          {
            text: "No",
            onPress: () => {},
          },
          {
            text: "Yes",
            onPress: () => {
              updatePlayerStats();
              navigation.navigate("Match Details", { matchId: matchId });
            },
          },
        ]);
      } else {
        matchDataCopy.target = inningsDataCopy.totalRuns + 1;
        updateMatchData(matchDataCopy);
        Alert.alert(
          `Innings ${inningsDataCopy.inningsNo} completed`,
          "Start Next Innings?",
          [
            {
              text: "No",
              onPress: () => {},
            },
            {
              text: "Yes",
              onPress: () => navigation.pop(),
            },
          ]
        );
      }
    }
  };

  const updateInningsData = async (updatedData) => {
    try {
      const matchRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "Matches",
        matchId
      );
      const publicMatchRef = doc(db, "Matches", matchId);
      const inningsRef = collection(matchRef, "innings");
      const publicInningsRef = collection(publicMatchRef, "innings");
      const inningsDocRef = doc(inningsRef, inningsId);
      const publicInningsDocRef = doc(publicInningsRef, inningsId);
      await updateDoc(inningsDocRef, updatedData, { merge: true });
      await updateDoc(publicInningsDocRef, updatedData, { merge: true });
      console.log("Innings data updated successfully!");
    } catch (error) {
      console.error("Error updating innings data:", error);
    }
  };

  const updateMatchData = async (updatedData) => {
    try {
      const matchRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "Matches",
        matchId
      );
      const publicMatchRef = doc(db, "Matches", matchId);
      await updateDoc(matchRef, updatedData, { merge: true });
      await updateDoc(publicMatchRef, updatedData, { merge: true });
      console.log("Match data updated successfully!");
    } catch (error) {
      console.error("Error updating Match data:", error);
    }
  };

  const EndInnings = () => {
    const matchDataCopy = { ...matchData };
    const inningsDataCopy = { ...inningsData };
    if (inningsDataCopy.inningsNo === 1) {
      inningsDataCopy.isCompleted = true;
      matchDataCopy.target = inningsDataCopy.totalRuns + 1;
      updateMatchData(matchDataCopy);
      updateInningsData(inningsDataCopy);
      Alert.alert(
        `Innings ${inningsDataCopy.inningsNo} completed`,
        "Start Next Innings?",
        [
          {
            text: "No",
            onPress: () => {},
          },
          {
            text: "Yes",
            onPress: () => navigation.pop(),
          },
        ]
      );
    } else {
      if (inningsDataCopy.totalRuns >= matchDataCopy.target) {
        matchDataCopy.result = `${inningsDataCopy.battingTeam} won by ${
          inningsDataCopy.battingSquad.length - inningsDataCopy.wicketsDown
        } wickets`;
        matchDataCopy.status = "Completed";
        updateMatchData(matchDataCopy);
      } else {
        matchDataCopy.result = `${inningsDataCopy.bowlingTeam} won by ${
          matchDataCopy.target - inningsDataCopy.totalRuns - 1
        } runs`;
        matchDataCopy.status = "Completed";
        updateMatchData(matchDataCopy);
      }
      Alert.alert(matchData.result, "End Match?", [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: () =>
            navigation.navigate("Match Details", { matchId: matchId }),
        },
      ]);
    }
  };
  const getBgColor = (runs) => {
    if (runs === 4) return "blue";
    else if (runs === 6) return "#3db106";
    else return "#5e6959";
  };

  const overCompleted = (newbowler, id) => {
    const inningsDataCopy = { ...inningsData };
    availableBowlers.push(inningsDataCopy.currentBowler);
    const selectedBowler = inningsDataCopy.bowlers.find(
      (bowler) => bowler.id === id
    );
    if (!selectedBowler) {
      inningsDataCopy.currentBowler = {
        name: newbowler,
        balls: 0,
        overs: 0,
        runsGiven: 0,
        wicketsTaken: 0,
        maidenOvers: 0,
        eco: 0,
        id: id,
      };
    } else {
      inningsDataCopy.currentBowler = { ...selectedBowler };
    }
    const currentBowler = inningsDataCopy.bowlers.find(
      (bowler) => bowler.id === inningsDataCopy.currentBowler.id
    );

    if (currentBowler === undefined)
      inningsDataCopy.bowlers.push(inningsDataCopy.currentBowler);
    inningsDataCopy.currentOver = [];
    //changing strike
    const temp = inningsDataCopy.currentBatsmen[0];
    inningsDataCopy.currentBatsmen[0] = inningsDataCopy.currentBatsmen[1];
    inningsDataCopy.currentBatsmen[1] = temp;
    updateInningsData(inningsDataCopy);
  };

  const handleUndo = () => {
    if (previousState.length > 0) {
      Alert.alert("Confirm", "Are you sure you want to Undo previous ball?", [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: () => {
            const prevState = previousState.pop();
            setpreviousState([...previousState]);
            updateInningsData(prevState);
          },
        },
      ]);
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
          updateInningsData(inningsDataCopy);
        },
      },
    ]);
  };

  const updatePlayerStats = () => {
    firstInnings.allBatsmen.forEach(async (batter) => {
      const playerDocRef = doc(db, "users", batter.id);
      const docSnap = await getDoc(playerDocRef);
      const playerStats = docSnap.data().Stats;
      try {
        await updateDoc(
          playerDocRef,
          {
            "Stats.batting.overall": {
              matches: playerStats.batting.overall.matches + 1,
              innings: playerStats.batting.overall.innings + 1,
              runs: playerStats.batting.overall.runs + batter.runsScored,
              balls: playerStats.batting.overall.balls + batter.ballsFaced,
              highest:
                playerStats.batting.overall.highest < batter.runsScored
                  ? batter.runsScored
                  : playerStats.batting.overall.highest,
              average: (
                (playerStats.batting.overall.runs + batter.runsScored) /
                (playerStats.batting.overall.innings +
                  (batter.status === "not out" ? 0 : 1) -
                  playerStats.batting.overall.notOut)
              ).toFixed(2),
              sr: (
                ((playerStats.batting.overall.runs + batter.runsScored) /
                  (playerStats.batting.overall.balls + batter.ballsFaced)) *
                100
              ).toFixed(2),
              notOut:
                batter.status === "not out"
                  ? playerStats.batting.overall.notOut + 1
                  : playerStats.batting.overall.notOut,
              ducks:
                batter.runsScored === 0 && batter.status !== "not out"
                  ? playerStats.batting.overall.ducks + 1
                  : playerStats.batting.overall.ducks,
              "100s":
                batter.runsScored >= 100
                  ? playerStats.batting.overall["100s"] + 1
                  : playerStats.batting.overall["100s"],
              "50s":
                batter.runsScored >= 50
                  ? playerStats.batting.overall["50s"] + 1
                  : playerStats.batting.overall["50s"],
              "30s":
                batter.runsScored >= 30
                  ? playerStats.batting.overall["30s"] + 1
                  : playerStats.batting.overall["30s"],
              "6s": playerStats.batting.overall["6s"] + batter.sixes,
              "4s": playerStats.batting.overall["4s"] + batter.fours,
            },
          },
          { merge: true }
        );
        console.log(`Player ${batter.name} updated successfully`);
      } catch (error) {
        console.error(`Error updating player ${batter.name}: ${error}`);
      }
    });
    secondInnings.allBatsmen.forEach(async (batter) => {
      const playerDocRef = doc(db, "users", batter.id);
      const docSnap = await getDoc(playerDocRef);
      const playerStats = docSnap.data().Stats;
      try {
        await updateDoc(
          playerDocRef,
          {
            "Stats.batting.overall": {
              matches: playerStats.batting.overall.matches + 1,
              innings: playerStats.batting.overall.innings + 1,
              runs: playerStats.batting.overall.runs + batter.runsScored,
              balls: playerStats.batting.overall.balls + batter.ballsFaced,
              highest:
                playerStats.batting.overall.highest < batter.runsScored
                  ? batter.runsScored
                  : playerStats.batting.overall.highest,
              average: (
                (playerStats.batting.overall.runs + batter.runsScored) /
                (playerStats.batting.overall.innings +
                  (batter.status === "not out" ? 0 : 1) -
                  playerStats.batting.overall.notOut)
              ).toFixed(2),
              sr: (
                ((playerStats.batting.overall.runs + batter.runsScored) /
                  (playerStats.batting.overall.balls + batter.ballsFaced)) *
                100
              ).toFixed(2),
              notOut:
                batter.status === "not out"
                  ? playerStats.batting.overall.notOut + 1
                  : playerStats.batting.overall.notOut,
              ducks:
                batter.runsScored === 0 && batter.status !== "not out"
                  ? playerStats.batting.overall.ducks + 1
                  : playerStats.batting.overall.ducks,
              "100s":
                batter.runsScored >= 100
                  ? playerStats.batting.overall["100s"] + 1
                  : playerStats.batting.overall["100s"],
              "50s":
                batter.runsScored >= 50
                  ? playerStats.batting.overall["50s"] + 1
                  : playerStats.batting.overall["50s"],
              "30s":
                batter.runsScored >= 30
                  ? playerStats.batting.overall["30s"] + 1
                  : playerStats.batting.overall["30s"],
              "6s": playerStats.batting.overall["6s"] + batter.sixes,
              "4s": playerStats.batting.overall["4s"] + batter.fours,
            },
          },
          { merge: true }
        );
        console.log(`Player ${batter.name} updated successfully`);
      } catch (error) {
        console.error(`Error updating player ${batter.name}: ${error}`);
      }
    });
    firstInnings.bowlers.forEach(async (bowler) => {
      const playerDocRef = doc(db, "users", bowler.id);
      const docSnap = await getDoc(playerDocRef);
      const playerStats = docSnap.data().Stats;
      try {
        await updateDoc(
          playerDocRef,
          {
            "Stats.bowling.overall": {
              matches: playerStats.bowling.overall.matches + 1,
              innings: playerStats.bowling.overall.innings + 1,
              overs: playerStats.bowling.overall.overs + bowler.overs,
              balls: playerStats.bowling.overall.balls + bowler.ball,
              runs: playerStats.bowling.overall.runs + bowler.runsGiven,
              dots: 0,
              wides: 0,
              noBalls: 0,
              maidens: playerStats.bowling.overall.maidens + bowler.maidenOvers,
              wickets:
                playerStats.bowling.overall.wickets + bowler.wicketsTaken,
              average: (
                (playerStats.bowling.overall.runs + bowler.runsGiven) /
                (playerStats.bowling.wickets + bowler.wicketsTaken)
              ).toFixed(2),
              economy: 0,
              best: 0,
              sr: (
                (playerStats.bowling.overall.balls + bowler.balls) /
                (playerStats.bowling.wickets + bowler.wicketsTaken)
              ).toFixed(2),
              "3W":
                bowler.wicketsTaken >= 3
                  ? playerStats.bowling.overall["3W"] + 1
                  : playerStats.bowling.overall["3W"],
              "5W":
                bowler.wicketsTaken >= 5
                  ? playerStats.bowling.overall["5W"] + 1
                  : playerStats.bowling.overall["5W"],
            },
          },
          { merge: true }
        );
        console.log(`Player ${bowler.name} updated successfully`);
      } catch (error) {
        console.error(`Error updating player ${bowler.name}: ${error}`);
      }
    });
  };

  useEffect(() => {
    const matchDocRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "Matches",
      matchId
    );
    const inningsDocRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "Matches",
      matchId,
      "innings",
      inningsId
    );
    const firstInningsQuery = query(
      collection(matchDocRef, "innings"),
      where("inningsNo", "==", 1)
    );
    const secondInningsQuery = query(
      collection(matchDocRef, "innings"),
      where("inningsNo", "==", 2)
    );
    const matchUnsubscribe = onSnapshot(matchDocRef, (doc) => {
      const data = doc.data();
      setMatchData(data);
    });

    const inningsUnsubscribe = onSnapshot(inningsDocRef, (doc) => {
      const data = doc.data();
      setInningsData(data);
    });

    const firstInningsUnsubscribe = onSnapshot(
      firstInningsQuery,
      (querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const innings1Data = querySnapshot.docs[0].data();
          setfirstInnings(innings1Data);
        }
      }
    );

    const secondInningsUnsubscribe = onSnapshot(
      secondInningsQuery,
      (querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          const innings2Data = querySnapshot.docs[0].data();
          setsecondInnings(innings2Data);
        }
      }
    );
    return () => {
      matchUnsubscribe();
      inningsUnsubscribe();
      firstInningsUnsubscribe();
      secondInningsUnsubscribe();
    };
  }, []);

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
      <View style={styles.slide}>
        <View
          style={{
            flex: 3,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderColor: "gray",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            {inningsData.battingTeam}
          </Text>
          <Text>
            {inningsData.inningsNo === 1 ? "1st innings" : "2nd innings"}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 40, color: "#8f4705" }}>
            {inningsData.totalRuns}-{inningsData.wicketsDown}
          </Text>
          <Text>
            (
            {Math.floor(inningsData.ballsDelivered / 6) +
              (inningsData.ballsDelivered % 6) / 10}
            /{Object.keys(matchData).length > 0 ? matchData.totalOvers : "0"})
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            borderBottomWidth: 1,
            borderColor: "gray",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                flex: 1,
                marginLeft: 10,
              }}
            >
              Extras - {inningsData.extras}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                flex: 1.5,
                textAlign: "center",
              }}
            >
              {`Partnership - ${inningsData.partnership.runs}(${inningsData.partnership.balls})`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                flex: 1,
                textAlign: "center",
              }}
            >
              CRR - {inningsData.runRate}
            </Text>
          </View>
          {inningsData.inningsNo === 2 ? (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  flex: 1,
                  marginLeft: 10,
                }}
              >
                Target-{matchData.target}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  flex: 2,
                  textAlign: "center",
                  color: "red",
                }}
              >
                {inningsData.isCompleted === false
                  ? `${inningsData.battingTeam} NEED ${
                      matchData.target - inningsData.totalRuns
                    } OFF ${
                      matchData.totalOvers * 6 - inningsData.ballsDelivered
                    }`
                  : matchData.result}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Req.RR-5
              </Text>
            </View>
          ) : null}
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
                {inningsData.currentBatsmen[1] &&
                  inningsData.currentBatsmen[1].name}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>R</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].runsScored}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1] &&
                inningsData.currentBatsmen[1].runsScored}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>B</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].ballsFaced}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1] &&
                inningsData.currentBatsmen[1].ballsFaced}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>4s</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].fours}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1] &&
                inningsData.currentBatsmen[1].fours}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>6s</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].sixes}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1] &&
                inningsData.currentBatsmen[1].sixes}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>SR</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[0].strikeRate}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {inningsData.currentBatsmen[1] &&
                inningsData.currentBatsmen[1].strikeRate}
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
              {inningsData.currentBowler.overs}.
              {inningsData.currentBowler.balls}
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
            <TouchableWithoutFeedback
              onPress={() => setDismissalTypesModal(true)}
            >
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
            <TouchableWithoutFeedback onPress={() => setmoreModal(true)}>
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
              (legByeRuns = 0),
              (isOut = false),
              (newBatsman = null),
              (newbatsmanId = null)
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
              (legByeRuns = 0),
              (isOut = false),
              (newBatsman = null),
              (newbatsmanId = null)
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
              (legByeRuns = 0),
              (isOut = false),
              (newBatsman = null),
              (newbatsmanId = null)
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
              (legByeRuns = legBye),
              (isOut = false),
              (newBatsman = null),
              (newbatsmanId = null)
            );
            setlegBye(1);
            setlegByeVisible(false);
          }}
        />
        <Modal animationType="fade" visible={moreModal} transparent>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: 200,
              backgroundColor: "#ebc67f",
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={EndInnings}>
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                End Innings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ position: "absolute", top: 5, right: 5 }}
              onPress={() => {
                setmoreModal(false);
              }}
            >
              <Entypo name="circle-with-cross" size={45} color="red" />
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal animationType="fade" visible={dismissalTypesModal} transparent>
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
              <TouchableOpacity onPress={() => setdismissalType("Bowled")}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "Bowled" ? "red" : "black",
                  }}
                >
                  Bowled
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setdismissalType("Caught")}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "Caught" ? "red" : "black",
                  }}
                >
                  Caught
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setdismissalType("Stumped")}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "Stumped" ? "red" : "black",
                  }}
                >
                  Stumped
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setdismissalType("LBW")}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "LBW" ? "red" : "black",
                  }}
                >
                  LBW
                </Text>
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
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "Run Out" ? "red" : "black",
                  }}
                >
                  Run Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setdismissalType("Hit Wicket")}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "Hit Wicket" ? "red" : "black",
                  }}
                >
                  Hit Wicket
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setdismissalType("Retired")}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: dismissalType === "Retired" ? "red" : "black",
                  }}
                >
                  Retired
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setdismissalType("Hit the ball Twice")}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color:
                      dismissalType === "Hit the ball Twice" ? "red" : "black",
                  }}
                >
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
                onPress={() => {
                  setDismissalTypesModal(false);
                  setdismissalType(null);
                }}
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
                onPress={() => {
                  if (dismissalType === null) {
                    alert("Select dismissal type first");
                    return;
                  }
                  if (inningsData.remainingBatsmen.length === 0) {
                    handleScore(
                      (runs = 0),
                      (isWide = false),
                      (wdRuns = 0),
                      (isNoBall = false),
                      (noBallRuns = 0),
                      (isBye = false),
                      (byeRuns = 0),
                      (isLegBye = false),
                      (legByeRuns = 0),
                      (isOut = true),
                      (newBatsman = null),
                      (newbatsmanId = null)
                    );
                    setDismissalTypesModal(false);
                    return;
                  }
                  setnewBatsmanModal(true);
                  setDismissalTypesModal(false);
                }}
              >
                OK
              </AppButton>
            </View>
          </View>
        </Modal>
        <Modal visible={newBatsmanModal} animationType="slide" transparent>
          <View
            style={{
              position: "absolute",
              backgroundColor: "#07FFF0",
              transform: [{ translateX: 28 }, { translateY: 80 }],
              width: "85%",
              height: "85%",
              alignItems: "center",
              borderRadius: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 20,
                color: "brown",
              }}
            >
              Wicket Down
            </Text>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
            >
              Select New Batsman
            </Text>
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {inningsData.remainingBatsmen.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => {
                    handleScore(
                      (runs = 0),
                      (isWide = false),
                      (wdRuns = 0),
                      (isNoBall = false),
                      (noBallRuns = 0),
                      (isBye = false),
                      (byeRuns = 0),
                      (isLegBye = false),
                      (legByeRuns = 0),
                      (isOut = true),
                      (newBatsman = player.name),
                      (newbatsmanId = player.id)
                    );
                    setnewBatsmanModal(false);
                  }}
                  style={{
                    backgroundColor: "#b8dde0",
                    marginBottom: 5,
                    alignItems: "center",
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    width: "90%",
                    height: 50,
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
              onPress={() => {
                setnewBatsmanModal(false);
                setdismissalType(null);
              }}
            >
              <Entypo name="circle-with-cross" size={45} color="red" />
            </TouchableOpacity>
          </View>
        </Modal>
        {oversModal ? (
          <Modal transparent animationType="fade">
            <View
              style={{
                position: "absolute",
                backgroundColor: "#07FFF0",
                transform: [{ translateX: 28 }, { translateY: 80 }],
                width: "85%",
                height: "85%",
                alignItems: "center",
                borderRadius: 20,
                paddingVertical: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 20,
                  color: "blue",
                }}
              >
                Over Completed
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Selext Next Bowler
              </Text>
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{ alignItems: "center" }}
              >
                {availableBowlers.map((bowler) => (
                  <TouchableOpacity
                    key={bowler.id}
                    onPress={() => {
                      setoversModal(false);
                      overCompleted(bowler.name, bowler.id);
                    }}
                    style={{
                      backgroundColor: "#b8dde0",
                      marginBottom: 5,
                      alignItems: "center",
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      width: "90%",
                      height: 50,
                    }}
                  >
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>
                      {bowler.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>
        ) : null}
      </View>
      <View style={styles.slide}>
        <ScrollView style={{ width: "100%" }}>
          <View
            style={{
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "red", fontWeight: "bold" }}>
              {matchData.status === "Completed"
                ? matchData.result
                : firstInnings.isCompleted === false
                ? `${matchData.tossResult.winnerTeam} selected to ${matchData.tossResult.decision} first`
                : `${secondInnings.battingTeam} requires ${
                    matchData.target - secondInnings.totalRuns
                  } in ${
                    matchData.totalOvers * 6 - secondInnings.ballsDelivered
                  } balls`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#3ed6c4",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {matchData.battingTeam}
            </Text>
            {firstInnings.ballsDelivered === 0 ? (
              <Text style={{ fontWeight: "bold" }}>Yet to bat</Text>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {firstInnings.totalRuns} / {firstInnings.wicketsDown}
                </Text>
                <Text>{`(${
                  Math.floor(firstInnings.ballsDelivered / 6) +
                  (firstInnings.ballsDelivered % 6) / 10
                } Ov)`}</Text>
              </View>
            )}
          </View>
          {firstInnings.ballsDelivered === 0 ? null : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#97b3b4",
                  width: "100%",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text style={{ fontWeight: "500", flex: 3 }}>Batters</Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  R
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  B
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  4s
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  6s
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  SR
                </Text>
              </View>
              {firstInnings.allBatsmen.map((batter) => (
                <Batter
                  key={batter.id}
                  name={batter.name}
                  runs={batter.runsScored}
                  balls={batter.ballsFaced}
                  fours={batter.fours}
                  sixes={batter.sixes}
                  srate={batter.strikeRate}
                  status={batter.status}
                  strike={
                    batter.id === firstInnings.currentBatsmen[0].id
                      ? true
                      : false
                  }
                />
              ))}
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
                <Text>{firstInnings.extras}</Text>
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
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      {firstInnings.totalRuns}/{firstInnings.wicketsDown}
                    </Text>
                    <Text>
                      {`(${
                        Math.floor(firstInnings.ballsDelivered / 6) +
                        (firstInnings.ballsDelivered % 6) / 10
                      } Ov)`}
                    </Text>
                  </View>
                  <Text>CRR {firstInnings.runRate}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#97b3b4",
                  width: "100%",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text style={{ fontWeight: "500", flex: 3 }}>Bowlers</Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  O
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  R
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  M
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  W
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  Eco
                </Text>
              </View>
              {firstInnings.bowlers.map((bowler) => (
                <Bowler
                  key={bowler.id}
                  overs={Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10}
                  middens={bowler.maidenOvers}
                  runs={bowler.runsGiven}
                  wickets={bowler.wicketsTaken}
                  eco={bowler.eco}
                  name={bowler.name}
                />
              ))}
            </>
          )}
          {firstInnings.outBatsmen.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#97b3b4",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Fall of Wickets</Text>
                <Text style={{ fontWeight: "bold" }}>Score(Over)</Text>
              </View>
              {firstInnings.outBatsmen.map((batter, index) => (
                <View
                  key={batter.id}
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 0.5,
                    borderColor: "grey",
                  }}
                >
                  <Text>{`${index + 1}  ${batter.name}`}</Text>
                  <Text>{`${batter.runsScored} (${
                    Math.floor(batter.ballsFaced / 6) +
                    (batter.ballsFaced % 6) / 10
                  }) Ov`}</Text>
                </View>
              ))}
            </>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#3ed6c4",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {matchData.bowlingTeam}
            </Text>
            {secondInnings.ballsDelivered === 0 ? (
              <Text style={{ fontWeight: "bold" }}>Yet to bat</Text>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {secondInnings.totalRuns} / {secondInnings.wicketsDown}
                </Text>
                <Text>{`(${
                  Math.floor(secondInnings.ballsDelivered / 6) +
                  (secondInnings.ballsDelivered % 6) / 10
                } Ov)`}</Text>
              </View>
            )}
          </View>
          {secondInnings.ballsDelivered === 0 ? null : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#97b3b4",
                  width: "100%",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text style={{ fontWeight: "500", flex: 3 }}>Batters</Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  R
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  B
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  4s
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  6s
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  SR
                </Text>
              </View>
              {secondInnings.allBatsmen.map((batter) => (
                <Batter
                  key={batter.id}
                  name={batter.name}
                  runs={batter.runsScored}
                  balls={batter.ballsFaced}
                  fours={batter.fours}
                  sixes={batter.sixes}
                  srate={batter.strikeRate}
                  status={batter.status}
                  strike={
                    batter.id === secondInnings.currentBatsmen[0].id
                      ? true
                      : false
                  }
                />
              ))}
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
                <Text>{secondInnings.extras}</Text>
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
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      {secondInnings.totalRuns}/{secondInnings.wicketsDown}
                    </Text>
                    <Text>
                      {`(${
                        Math.floor(secondInnings.ballsDelivered / 6) +
                        (secondInnings.ballsDelivered % 6) / 10
                      } Ov)`}
                    </Text>
                  </View>
                  <Text>CRR {secondInnings.runRate}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#97b3b4",
                  width: "100%",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text style={{ fontWeight: "500", flex: 3 }}>Bowlers</Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  O
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  R
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  M
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  W
                </Text>
                <Text
                  style={{ fontWeight: "500", flex: 1, textAlign: "center" }}
                >
                  Eco
                </Text>
              </View>
              {secondInnings.bowlers.map((bowler) => (
                <Bowler
                  key={bowler.id}
                  overs={Math.floor(bowler.balls / 6) + (bowler.balls % 6) / 10}
                  middens={bowler.maidenOvers}
                  runs={bowler.runsGiven}
                  wickets={bowler.wicketsTaken}
                  eco={bowler.eco}
                  name={bowler.name}
                />
              ))}
            </>
          )}
          {secondInnings.outBatsmen.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#97b3b4",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Fall of Wickets</Text>
                <Text style={{ fontWeight: "bold" }}>Score(Over)</Text>
              </View>
              {secondInnings.outBatsmen.map((batter, index) => (
                <View
                  key={batter.id}
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 0.5,
                    borderColor: "grey",
                  }}
                >
                  <Text>{`${index + 1}  ${batter.name}`}</Text>
                  <Text>{`${batter.runsScored} (${
                    Math.floor(batter.ballsFaced / 6) +
                    (batter.ballsFaced % 6) / 10
                  }) Ov`}</Text>
                </View>
              ))}
            </>
          ) : null}
        </ScrollView>
      </View>
      <View style={[styles.slide, { paddingTop: 60 }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            height: "25%",
            borderBottomWidth: 0.5,
            borderColor: "grey",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={require("../assets/team5.jpg")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontWeight: "bold" }}>{matchData.battingTeam}</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={require("../assets/team1.jpg")}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontWeight: "bold" }}>{matchData.bowlingTeam}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            justifyContent: "space-around",
            width: "100%",
            height: "55%",
          }}
        >
          <View style={{ justifyContent: "space-around" }}>
            <Text style={{ fontWeight: "bold" }}>Match Title</Text>
            <Text style={{ fontWeight: "bold" }}>Format</Text>
            <Text style={{ fontWeight: "bold" }}>Ball Type</Text>
            <Text style={{ fontWeight: "bold" }}>Venue</Text>
            <Text style={{ fontWeight: "bold" }}>Overs</Text>
            <Text style={{ fontWeight: "bold" }}>Date and Time</Text>
            <Text style={{ fontWeight: "bold" }}>Toss Winner</Text>
            <Text style={{ fontWeight: "bold" }}>Decided to</Text>
            <Text style={{ fontWeight: "bold" }}>Match ID</Text>
          </View>
          <View style={{ justifyContent: "space-around" }}>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.title}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.matchFormat}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.ballType}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.venue}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.totalOvers}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.date} {matchData.time}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.tossResult.winnerTeam}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              {matchData.tossResult.decision}
            </Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>{matchId}</Text>
          </View>
        </View>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
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
  ouText: {
    color: "red",
  },
});
