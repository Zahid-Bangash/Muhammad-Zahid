import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  BackHandler,
  Animated,
} from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import DateTimePicker from "@react-native-community/datetimepicker";
import Entypo from "@expo/vector-icons/Entypo";
import { useIsFocused } from "@react-navigation/native";

import { Context } from "../components/ContextProvider";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";

import { addDoc, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import MyTeamsNavigator from "../navigation/MyTeamsNavigator";
import ScoringModal from "../components/ScoringModal";

export default function StartMatch({ route, navigation }) {
  const { tournament = null } = route.params ? route.params : {};
  const { teams } = useContext(Context);
  const isFocused = useIsFocused();
  const tossAnimation = useRef(new Animated.Value(0)).current;

  const allTeams = tournament === null ? teams : tournament.teams;

  const [matchDetails, setmatchDetails] = useState({
    venue: "",
    date: new Date(),
    time: new Date(),
    overs: 0,
    ballType: tournament !== null ? tournament.ballType : "",
    matchFormat: tournament !== null ? tournament.matchType : "",
  });
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [team1Squad, setteam1Squad] = useState({ type: "", players: [] });
  const [team2Squad, setteam2Squad] = useState({ type: "", players: [] });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchModal, setsearchModal] = useState(false);
  const [tossModalVisible, setTossModalVisible] = useState(false);
  const [squadModal, setsquadModal] = useState(false);
  const [coinModal, setcoinModal] = useState(false);

  const [teamBoBeSelected, setteamBoBeSelected] = useState("A");
  const [selectedTeam, setselectedTeam] = useState(null);

  const [tossWinner, setTossWinner] = useState(null);
  const [decision, setDecision] = useState(null);
  const [battingTeam, setbattingTeam] = useState(null);
  const [bowlingTeam, setbowlingTeam] = useState(null);

  const [name, setname] = useState("");
  const [search, setsearch] = useState([]);
  const [searchStatus, setsearchStatus] = useState("");

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
    teamBoBeSelected === "A"
      ? (setTeam1(team), setteam1Squad({ type: "", players: [] }))
      : (setTeam2(team), setteam2Squad({ type: "", players: [] }));
    setselectedTeam(team);
    setsquadModal(true);
    setModalVisible(false);
  };

  const squad = selectedTeam === team1 ? team1Squad : team2Squad;

  const handleSquadUpdate = (player) => {
    if (team1 && selectedTeam.id === team1.id) {
      if (team1Squad.players.includes(player)) {
        setteam1Squad({
          ...team1Squad,
          players: team1Squad.players.filter((p) => p !== player),
        });
      } else {
        setteam1Squad({
          ...team1Squad,
          players: [...team1Squad.players, player],
        });
      }
    } else if (selectedTeam.id === team2.id) {
      if (team2Squad.players.includes(player)) {
        setteam2Squad({
          ...team2Squad,
          players: team2Squad.players.filter((p) => p !== player),
        });
      } else {
        setteam2Squad({
          ...team2Squad,
          players: [...team2Squad.players, player],
        });
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || date;
    setmatchDetails({ ...matchDetails, date: currentDate });
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || date;
    setmatchDetails({ ...matchDetails, time: currentTime });
  };

  const searchByName = async () => {
    const searchRef = collection(db, "Teams");
    const snapshot = await getDocs(searchRef);
    const searchResults = snapshot.docs.filter((doc) =>
      doc.data()["name"].toLowerCase().includes(name.toLowerCase())
    );
    const searchData = searchResults.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const result = searchData.filter(
      (teamSearch) => !teams.some((team) => team.id === teamSearch.id)
    );
    if (result.length > 0) {
      setsearch(result);
      setsearchStatus("");
    } else {
      setsearchStatus("No Team Found");
    }
  };

  const handleCreateMatch = () => {
    if (team1 === null || team2 === null) {
      alert("Select team to create a match");
      return;
    }
    if (team1Squad.length < 2 || team2Squad.length < 2) {
      alert("Add Minimum two players in the squad");
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
    if (matchDetails.ballType === "") {
      alert("Select Ball Type");
      return;
    }
    if (matchDetails.matchFormat === "") {
      alert("Select Match Format");
      return;
    }
    setTossModalVisible(true);
  };

  const startMatch = async () => {
    if (!tossWinner) {
      alert("Select who won the toss");
      return;
    }
    if (!decision) {
      alert("Selected to bowl or bat first?");
      return;
    }
    try {
      const matchRef = await addDoc(
        collection(db, "users", auth.currentUser.uid, "Matches"),
        {
          title: `${team1.name} Vs ${team2.name}`,
          teams: {
            team1: { name: team1.name, squad: team1Squad },
            team2: { name: team2.name, squad: team2Squad },
          },
          venue: matchDetails.venue,
          date: matchDetails.date.toLocaleDateString(),
          time: matchDetails.time.toLocaleTimeString(),
          ballType: matchDetails.ballType,
          matchFormat: matchDetails.matchFormat,
          tossResult: {
            winnerTeam: tossWinner.name,
            decision: decision,
          },
          totalOvers: matchDetails.overs,
          target: 0,
          status: "Live",
          result: "",
          battingTeam: battingTeam,
          bowlingTeam: bowlingTeam,
          type: tournament ? "Tournament" : "Individual",
          prediction: { teamA: 0, teamB: 0 },
        }
      );
      const publicMatchRef = doc(db, "Matches", matchRef.id);
      await setDoc(publicMatchRef, {
        title: `${team1.name} Vs ${team2.name}`,
        teams: {
          team1: { name: team1.name, squad: team1Squad },
          team2: { name: team2.name, squad: team2Squad },
        },
        venue: matchDetails.venue,
        date: matchDetails.date.toLocaleDateString(),
        time: matchDetails.time.toLocaleTimeString(),
        ballType: matchDetails.ballType,
        matchFormat: matchDetails.matchFormat,
        tossResult: {
          winnerTeam: tossWinner.name,
          decision: decision,
        },
        totalOvers: matchDetails.overs,
        target: 0,
        status: "Live",
        result: "",
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        type: tournament ? "Tournament" : "Individual",
        prediction: { teamA: 0, teamB: 0 },
      });

      if (tournament) {
        const tournamentMatchRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "Tournaments",
          tournament.id,
          "Matches",
          matchRef.id
        );
        const PublicTournamentMatchRef = doc(
          db,
          "Tournaments",
          tournament.id,
          "Matches",
          matchRef.id
        );
        await setDoc(tournamentMatchRef, {
          title: `${team1.name} Vs ${team2.name}`,
          teams: {
            team1: { name: team1.name, squad: team1Squad },
            team2: { name: team2.name, squad: team2Squad },
          },
          venue: matchDetails.venue,
          date: matchDetails.date.toLocaleDateString(),
          time: matchDetails.time.toLocaleTimeString(),
          ballType: matchDetails.ballType,
          matchFormat: matchDetails.matchFormat,
          tossResult: {
            winnerTeam: tossWinner.name,
            decision: decision,
          },
          totalOvers: matchDetails.overs,
          target: 0,
          status: "Live",
          result: "",
          battingTeam: battingTeam,
          bowlingTeam: bowlingTeam,
        });
        await setDoc(PublicTournamentMatchRef, {
          title: `${team1.name} Vs ${team2.name}`,
          teams: {
            team1: { name: team1.name, squad: team1Squad },
            team2: { name: team2.name, squad: team2Squad },
          },
          venue: matchDetails.venue,
          date: matchDetails.date.toLocaleDateString(),
          time: matchDetails.time.toLocaleTimeString(),
          ballType: matchDetails.ballType,
          matchFormat: matchDetails.matchFormat,
          tossResult: {
            winnerTeam: tossWinner.name,
            decision: decision,
          },
          totalOvers: matchDetails.overs,
          target: 0,
          status: "Live",
          result: "",
          battingTeam: battingTeam,
          bowlingTeam: bowlingTeam,
        });
      }

      console.log("Match created with ID: ", matchRef.id);
      navigation.navigate("Start Innings", {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        squad1: team1Squad,
        squad2: team2Squad,
        matchId: matchRef.id,
        tournamentId: tournament ? tournament.id : "",
      });
      setTossModalVisible(false);
      setTossWinner(null);
      setbattingTeam(null);
      setbowlingTeam(null);
      setDecision(null);
    } catch (err) {
      console.error("Error starting match: ", err);
    }
  };

  const startTossAnimation = () => {
    Animated.sequence([
      Animated.timing(tossAnimation, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(tossAnimation, {
        toValue: 0,
        duration: 1400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    tossAnimation.addListener(({ value }) => {
      if (value === 1) {
        // Animation completed, handle the event here
        // You can perform any action or reset the animation state
        tossAnimation.setValue(0);
      }
    });

    return () => {
      tossAnimation.removeAllListeners();
    };
  }, [tossAnimation]);

  const tossStyle = {
    transform: [
      {
        translateY: tossAnimation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -300, 0],
        }),
      },
      {
        rotateX: tossAnimation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["0deg", "1080deg", "0deg"],
        }),
      },
    ],
  };

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else {
      setsearch([]);
      setsearchStatus("");
    }
  }, [name]);

  useEffect(() => {
    const backAction = () => {
      setTossWinner(null);
      setbattingTeam(null);
      setbowlingTeam(null);
      setDecision(null);
      setTeam1(null);
      setTeam2(null);
      setteam1Squad({ type: "", players: [] });
      setteam2Squad({ type: "", players: [] });
      setmatchDetails({
        venue: "",
        date: new Date(),
        time: new Date(),
        overs: 0,
        ballType: tournament !== null ? tournament.ballType : "",
        matchFormat: tournament !== null ? tournament.matchType : "",
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          height: Dimensions.get("screen").height * 0.17,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
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
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="plus" size={40} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ fontWeight: "bold" }}>
            {team1 ? team1.name : "Team A"}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            // alignItems: "center",
            // height: "100%",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>VS</Text>
        </View>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
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
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="plus" size={40} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={{ fontWeight: "bold" }}>
            {team2 ? team2.name : "Team B"}
          </Text>
        </View>
      </View>
      {/* Team Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#e0dede",
            width: "100%",
            height: "100%",
            alignItems: "center",
            paddingVertical: 50,
          }}
        >
          {tournament === null && (
            <>
              <AppButton
                style={{
                  backgroundColor: "#c96407",
                  borderRadius: 0,
                  marginTop: 20,
                }}
                onPress={() => setsearchModal(true)}
              >
                Search Team
              </AppButton>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                OR
              </Text>
            </>
          )}
          <Text
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Select from your teams
          </Text>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {allTeams.length > 0 ? (
              allTeams.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => {
                    if (team.players.length < 2) {
                      alert("Team must have two players");
                      return;
                    }
                    handleSelectTeam(team);
                  }}
                  style={{
                    backgroundColor: "#676869",
                    width: "90%",
                    height: 50,
                    marginBottom: 5,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                  >
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                You haven't any team
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setModalVisible(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="brown" />
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Search Modal */}
      <Modal
        visible={searchModal}
        animationType="slide"
        onRequestClose={() => setsearchModal(false)}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#e0dede",
            width: "100%",
            height: "100%",
            alignItems: "center",
            paddingVertical: 50,
          }}
        >
          <AppTextInput
            placeholder="Seach Team by Name"
            style={{ marginBottom: 20 }}
            value={name}
            onChangeText={(val) => setname(val)}
          />
          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Select Team from your search
          </Text>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {search.length > 0 ? (
              search.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => {
                    if (team.players.length < 2) {
                      alert("Team must have two players");
                      return;
                    }
                    handleSelectTeam(team);
                  }}
                  style={{
                    backgroundColor: "#676869",
                    width: "90%",
                    height: 50,
                    marginBottom: 5,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                  >
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                {searchStatus}
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => {
              setsearchModal(false);
              setname("");
              setsearch([]);
            }}
          >
            <Entypo name="circle-with-cross" size={45} color="brown" />
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Squad Modal */}
      <Modal
        visible={squadModal}
        animationType="slide"
        onRequestClose={() => setsquadModal(false)}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#e0dede",
            width: "100%",
            height: "100%",
            alignItems: "center",
            paddingTop: 50,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Select {selectedTeam && selectedTeam.name} Squad
          </Text>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {selectedTeam &&
              selectedTeam.players.map((player) => (
                <View
                  key={player.id}
                  style={{
                    backgroundColor: "#676869",
                    marginBottom: 5,
                    alignItems: "center",
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    width: "90%",
                    height: 50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      marginBottom: 10,
                      flex: 1,
                      color: "white",
                    }}
                  >
                    {player.name}
                  </Text>
                  {squad.players.includes(player) ? (
                    <TouchableOpacity onPress={() => handleSquadUpdate(player)}>
                      <Entypo name="minus" size={35} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleSquadUpdate(player)}>
                      <Entypo name="plus" size={35} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setsquadModal(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="brown" />
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
        style={{ marginTop: 20 }}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          width: "80%",
        }}
      >
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
          <View style={{ width: "55%" }}>
            <AppTextInput
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
          setmatchDetails({ ...matchDetails, overs: parseInt(text) })
        }
        style={{ marginTop: 10 }}
      />
      {tournament === null && (
        <>
          <Text style={{ fontWeight: "bold", margin: 10 }}>Ball Type</Text>
          <RadioButtonGroup
            selected={matchDetails.ballType}
            onSelected={(val) =>
              setmatchDetails({ ...matchDetails, ballType: val })
            }
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
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            Match Format
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() =>
                setmatchDetails({ ...matchDetails, matchFormat: "T10" })
              }
            >
              <View
                style={{
                  backgroundColor:
                    matchDetails.matchFormat === "T10" ? "green" : "#e0dede",
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
              onPress={() =>
                setmatchDetails({ ...matchDetails, matchFormat: "T20" })
              }
            >
              <View
                style={{
                  backgroundColor:
                    matchDetails.matchFormat === "T20" ? "green" : "#e0dede",
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
              onPress={() =>
                setmatchDetails({ ...matchDetails, matchFormat: "ODI" })
              }
            >
              <View
                style={{
                  backgroundColor:
                    matchDetails.matchFormat === "ODI" ? "green" : "#e0dede",
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
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() =>
                setmatchDetails({ ...matchDetails, matchFormat: "100" })
              }
            >
              <View
                style={{
                  backgroundColor:
                    matchDetails.matchFormat === "100" ? "green" : "#e0dede",
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
              onPress={() =>
                setmatchDetails({ ...matchDetails, matchFormat: "Test" })
              }
            >
              <View
                style={{
                  backgroundColor:
                    matchDetails.matchFormat === "Test" ? "green" : "#e0dede",
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
              onPress={() =>
                setmatchDetails({ ...matchDetails, matchFormat: "Club" })
              }
            >
              <View
                style={{
                  backgroundColor:
                    matchDetails.matchFormat === "Club" ? "green" : "#e0dede",
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
        </>
      )}
      {/* Toss Modal */}
      <Modal visible={tossModalVisible} transparent animationType="fade">
        <View
          style={{
            position: "absolute",
            backgroundColor: "#6ba575",
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
            <Entypo name="circle-with-cross" size={45} color="brown" />
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
                <Image
                  source={require("../assets/team1.jpg")}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
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
                <Image
                  source={require("../assets/team5.jpg")}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <Text>{team2 && team2.name}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: "20%",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
              Selected to ?
            </Text>
            <TouchableWithoutFeedback onPress={() => setcoinModal(true)}>
              <Image
                source={require("../assets/head.png")}
                style={{ width: 60, height: 60 }}
              />
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                if (!tossWinner) {
                  alert("Select who won the toss first");
                  return;
                }
                setDecision("Bat");
                tossWinner === team1
                  ? (setbattingTeam(team1.name),
                    setbowlingTeam(team2.name),
                    setteam1Squad({ ...team1Squad, type: "batting" }),
                    setteam2Squad({ ...team2Squad, type: "bowling" }))
                  : (setbattingTeam(team2.name),
                    setbowlingTeam(team1.name),
                    setteam2Squad({ ...team2Squad, type: "batting" }),
                    setteam1Squad({ ...team1Squad, type: "bowling" }));
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: decision !== "Bat" ? "white" : "black",
                  backgroundColor:
                    decision === "Bat"
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
            <TouchableWithoutFeedback
              onPress={() => {
                if (!tossWinner) {
                  alert("Select who won the toss first");
                  return;
                }
                setDecision("Bowl");
                tossWinner === team1
                  ? (setbattingTeam(team2.name),
                    setbowlingTeam(team1.name),
                    setteam1Squad({ ...team1Squad, type: "bowling" }),
                    setteam2Squad({ ...team2Squad, type: "batting" }))
                  : (setbattingTeam(team1.name),
                    setbowlingTeam(team2.name),
                    setteam2Squad({ ...team2Squad, type: "bowling" }),
                    setteam1Squad({ ...team1Squad, type: "batting" }));
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: decision !== "Bowl" ? "white" : "black",
                  backgroundColor:
                    decision === "Bowl"
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
            style={{ backgroundColor: "#1b8d9d", width: "60%" }}
            onPress={startMatch}
          >
            Start Match
          </AppButton>
        </View>
      </Modal>
      {/* coin Modal  */}
      <Modal
        visible={coinModal}
        animationType="fade"
        onRequestClose={() => setcoinModal(false)}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            Tap the coin to flip
          </Text>
          <Animated.Image
            source={require("../assets/head.png")}
            style={[
              { width: 100, height: 100, backgroundColor: "red" },
              tossStyle,
            ]}
          />

          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: "blue",
              borderRadius: 5,
            }}
            onPress={startTossAnimation}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Toss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <AppButton
        style={{ marginTop: 40, width: "82%" }}
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
    justifyContent: "center",
    backgroundColor: "#e0dede",
    padding: 20,
  },
});
