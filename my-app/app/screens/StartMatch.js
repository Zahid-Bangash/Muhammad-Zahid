import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import DateTimePicker from "@react-native-community/datetimepicker";
import Entypo from "@expo/vector-icons/Entypo";

import { Context } from "../components/ContextProvider";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";

import { addDoc, collection, getDocs, setDoc,doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import MyTeamsNavigator from "../navigation/MyTeamsNavigator";
import ScoringModal from "../components/ScoringModal";

export default function StartMatch({ route, navigation }) {
  const { teams } = useContext(Context);
  const [matchDetails, setmatchDetails] = useState({
    venue: "",
    date: new Date(),
    time: new Date(),
    overs: 0,
    ballType: "",
    matchFormat: "",
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

  const [teamBoBeSelected, setteamBoBeSelected] = useState("A");
  const [selectedTeam, setselectedTeam] = useState(null);

  const [tossWinner, setTossWinner] = useState(null);
  const [decision, setDecision] = useState(null);
  const [battingTeam, setbattingTeam] = useState(null);
  const [bowlingTeam, setbowlingTeam] = useState(null);

  const [name, setname] = useState("");
  const [search, setsearch] = useState([]);

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
    setselectedTeam(team);
    setsquadModal(true);
    setModalVisible(false);
  };

  const squad = selectedTeam === team1 ? team1Squad : team2Squad;

  const handleSquadUpdate = (player) => {
    if (selectedTeam.id === team1.id) {
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
    const result = searchResults.map((doc) => ({ id: doc.id, ...doc.data() }));
    setsearch(result);
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
          status: "InProgress",
          result: "",
          battingTeam: battingTeam,
          bowlingTeam: bowlingTeam,
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
        status: "InProgress",
        result: "",
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
      });
      console.log("Match created with ID: ", matchRef.id);
      navigation.navigate("Start Innings", {
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        squad1: team1Squad,
        squad2: team2Squad,
        matchId: matchRef.id,
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

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else setsearch([]);
  }, [name]);

  return (
    <View style={styles.container}>
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
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#07FFF0",
            transform: [{ translateX: 28 }, { translateY: 80 }],
            width: "85%",
            height: "85%",
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 50,
          }}
        >
          <TouchableOpacity onPress={() => setsearchModal(true)}>
            <Text
              style={{
                fontSize: 24,
                color: "#3e5430",
                fontWeight: "bold",
              }}
            >
              Search Team
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            OR
          </Text>
          <Text
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: "#ba6d13",
              fontWeight: "bold",
            }}
          >
            Select from your teams
          </Text>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {teams.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => handleSelectTeam(team)}
                style={{
                  backgroundColor: "pink",
                  width: "90%",
                  height: 50,
                  marginBottom: 5,
                  paddingHorizontal: 10,
                  justifyContent: "center",
                }}
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
      {/* Search Modal */}
      <Modal
        visible={searchModal}
        animationType="slide"
        transparent
        onRequestClose={() => setsearchModal(false)}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#07FFF0",
            transform: [{ translateX: 28 }, { translateY: 80 }],
            width: "85%",
            height: "85%",
            alignItems: "center",
            borderRadius: 20,
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
              color: "#ba6d13",
              fontWeight: "bold",
            }}
          >
            Select Team from your search
          </Text>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {search.length > 0 &&
              search.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  onPress={() => handleSelectTeam(team)}
                  style={{
                    backgroundColor: "pink",
                    width: "90%",
                    height: 50,
                    marginBottom: 5,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setsearchModal(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="red" />
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Squad Modal */}
      <Modal
        visible={squadModal}
        animationType="fade"
        transparent
        onRequestClose={() => setsquadModal(false)}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "#c0c589",
            transform: [{ translateX: 28 }, { translateY: 80 }],
            width: "85%",
            height: "85%",
            alignItems: "center",
            borderRadius: 20,
            paddingTop: 50,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginBottom: 20,
              color: "#88309a",
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
                    backgroundColor: "#b8dde0",
                    marginBottom: 5,
                    alignItems: "center",
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    width: "90%",
                    height: 50,
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10, flex: 1 }}>
                    {player.name}
                  </Text>
                  {squad.players.includes(player) ? (
                    <TouchableOpacity onPress={() => handleSquadUpdate(player)}>
                      <Entypo name="minus" size={35} color="red" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleSquadUpdate(player)}>
                      <Entypo name="plus" size={35} color="green" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
          </ScrollView>
          <TouchableOpacity
            style={{ position: "absolute", top: 5, right: 5 }}
            onPress={() => setsquadModal(false)}
          >
            <Entypo name="circle-with-cross" size={45} color="red" />
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
              placeholder="Date"
              autoComplete="off"
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
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Ball Type</Text>
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
          style={{ margin: 10 }}
        />
        <RadioButtonItem label="TENNIS" value="tennis" style={{ margin: 10 }} />
        <RadioButtonItem label="OTHER" value="other" style={{ margin: 10 }} />
      </RadioButtonGroup>
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Match Format</Text>
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
      {/* Toss Modal */}
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
            style={{ backgroundColor: "green", width: "60%" }}
            onPress={startMatch}
          >
            Start Match
          </AppButton>
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
    backgroundColor: "#e0dede",
    padding: 20,
  },
});
