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
import * as Location from "expo-location";

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
  const { matchId, inningsId, tournamentId } = route.params;
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

  const [swiperScrollEnabled, setSwiperScrollEnabled] = useState(true);
  //Out states
  const [dismissalTypesModal, setDismissalTypesModal] = useState(false);
  const [dismissalType, setdismissalType] = useState(null);
  const [newBatsmanModal, setnewBatsmanModal] = useState(false);
  //prediction
  const [percentage, setpercentage] = useState({ teamA: null, teamB: null });
  const [weather, setweather] = useState(null);
  const [coordinates, setcoordinates] = useState({ lat: 0, long: 0 });
  const [show, setshow] = useState(false);
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
      dots: 0,
      wides: 0,
      noBalls: 0,
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
        dots: 0,
        wides: 0,
        noBalls: 0,
      },
    ],
    isCompleted: false,
  };
  const [matchData, setMatchData] = useState({
    title: "match Title",
    teams: {
      team1: { name: "Team A", squad: [], iameg: "" },
      team2: { name: "Team B", squad: [], image: "" },
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
    prediction: { teamA: 0, teamB: 0 },
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

  const [tournamentData, settournamentData] = useState({});

  const [inningsData, setInningsData] = useState(intitialInningsData);
  let availableBowlers = inningsData.bowlingSquad;
  let batsmen = inningsData.currentBatsmen;
  const [previousState, setpreviousState] = useState([]);
  //functions

  const handlePredict = () => {
    if (firstInnings.ballsDelivered === 0) {
      const matchDataCopy = { ...matchData };
      matchDataCopy.prediction = { teamA: "50%", teamB: "50%" };
      updateMatchData(matchDataCopy);
      setshow(true);
      return;
    }
    const data = {
      Team_A: ["zahid team"],
      Team_B: ["owais team"],
      Venue: ["attock"],
      Toss_Winner: ["zahid team"],
      Batting_First: ["zahid team"],
      Weather: ["sunny"],
      Prev_Match_Result_A: ["loss"],
      Prev_Match_Result_B: ["loss"],
      Prev_Match_Runs_A: [95],
      Prev_Match_Runs_B: [115],
      Team_A_Player_1: ["player11"],
      Team_A_Player_2: ["player8"],
      Team_A_Player_3: ["player9"],
      Team_A_Player_4: ["player2"],
      Team_A_Player_5: ["player10"],
      Team_A_Player_6: ["player8"],
      Team_A_Player_7: ["player1"],
      Team_A_Player_8: ["player7"],
      Team_A_Player_9: ["player5"],
      Team_A_Player_10: ["player4"],
      Team_A_Player_11: ["player3"],
      Team_B_Player_1: ["player22"],
      Team_B_Player_2: ["player15"],
      Team_B_Player_3: ["player14"],
      Team_B_Player_4: ["player19"],
      Team_B_Player_5: ["player18"],
      Team_B_Player_6: ["player20"],
      Team_B_Player_7: ["player21"],
      Team_B_Player_8: ["player13"],
      Team_B_Player_9: ["player12"],
      Team_B_Player_10: ["player17"],
      Team_B_Player_11: ["player16"],
      Team_A_Batting_Average: [84],
      Team_B_Batting_Average: [117],
      Player_of_the_Match: ["player22"],
      Win_By_Runs: [22],
      Win_By_Wickets: [32],
      Run_Rate_A: [25],
      Run_Rate_B: [19],
      // OutCome: [0],
    };
    fetch("http://192.168.43.222:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Prediction: ", data.prediction * 100);
      })
      .catch((error) => {
        console.error("Error:aa", error);
      });
  };

  const getWeather = (lat, long) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=3ff1f23037aa2a5787ac63cc403ca997`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const weatherType = data.weather[0].main;
        if (weatherType === "Clouds") setweather("cloudy");
        else setweather(weatherType);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    (async () => {
      try {
        await Location.requestForegroundPermissionsAsync();
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        setcoordinates({ lat: latitude, long: longitude });
        getWeather(latitude, longitude);
        //   const location1 = await Location.reverseGeocodeAsync({ latitude, longitude });
        // if (location1.length > 0) {
        //   const currentCity = location1[0].city;
        //   setCity(currentCity);
        // }
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  // const timeOut=null;

  useEffect(() => {
    // clearTimeout(timeOut);
    const timeOut = setTimeout(() => {
      setshow(false);
    }, 10000);
  }, [show]);

  //.................................
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
            wides: bowler.wides + 1,
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
      //extra runs instead of noball(1) from bat,bye,legbye
      inningsDataCopy.extras += noBallRuns;
      inningsDataCopy.totalRuns += noBallRuns;
      inningsDataCopy.currentOver.push(`nb${noBallRuns}`);
      inningsDataCopy.currentBowler.runsGiven += noBallRuns;
      inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
        if (bowler.id === inningsDataCopy.currentBowler.id) {
          return {
            ...bowler,
            runsGiven: bowler.runsGiven + noBallRuns,
            noBalls: bowler.noBalls + 1,
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
      inningsDataCopy.currentBowler.balls === 0
        ? 0
        : inningsDataCopy.currentBowler.runsGiven /
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
      inningsDataCopy.ballsDelivered === 0
        ? 0
        : inningsDataCopy.totalRuns / (inningsDataCopy.ballsDelivered / 6);
    inningsDataCopy.runRate = runrate.toFixed(2);
    if (!isNoBall && !isWide && !isBye && !isLegBye && !isOut) {
      inningsDataCopy.currentOver.push(runs);
      //incement dot balls
      if (runs === 0) {
        inningsDataCopy.bowlers = inningsDataCopy.bowlers.map((bowler) => {
          if (bowler.id === inningsDataCopy.currentBowler.id) {
            return {
              ...bowler,
              dots: bowler.dots + 1,
            };
          }
          return bowler;
        });
      }
    }
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
          if (matchData.target - inningsDataCopy.totalRuns - 1 === 0) {
            matchDataCopy.result = "Match Tied";
          } else {
            matchDataCopy.result = `${inningsDataCopy.bowlingTeam} won by ${
              matchData.target - inningsDataCopy.totalRuns - 1
            } runs`;
          }
          matchDataCopy.status = "Completed";
          updateMatchData(matchDataCopy);
        }
        Alert.alert(matchDataCopy.result, "End Match?", [
          {
            text: "No",
            onPress: () => {},
          },
          {
            text: "Yes",
            onPress: () => {
              if (tournamentId !== "") updateTournament();
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
      if (tournamentId !== "") {
        const tournamentInningsRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "Tournaments",
          tournamentId,
          "Matches",
          matchId,
          "innings"
        );
        const publicTournamentInningsRef = collection(
          db,
          "Tournaments",
          tournamentId,
          "Matches",
          matchId,
          "innings"
        );
        const tournamentInningsDocRef = doc(tournamentInningsRef, inningsId);
        const publicTournamentInningsDocRef = doc(
          publicTournamentInningsRef,
          inningsId
        );
        await updateDoc(tournamentInningsDocRef, updatedData, { merge: true });
        await updateDoc(publicTournamentInningsDocRef, updatedData, {
          merge: true,
        });
      }
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
      if (tournamentId !== "") {
        const tournamentMatchRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "Tournaments",
          tournamentId,
          "Matches",
          matchId
        );
        const publicTournamentMatchRef = doc(
          db,
          "Tournaments",
          tournamentId,
          "Matches",
          matchId
        );
        await updateDoc(tournamentMatchRef, updatedData, { merge: true });
        await updateDoc(publicTournamentMatchRef, updatedData, { merge: true });
      }
      console.log("Match data updated successfully!");
    } catch (error) {
      console.error("Error updating Match data:", error);
    }
  };

  const updateTournament = async () => {
    const updatedTournamentData = { ...tournamentData };
    let highestScore = { playerName: "", score: 0, teamName: "" };
    let mostWickets = { playerName: "", wickets: 0, teamName: "" };
    let mostFours = { playerName: "", fours: 0, teamName: "" };
    let mostSixes = { playerName: "", sixes: 0, teamName: "" };
    let bestBowling = {
      playerName: "",
      best: { wickets: 0, runs: 0 },
      teamName: "",
    };
    firstInnings.allBatsmen.forEach((batsman) => {
      updatedTournamentData.fours += batsman.fours;
      updatedTournamentData.sixes += batsman.sixes;
      if (batsman.runsScored > highestScore.score) {
        highestScore = {
          playerName: batsman.name,
          score: batsman.runsScored,
          teamName: firstInnings.battingTeam,
        };
      }
      if (batsman.fours > mostFours.fours) {
        mostFours = {
          playerName: batsman.name,
          fours: batsman.fours,
          teamName: firstInnings.battingTeam,
        };
      }
      if (batsman.sixes > mostSixes.sixes) {
        mostSixes = {
          playerName: batsman.name,
          sixes: batsman.sixes,
          teamName: firstInnings.battingTeam,
        };
      }
    });
    secondInnings.allBatsmen.forEach((batsman) => {
      updatedTournamentData.fours += batsman.fours;
      updatedTournamentData.sixes += batsman.sixes;
      if (batsman.runsScored > highestScore.score) {
        highestScore = {
          playerName: batsman.name,
          score: batsman.runsScored,
          teamName: secondInnings.battingTeam,
        };
      }
      if (batsman.fours > mostFours.fours) {
        mostFours = {
          playerName: batsman.name,
          fours: batsman.fours,
          teamName: secondInnings.battingTeam,
        };
      }
      if (batsman.sixes > mostSixes.sixes) {
        mostSixes = {
          playerName: batsman.name,
          sixes: batsman.sixes,
          teamName: secondInnings.battingTeam,
        };
      }
    });
    updatedTournamentData.highestScore =
      highestScore.score > updatedTournamentData.highestScore.score
        ? highestScore
        : updatedTournamentData.highestScore;
    updatedTournamentData.mostFours =
      mostFours.fours > updatedTournamentData.mostFours.fours
        ? mostFours
        : updatedTournamentData.mostFours;
    updatedTournamentData.mostSixes =
      mostSixes.sixes > updatedTournamentData.mostSixes.sixes
        ? mostSixes
        : updatedTournamentData.mostSixes;

    firstInnings.bowlers.forEach((bowler) => {
      if (bowler.wicketsTaken > mostWickets.wickets) {
        mostWickets = {
          playerName: bowler.name,
          wickets: bowler.wicketsTaken,
          teamName: firstInnings.bowlingTeam,
        };
      }
      bestBowling =
        bestBowling.best.wickets === bowler.wicketsTaken &&
        bestBowling.best.runs >= bowler.runsGiven
          ? {
              playerName: bowler.name,
              best: { wickets: bowler.wicketsTaken, runs: bowler.runsGiven },
              teamName: firstInnings.bowlingTeam,
            }
          : bestBowling.best.wickets < bowler.wicketsTaken
          ? {
              playerName: bowler.name,
              best: { wickets: bowler.wicketsTaken, runs: bowler.runsGiven },
              teamName: firstInnings.bowlingTeam,
            }
          : bestBowling;
      console.log(bestBowling);
    });
    secondInnings.bowlers.forEach((bowler) => {
      console.log(bowler);
      if (bowler.wicketsTaken > mostWickets.wickets) {
        mostWickets = {
          playerName: bowler.name,
          best: bowler.wicketsTaken,
          teamName: secondInnings.bowlingTeam,
        };
      }
      bestBowling =
        bestBowling.best.wickets === bowler.wicketsTaken &&
        bestBowling.best.runs >= bowler.runsGiven
          ? {
              playerName: bowler.name,
              best: { wickets: bowler.wicketsTaken, runs: bowler.runsGiven },
              teamName: secondInnings.bowlingTeam,
            }
          : bestBowling.best.wickets < bowler.wicketsTaken
          ? {
              playerName: bowler.name,
              best: { wickets: bowler.wicketsTaken, runs: bowler.runsGiven },
              teamName: secondInnings.bowlingTeam,
            }
          : bestBowling;
    });
    updatedTournamentData.bestBowling =
      updatedTournamentData.bestBowling.best.wickets ===
        bestBowling.best.wickets &&
      updatedTournamentData.bestBowling.best.runs >= bestBowling.best.runs
        ? bestBowling
        : updatedTournamentData.bestBowling.best.wickets <
          bestBowling.best.wickets
        ? bestBowling
        : updatedTournamentData.bestBowling;

    updatedTournamentData.mostWickets =
      mostWickets.wickets > updatedTournamentData.mostWickets.wickets
        ? mostWickets
        : updatedTournamentData.mostWickets;
    const tournamentRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "Tournaments",
      tournamentId
    );
    const publicTournamentRef = doc(db, "Tournaments", tournamentId);
    await updateDoc(tournamentRef, updatedTournamentData, { merge: true });
    await updateDoc(publicTournamentRef, updatedTournamentData, {
      merge: true,
    });
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
      Alert.alert(matchDataCopy.result, "End Match?", [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: () => {
            if (tournamentId !== "") updateTournament();
            updatePlayerStats();
            navigation.navigate("Match Details", { matchId: matchId });
          },
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
        dots: 0,
        wides: 0,
        noBalls: 0,
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
              average:
                playerStats.batting.overall.innings +
                  (batter.status === "not out" ? 0 : 1) -
                  playerStats.batting.overall.notOut <=
                0
                  ? playerStats.batting.overall.runs + batter.runsScored
                  : (
                      (playerStats.batting.overall.runs + batter.runsScored) /
                      (playerStats.batting.overall.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.overall.notOut)
                    ).toFixed(2),
              sr:
                playerStats.batting.overall.runs + batter.runsScored === 0
                  ? 0
                  : (
                      ((playerStats.batting.overall.runs + batter.runsScored) /
                        (playerStats.batting.overall.balls +
                          batter.ballsFaced)) *
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
            "Stats.batting.leather":
              matchData.ballType === "leather"
                ? {
                    matches: playerStats.batting.leather.matches + 1,
                    innings: playerStats.batting.leather.innings + 1,
                    runs: playerStats.batting.leather.runs + batter.runsScored,
                    balls:
                      playerStats.batting.leather.balls + batter.ballsFaced,
                    highest:
                      playerStats.batting.leather.highest < batter.runsScored
                        ? batter.runsScored
                        : playerStats.batting.leather.highest,
                    average:
                      playerStats.batting.leather.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.leather.notOut <=
                      0
                        ? playerStats.batting.leather.runs + batter.runsScored
                        : (
                            (playerStats.batting.leather.runs +
                              batter.runsScored) /
                            (playerStats.batting.leather.innings +
                              (batter.status === "not out" ? 0 : 1) -
                              playerStats.batting.leather.notOut)
                          ).toFixed(2),
                    sr:
                      playerStats.batting.leather.runs + batter.runsScored === 0
                        ? 0
                        : (
                            ((playerStats.batting.leather.runs +
                              batter.runsScored) /
                              (playerStats.batting.leather.balls +
                                batter.ballsFaced)) *
                            100
                          ).toFixed(2),
                    notOut:
                      batter.status === "not out"
                        ? playerStats.batting.leather.notOut + 1
                        : playerStats.batting.leather.notOut,
                    ducks:
                      batter.runsScored === 0 && batter.status !== "not out"
                        ? playerStats.batting.leather.ducks + 1
                        : playerStats.batting.leather.ducks,
                    "100s":
                      batter.runsScored >= 100
                        ? playerStats.batting.leather["100s"] + 1
                        : playerStats.batting.leather["100s"],
                    "50s":
                      batter.runsScored >= 50
                        ? playerStats.batting.leather["50s"] + 1
                        : playerStats.batting.leather["50s"],
                    "30s":
                      batter.runsScored >= 30
                        ? playerStats.batting.leather["30s"] + 1
                        : playerStats.batting.leather["30s"],
                    "6s": playerStats.batting.leather["6s"] + batter.sixes,
                    "4s": playerStats.batting.leather["4s"] + batter.fours,
                  }
                : playerStats.batting.leather,
            "Stats.batting.tennis":
              matchData.ballType === "tennis"
                ? {
                    matches: playerStats.batting.tennis.matches + 1,
                    innings: playerStats.batting.tennis.innings + 1,
                    runs: playerStats.batting.tennis.runs + batter.runsScored,
                    balls: playerStats.batting.tennis.balls + batter.ballsFaced,
                    highest:
                      playerStats.batting.tennis.highest < batter.runsScored
                        ? batter.runsScored
                        : playerStats.batting.tennis.highest,
                    average:
                      playerStats.batting.tennis.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.tennis.notOut <=
                      0
                        ? playerStats.batting.tennis.runs + batter.runsScored
                        : (
                            (playerStats.batting.tennis.runs +
                              batter.runsScored) /
                            (playerStats.batting.tennis.innings +
                              (batter.status === "not out" ? 0 : 1) -
                              playerStats.batting.tennis.notOut)
                          ).toFixed(2),
                    sr:
                      playerStats.batting.tennis.runs + batter.runsScored === 0
                        ? 0
                        : (
                            ((playerStats.batting.tennis.runs +
                              batter.runsScored) /
                              (playerStats.batting.tennis.balls +
                                batter.ballsFaced)) *
                            100
                          ).toFixed(2),
                    notOut:
                      batter.status === "not out"
                        ? playerStats.batting.tennis.notOut + 1
                        : playerStats.batting.tennis.notOut,
                    ducks:
                      batter.runsScored === 0 && batter.status !== "not out"
                        ? playerStats.batting.tennis.ducks + 1
                        : playerStats.batting.tennis.ducks,
                    "100s":
                      batter.runsScored >= 100
                        ? playerStats.batting.tennis["100s"] + 1
                        : playerStats.batting.tennis["100s"],
                    "50s":
                      batter.runsScored >= 50
                        ? playerStats.batting.tennis["50s"] + 1
                        : playerStats.batting.tennis["50s"],
                    "30s":
                      batter.runsScored >= 30
                        ? playerStats.batting.tennis["30s"] + 1
                        : playerStats.batting.tennis["30s"],
                    "6s": playerStats.batting.tennis["6s"] + batter.sixes,
                    "4s": playerStats.batting.tennis["4s"] + batter.fours,
                  }
                : playerStats.batting.tennis,
            "Stats.batting.other":
              matchData.ballType === "other"
                ? {
                    matches: playerStats.batting.other.matches + 1,
                    innings: playerStats.batting.other.innings + 1,
                    runs: playerStats.batting.other.runs + batter.runsScored,
                    balls: playerStats.batting.other.balls + batter.ballsFaced,
                    highest:
                      playerStats.batting.other.highest < batter.runsScored
                        ? batter.runsScored
                        : playerStats.batting.other.highest,
                    average:
                      playerStats.batting.other.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.other.notOut <=
                      0
                        ? playerStats.batting.other.runs + batter.runsScored
                        : (
                            (playerStats.batting.other.runs +
                              batter.runsScored) /
                            (playerStats.batting.other.innings +
                              (batter.status === "not out" ? 0 : 1) -
                              playerStats.batting.other.notOut)
                          ).toFixed(2),
                    sr:
                      playerStats.batting.other.runs + batter.runsScored === 0
                        ? 0
                        : (
                            ((playerStats.batting.other.runs +
                              batter.runsScored) /
                              (playerStats.batting.other.balls +
                                batter.ballsFaced)) *
                            100
                          ).toFixed(2),
                    notOut:
                      batter.status === "not out"
                        ? playerStats.batting.other.notOut + 1
                        : playerStats.batting.other.notOut,
                    ducks:
                      batter.runsScored === 0 && batter.status !== "not out"
                        ? playerStats.batting.other.ducks + 1
                        : playerStats.batting.other.ducks,
                    "100s":
                      batter.runsScored >= 100
                        ? playerStats.batting.other["100s"] + 1
                        : playerStats.batting.other["100s"],
                    "50s":
                      batter.runsScored >= 50
                        ? playerStats.batting.other["50s"] + 1
                        : playerStats.batting.other["50s"],
                    "30s":
                      batter.runsScored >= 30
                        ? playerStats.batting.other["30s"] + 1
                        : playerStats.batting.other["30s"],
                    "6s": playerStats.batting.other["6s"] + batter.sixes,
                    "4s": playerStats.batting.other["4s"] + batter.fours,
                  }
                : playerStats.batting.other,
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
              average:
                playerStats.batting.overall.innings +
                  (batter.status === "not out" ? 0 : 1) -
                  playerStats.batting.overall.notOut <=
                0
                  ? playerStats.batting.overall.runs + batter.runsScored
                  : (
                      (playerStats.batting.overall.runs + batter.runsScored) /
                      (playerStats.batting.overall.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.overall.notOut)
                    ).toFixed(2),
              sr:
                playerStats.batting.overall.runs + batter.runsScored === 0
                  ? 0
                  : (
                      ((playerStats.batting.overall.runs + batter.runsScored) /
                        (playerStats.batting.overall.balls +
                          batter.ballsFaced)) *
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
            "Stats.batting.leather":
              matchData.ballType === "leather"
                ? {
                    matches: playerStats.batting.leather.matches + 1,
                    innings: playerStats.batting.leather.innings + 1,
                    runs: playerStats.batting.leather.runs + batter.runsScored,
                    balls:
                      playerStats.batting.leather.balls + batter.ballsFaced,
                    highest:
                      playerStats.batting.leather.highest < batter.runsScored
                        ? batter.runsScored
                        : playerStats.batting.leather.highest,
                    average:
                      playerStats.batting.leather.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.leather.notOut <=
                      0
                        ? playerStats.batting.leather.runs + batter.runsScored
                        : (
                            (playerStats.batting.leather.runs +
                              batter.runsScored) /
                            (playerStats.batting.leather.innings +
                              (batter.status === "not out" ? 0 : 1) -
                              playerStats.batting.leather.notOut)
                          ).toFixed(2),
                    sr:
                      playerStats.batting.leather.runs + batter.runsScored === 0
                        ? 0
                        : (
                            ((playerStats.batting.leather.runs +
                              batter.runsScored) /
                              (playerStats.batting.leather.balls +
                                batter.ballsFaced)) *
                            100
                          ).toFixed(2),
                    notOut:
                      batter.status === "not out"
                        ? playerStats.batting.leather.notOut + 1
                        : playerStats.batting.leather.notOut,
                    ducks:
                      batter.runsScored === 0 && batter.status !== "not out"
                        ? playerStats.batting.leather.ducks + 1
                        : playerStats.batting.leather.ducks,
                    "100s":
                      batter.runsScored >= 100
                        ? playerStats.batting.leather["100s"] + 1
                        : playerStats.batting.leather["100s"],
                    "50s":
                      batter.runsScored >= 50
                        ? playerStats.batting.leather["50s"] + 1
                        : playerStats.batting.leather["50s"],
                    "30s":
                      batter.runsScored >= 30
                        ? playerStats.batting.leather["30s"] + 1
                        : playerStats.batting.leather["30s"],
                    "6s": playerStats.batting.leather["6s"] + batter.sixes,
                    "4s": playerStats.batting.leather["4s"] + batter.fours,
                  }
                : playerStats.batting.leather,
            "Stats.batting.tennis":
              matchData.ballType === "tennis"
                ? {
                    matches: playerStats.batting.tennis.matches + 1,
                    innings: playerStats.batting.tennis.innings + 1,
                    runs: playerStats.batting.tennis.runs + batter.runsScored,
                    balls: playerStats.batting.tennis.balls + batter.ballsFaced,
                    highest:
                      playerStats.batting.tennis.highest < batter.runsScored
                        ? batter.runsScored
                        : playerStats.batting.tennis.highest,
                    average:
                      playerStats.batting.tennis.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.tennis.notOut <=
                      0
                        ? playerStats.batting.tennis.runs + batter.runsScored
                        : (
                            (playerStats.batting.tennis.runs +
                              batter.runsScored) /
                            (playerStats.batting.tennis.innings +
                              (batter.status === "not out" ? 0 : 1) -
                              playerStats.batting.tennis.notOut)
                          ).toFixed(2),
                    sr:
                      playerStats.batting.tennis.runs + batter.runsScored === 0
                        ? 0
                        : (
                            ((playerStats.batting.tennis.runs +
                              batter.runsScored) /
                              (playerStats.batting.tennis.balls +
                                batter.ballsFaced)) *
                            100
                          ).toFixed(2),
                    notOut:
                      batter.status === "not out"
                        ? playerStats.batting.tennis.notOut + 1
                        : playerStats.batting.tennis.notOut,
                    ducks:
                      batter.runsScored === 0 && batter.status !== "not out"
                        ? playerStats.batting.tennis.ducks + 1
                        : playerStats.batting.tennis.ducks,
                    "100s":
                      batter.runsScored >= 100
                        ? playerStats.batting.tennis["100s"] + 1
                        : playerStats.batting.tennis["100s"],
                    "50s":
                      batter.runsScored >= 50
                        ? playerStats.batting.tennis["50s"] + 1
                        : playerStats.batting.tennis["50s"],
                    "30s":
                      batter.runsScored >= 30
                        ? playerStats.batting.tennis["30s"] + 1
                        : playerStats.batting.tennis["30s"],
                    "6s": playerStats.batting.tennis["6s"] + batter.sixes,
                    "4s": playerStats.batting.tennis["4s"] + batter.fours,
                  }
                : playerStats.batting.tennis,
            "Stats.batting.other":
              matchData.ballType === "other"
                ? {
                    matches: playerStats.batting.other.matches + 1,
                    innings: playerStats.batting.other.innings + 1,
                    runs: playerStats.batting.other.runs + batter.runsScored,
                    balls: playerStats.batting.other.balls + batter.ballsFaced,
                    highest:
                      playerStats.batting.other.highest < batter.runsScored
                        ? batter.runsScored
                        : playerStats.batting.other.highest,
                    average:
                      playerStats.batting.other.innings +
                        (batter.status === "not out" ? 0 : 1) -
                        playerStats.batting.other.notOut <=
                      0
                        ? playerStats.batting.other.runs + batter.runsScored
                        : (
                            (playerStats.batting.other.runs +
                              batter.runsScored) /
                            (playerStats.batting.other.innings +
                              (batter.status === "not out" ? 0 : 1) -
                              playerStats.batting.other.notOut)
                          ).toFixed(2),
                    sr:
                      playerStats.batting.other.runs + batter.runsScored === 0
                        ? 0
                        : (
                            ((playerStats.batting.other.runs +
                              batter.runsScored) /
                              (playerStats.batting.other.balls +
                                batter.ballsFaced)) *
                            100
                          ).toFixed(2),
                    notOut:
                      batter.status === "not out"
                        ? playerStats.batting.other.notOut + 1
                        : playerStats.batting.other.notOut,
                    ducks:
                      batter.runsScored === 0 && batter.status !== "not out"
                        ? playerStats.batting.other.ducks + 1
                        : playerStats.batting.other.ducks,
                    "100s":
                      batter.runsScored >= 100
                        ? playerStats.batting.other["100s"] + 1
                        : playerStats.batting.other["100s"],
                    "50s":
                      batter.runsScored >= 50
                        ? playerStats.batting.other["50s"] + 1
                        : playerStats.batting.other["50s"],
                    "30s":
                      batter.runsScored >= 30
                        ? playerStats.batting.other["30s"] + 1
                        : playerStats.batting.other["30s"],
                    "6s": playerStats.batting.other["6s"] + batter.sixes,
                    "4s": playerStats.batting.other["4s"] + batter.fours,
                  }
                : playerStats.batting.other,
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
              balls: playerStats.bowling.overall.balls + bowler.balls,
              runs: playerStats.bowling.overall.runs + bowler.runsGiven,
              dots: playerStats.bowling.overall.dots + bowler.dots,
              wides: playerStats.bowling.overall.wides + bowler.wides,
              noBalls: playerStats.bowling.overall.noBalls + bowler.noBalls,
              maidens: playerStats.bowling.overall.maidens + bowler.maidenOvers,
              wickets:
                playerStats.bowling.overall.wickets + bowler.wicketsTaken,
              average:
                playerStats.bowling.overall.runs + bowler.runsGiven === 0
                  ? 0
                  : (
                      (playerStats.bowling.overall.runs + bowler.runsGiven) /
                      (playerStats.bowling.overall.wickets +
                        bowler.wicketsTaken)
                    ).toFixed(2),
              economy:
                playerStats.bowling.overall.balls + bowler.balls === 0
                  ? 0
                  : (
                      (playerStats.bowling.overall.runs + bowler.runsGiven) /
                      (playerStats.bowling.overall.balls + bowler.balls) /
                      6
                    ).toFixed(2),
              best:
                playerStats.bowling.overall.best.wickets ===
                  bowler.wicketsTaken &&
                playerStats.bowling.overall.best.runs >= bowler.runsGiven
                  ? { wickets: bowler.wicketsTaken, runs: bowler.runsGiven }
                  : playerStats.bowling.overall.best.wickets <
                    bowler.wicketsTaken
                  ? { wickets: bowler.wicketsTaken, runs: bowler.runsGiven }
                  : {
                      wickets: playerStats.bowling.overall.best.wickets,
                      runs: playerStats.bowling.overall.best.runs,
                    },
              sr: (playerStats.bowling.overall.balls + bowler.balls === 0
                ? 0
                : (playerStats.bowling.overall.balls + bowler.balls) /
                  (playerStats.bowling.overall.wickets + bowler.wicketsTaken)
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
            "Stats.bowling.leather":
              matchData.ballType === "leather"
                ? {
                    matches: playerStats.bowling.leather.matches + 1,
                    innings: playerStats.bowling.leather.innings + 1,
                    overs: playerStats.bowling.leather.overs + bowler.overs,
                    balls: playerStats.bowling.leather.balls + bowler.balls,
                    runs: playerStats.bowling.leather.runs + bowler.runsGiven,
                    dots: playerStats.bowling.leather.dots + bowler.dots,
                    wides: playerStats.bowling.leather.wides + bowler.wides,
                    noBalls:
                      playerStats.bowling.leather.noBalls + bowler.noBalls,
                    maidens:
                      playerStats.bowling.leather.maidens + bowler.maidenOvers,
                    wickets:
                      playerStats.bowling.leather.wickets + bowler.wicketsTaken,
                    average:
                      playerStats.bowling.leather.runs + bowler.runsGiven === 0
                        ? 0
                        : (
                            (playerStats.bowling.leather.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.leather.wickets +
                              bowler.wicketsTaken)
                          ).toFixed(2),
                    economy:
                      playerStats.bowling.leather.balls + bowler.balls === 0
                        ? 0
                        : (
                            (playerStats.bowling.leather.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.leather.balls + bowler.balls) /
                            6
                          ).toFixed(2),
                    best:
                      playerStats.bowling.leather.best.wickets ===
                        bowler.wicketsTaken &&
                      playerStats.bowling.leather.best.runs >= bowler.runsGiven
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : playerStats.bowling.leather.best.wickets <
                          bowler.wicketsTaken
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : {
                            wickets: playerStats.bowling.leather.best.wickets,
                            runs: playerStats.bowling.leather.best.runs,
                          },
                    sr: (playerStats.bowling.leather.balls + bowler.balls === 0
                      ? 0
                      : (playerStats.bowling.leather.balls + bowler.balls) /
                        (playerStats.bowling.leather.wickets +
                          bowler.wicketsTaken)
                    ).toFixed(2),
                    "3W":
                      bowler.wicketsTaken >= 3
                        ? playerStats.bowling.leather["3W"] + 1
                        : playerStats.bowling.leather["3W"],
                    "5W":
                      bowler.wicketsTaken >= 5
                        ? playerStats.bowling.leather["5W"] + 1
                        : playerStats.bowling.leather["5W"],
                  }
                : playerStats.bowling.leather,
            "Stats.bowling.tennis":
              matchData.ballType === "tennis"
                ? {
                    matches: playerStats.bowling.tennis.matches + 1,
                    innings: playerStats.bowling.tennis.innings + 1,
                    overs: playerStats.bowling.tennis.overs + bowler.overs,
                    balls: playerStats.bowling.tennis.balls + bowler.balls,
                    runs: playerStats.bowling.tennis.runs + bowler.runsGiven,
                    dots: playerStats.bowling.tennis.dots + bowler.dots,
                    wides: playerStats.bowling.tennis.wides + bowler.wides,
                    noBalls:
                      playerStats.bowling.tennis.noBalls + bowler.noBalls,
                    maidens:
                      playerStats.bowling.tennis.maidens + bowler.maidenOvers,
                    wickets:
                      playerStats.bowling.tennis.wickets + bowler.wicketsTaken,
                    average:
                      playerStats.bowling.tennis.runs + bowler.runsGiven === 0
                        ? 0
                        : (
                            (playerStats.bowling.tennis.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.tennis.wickets +
                              bowler.wicketsTaken)
                          ).toFixed(2),
                    economy:
                      playerStats.bowling.tennis.balls + bowler.balls === 0
                        ? 0
                        : (
                            (playerStats.bowling.tennis.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.tennis.balls + bowler.balls) /
                            6
                          ).toFixed(2),
                    best:
                      playerStats.bowling.tennis.best.wickets ===
                        bowler.wicketsTaken &&
                      playerStats.bowling.tennis.best.runs >= bowler.runsGiven
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : playerStats.bowling.tennis.best.wickets <
                          bowler.wicketsTaken
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : {
                            wickets: playerStats.bowling.tennis.best.wickets,
                            runs: playerStats.bowling.tennis.best.runs,
                          },
                    sr: (playerStats.bowling.tennis.balls + bowler.balls === 0
                      ? 0
                      : (playerStats.bowling.tennis.balls + bowler.balls) /
                        (playerStats.bowling.tennis.wickets +
                          bowler.wicketsTaken)
                    ).toFixed(2),
                    "3W":
                      bowler.wicketsTaken >= 3
                        ? playerStats.bowling.tennis["3W"] + 1
                        : playerStats.bowling.tennis["3W"],
                    "5W":
                      bowler.wicketsTaken >= 5
                        ? playerStats.bowling.tennis["5W"] + 1
                        : playerStats.bowling.tennis["5W"],
                  }
                : playerStats.bowling.tennis,
            "Stats.bowling.other":
              matchData.ballType === "other"
                ? {
                    matches: playerStats.bowling.other.matches + 1,
                    innings: playerStats.bowling.other.innings + 1,
                    overs: playerStats.bowling.other.overs + bowler.overs,
                    balls: playerStats.bowling.other.balls + bowler.balls,
                    runs: playerStats.bowling.other.runs + bowler.runsGiven,
                    dots: playerStats.bowling.other.dots + bowler.dots,
                    wides: playerStats.bowling.other.wides + bowler.wides,
                    noBalls: playerStats.bowling.other.noBalls + bowler.noBalls,
                    maidens:
                      playerStats.bowling.other.maidens + bowler.maidenOvers,
                    wickets:
                      playerStats.bowling.other.wickets + bowler.wicketsTaken,
                    average:
                      playerStats.bowling.other.runs + bowler.runsGiven === 0
                        ? 0
                        : (
                            (playerStats.bowling.other.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.other.wickets +
                              bowler.wicketsTaken)
                          ).toFixed(2),
                    economy:
                      playerStats.bowling.other.balls + bowler.balls === 0
                        ? 0
                        : (
                            (playerStats.bowling.other.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.other.balls + bowler.balls) /
                            6
                          ).toFixed(2),
                    best:
                      playerStats.bowling.other.best.wickets ===
                        bowler.wicketsTaken &&
                      playerStats.bowling.other.best.runs >= bowler.runsGiven
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : playerStats.bowling.other.best.wickets <
                          bowler.wicketsTaken
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : {
                            wickets: playerStats.bowling.other.best.wickets,
                            runs: playerStats.bowling.other.best.runs,
                          },
                    sr: (playerStats.bowling.other.balls + bowler.balls === 0
                      ? 0
                      : (playerStats.bowling.other.balls + bowler.balls) /
                        (playerStats.bowling.other.wickets +
                          bowler.wicketsTaken)
                    ).toFixed(2),
                    "3W":
                      bowler.wicketsTaken >= 3
                        ? playerStats.bowling.other["3W"] + 1
                        : playerStats.bowling.other["3W"],
                    "5W":
                      bowler.wicketsTaken >= 5
                        ? playerStats.bowling.other["5W"] + 1
                        : playerStats.bowling.other["5W"],
                  }
                : playerStats.bowling.other,
          },
          { merge: true }
        );
        console.log(`Player ${bowler.name} updated successfully`);
      } catch (error) {
        console.error(`Error updating player ${bowler.name}: ${error}`);
      }
    });
    secondInnings.bowlers.forEach(async (bowler) => {
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
              balls: playerStats.bowling.overall.balls + bowler.balls,
              runs: playerStats.bowling.overall.runs + bowler.runsGiven,
              dots: playerStats.bowling.overall.dots + bowler.dots,
              wides: playerStats.bowling.overall.wides + bowler.wides,
              noBalls: playerStats.bowling.overall.noBalls + bowler.noBalls,
              maidens: playerStats.bowling.overall.maidens + bowler.maidenOvers,
              wickets:
                playerStats.bowling.overall.wickets + bowler.wicketsTaken,
              average:
                playerStats.bowling.overall.runs + bowler.runsGiven === 0
                  ? 0
                  : (
                      (playerStats.bowling.overall.runs + bowler.runsGiven) /
                      (playerStats.bowling.overall.wickets +
                        bowler.wicketsTaken)
                    ).toFixed(2),
              economy:
                playerStats.bowling.overall.balls + bowler.balls === 0
                  ? 0
                  : (
                      (playerStats.bowling.overall.runs + bowler.runsGiven) /
                      (playerStats.bowling.overall.balls + bowler.balls) /
                      6
                    ).toFixed(2),
              best:
                playerStats.bowling.overall.best.wickets ===
                  bowler.wicketsTaken &&
                playerStats.bowling.overall.best.runs >= bowler.runsGiven
                  ? { wickets: bowler.wicketsTaken, runs: bowler.runsGiven }
                  : playerStats.bowling.overall.best.wickets <
                    bowler.wicketsTaken
                  ? { wickets: bowler.wicketsTaken, runs: bowler.runsGiven }
                  : {
                      wickets: playerStats.bowling.overall.best.wickets,
                      runs: playerStats.bowling.overall.best.runs,
                    },
              sr: (playerStats.bowling.overall.balls + bowler.balls === 0
                ? 0
                : (playerStats.bowling.overall.balls + bowler.balls) /
                  (playerStats.bowling.overall.wickets + bowler.wicketsTaken)
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
            "Stats.bowling.leather":
              matchData.ballType === "leather"
                ? {
                    matches: playerStats.bowling.leather.matches + 1,
                    innings: playerStats.bowling.leather.innings + 1,
                    overs: playerStats.bowling.leather.overs + bowler.overs,
                    balls: playerStats.bowling.leather.balls + bowler.balls,
                    runs: playerStats.bowling.leather.runs + bowler.runsGiven,
                    dots: playerStats.bowling.leather.dots + bowler.dots,
                    wides: playerStats.bowling.leather.wides + bowler.wides,
                    noBalls:
                      playerStats.bowling.leather.noBalls + bowler.noBalls,
                    maidens:
                      playerStats.bowling.leather.maidens + bowler.maidenOvers,
                    wickets:
                      playerStats.bowling.leather.wickets + bowler.wicketsTaken,
                    average:
                      playerStats.bowling.leather.runs + bowler.runsGiven === 0
                        ? 0
                        : (
                            (playerStats.bowling.leather.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.leather.wickets +
                              bowler.wicketsTaken)
                          ).toFixed(2),
                    economy:
                      playerStats.bowling.leather.balls + bowler.balls === 0
                        ? 0
                        : (
                            (playerStats.bowling.leather.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.leather.balls + bowler.balls) /
                            6
                          ).toFixed(2),
                    best:
                      playerStats.bowling.leather.best.wickets ===
                        bowler.wicketsTaken &&
                      playerStats.bowling.leather.best.runs >= bowler.runsGiven
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : playerStats.bowling.leather.best.wickets <
                          bowler.wicketsTaken
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : {
                            wickets: playerStats.bowling.leather.best.wickets,
                            runs: playerStats.bowling.leather.best.runs,
                          },
                    sr: (playerStats.bowling.leather.balls + bowler.balls === 0
                      ? 0
                      : (playerStats.bowling.leather.balls + bowler.balls) /
                        (playerStats.bowling.leather.wickets +
                          bowler.wicketsTaken)
                    ).toFixed(2),
                    "3W":
                      bowler.wicketsTaken >= 3
                        ? playerStats.bowling.leather["3W"] + 1
                        : playerStats.bowling.leather["3W"],
                    "5W":
                      bowler.wicketsTaken >= 5
                        ? playerStats.bowling.leather["5W"] + 1
                        : playerStats.bowling.leather["5W"],
                  }
                : playerStats.bowling.leather,
            "Stats.bowling.tennis":
              matchData.ballType === "tennis"
                ? {
                    matches: playerStats.bowling.tennis.matches + 1,
                    innings: playerStats.bowling.tennis.innings + 1,
                    overs: playerStats.bowling.tennis.overs + bowler.overs,
                    balls: playerStats.bowling.tennis.balls + bowler.balls,
                    runs: playerStats.bowling.tennis.runs + bowler.runsGiven,
                    dots: playerStats.bowling.tennis.dots + bowler.dots,
                    wides: playerStats.bowling.tennis.wides + bowler.wides,
                    noBalls:
                      playerStats.bowling.tennis.noBalls + bowler.noBalls,
                    maidens:
                      playerStats.bowling.tennis.maidens + bowler.maidenOvers,
                    wickets:
                      playerStats.bowling.tennis.wickets + bowler.wicketsTaken,
                    average:
                      playerStats.bowling.tennis.runs + bowler.runsGiven === 0
                        ? 0
                        : (
                            (playerStats.bowling.tennis.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.tennis.wickets +
                              bowler.wicketsTaken)
                          ).toFixed(2),
                    economy:
                      playerStats.bowling.tennis.balls + bowler.balls === 0
                        ? 0
                        : (
                            (playerStats.bowling.tennis.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.tennis.balls + bowler.balls) /
                            6
                          ).toFixed(2),
                    best:
                      playerStats.bowling.tennis.best.wickets ===
                        bowler.wicketsTaken &&
                      playerStats.bowling.tennis.best.runs >= bowler.runsGiven
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : playerStats.bowling.tennis.best.wickets <
                          bowler.wicketsTaken
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : {
                            wickets: playerStats.bowling.tennis.best.wickets,
                            runs: playerStats.bowling.tennis.best.runs,
                          },
                    sr: (playerStats.bowling.tennis.balls + bowler.balls === 0
                      ? 0
                      : (playerStats.bowling.tennis.balls + bowler.balls) /
                        (playerStats.bowling.tennis.wickets +
                          bowler.wicketsTaken)
                    ).toFixed(2),
                    "3W":
                      bowler.wicketsTaken >= 3
                        ? playerStats.bowling.tennis["3W"] + 1
                        : playerStats.bowling.tennis["3W"],
                    "5W":
                      bowler.wicketsTaken >= 5
                        ? playerStats.bowling.tennis["5W"] + 1
                        : playerStats.bowling.tennis["5W"],
                  }
                : playerStats.bowling.tennis,
            "Stats.bowling.other":
              matchData.ballType === "other"
                ? {
                    matches: playerStats.bowling.other.matches + 1,
                    innings: playerStats.bowling.other.innings + 1,
                    overs: playerStats.bowling.other.overs + bowler.overs,
                    balls: playerStats.bowling.other.balls + bowler.balls,
                    runs: playerStats.bowling.other.runs + bowler.runsGiven,
                    dots: playerStats.bowling.other.dots + bowler.dots,
                    wides: playerStats.bowling.other.wides + bowler.wides,
                    noBalls: playerStats.bowling.other.noBalls + bowler.noBalls,
                    maidens:
                      playerStats.bowling.other.maidens + bowler.maidenOvers,
                    wickets:
                      playerStats.bowling.other.wickets + bowler.wicketsTaken,
                    average:
                      playerStats.bowling.other.runs + bowler.runsGiven === 0
                        ? 0
                        : (
                            (playerStats.bowling.other.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.other.wickets +
                              bowler.wicketsTaken)
                          ).toFixed(2),
                    economy:
                      playerStats.bowling.other.balls + bowler.balls === 0
                        ? 0
                        : (
                            (playerStats.bowling.other.runs +
                              bowler.runsGiven) /
                            (playerStats.bowling.other.balls + bowler.balls) /
                            6
                          ).toFixed(2),
                    best:
                      playerStats.bowling.other.best.wickets ===
                        bowler.wicketsTaken &&
                      playerStats.bowling.other.best.runs >= bowler.runsGiven
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : playerStats.bowling.other.best.wickets <
                          bowler.wicketsTaken
                        ? {
                            wickets: bowler.wicketsTaken,
                            runs: bowler.runsGiven,
                          }
                        : {
                            wickets: playerStats.bowling.other.best.wickets,
                            runs: playerStats.bowling.other.best.runs,
                          },
                    sr: (playerStats.bowling.other.balls + bowler.balls === 0
                      ? 0
                      : (playerStats.bowling.other.balls + bowler.balls) /
                        (playerStats.bowling.other.wickets +
                          bowler.wicketsTaken)
                    ).toFixed(2),
                    "3W":
                      bowler.wicketsTaken >= 3
                        ? playerStats.bowling.other["3W"] + 1
                        : playerStats.bowling.other["3W"],
                    "5W":
                      bowler.wicketsTaken >= 5
                        ? playerStats.bowling.other["5W"] + 1
                        : playerStats.bowling.other["5W"],
                  }
                : playerStats.bowling.other,
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

  useEffect(() => {
    if (tournamentId !== "") {
      const tournamentRef = doc(db, "Tournaments", tournamentId);
      onSnapshot(tournamentRef, (doc) => {
        const data = doc.data();
        settournamentData(data);
      });
    }
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
      scrollEnabled={swiperScrollEnabled}
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
          <ScrollView
            horizontal
            nestedScrollEnabled
            onScrollBeginDrag={() => setSwiperScrollEnabled(false)}
            onScrollEndDrag={() => setSwiperScrollEnabled(true)}
          >
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
            <TouchableOpacity onPress={handlePredict}>
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                Predict match
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
              justifyContent: "center",
              height: 50,
              width: "100%",
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
          {show && (
            <View
              style={{
                borderTopWidth: 0.5,
                borderColor: "grey",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                height: 50,
              }}
            >
              <Text style={{ color: "green", fontWeight: "bold" }}>
                {`${matchData.battingTeam} : ${matchData.prediction.teamA}`}
              </Text>
              <Text style={{ color: "green", fontWeight: "bold" }}>
                {`${matchData.bowlingTeam} : ${matchData.prediction.teamB}`}
              </Text>
            </View>
          )}

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
              source={
                matchData.teams.team1.image !== ""
                  ? { uri: matchData.teams.team1.image }
                  : require("../assets/team1.jpg")
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontWeight: "bold" }}>
              {matchData.teams.team1.name}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={
                matchData.teams.team2.image !== ""
                  ? { uri: matchData.teams.team2.image }
                  : require("../assets/team2.jpg")
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontWeight: "bold" }}>
              {matchData.teams.team2.name}
            </Text>
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
