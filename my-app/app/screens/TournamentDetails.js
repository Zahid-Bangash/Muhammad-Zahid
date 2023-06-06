import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import Entypo from "@expo/vector-icons/Entypo";
import { AntDesign } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import * as ImagePicker from "expo-image-picker";
import { Context } from "../components/ContextProvider";

import {
  addDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../config/firebase-config";
import { ref, getDownloadURL, uploadBytes } from "@firebase/storage";

import AppButton from "../components/AppButton";
import TeamCard from "../components/cards/TeamCard";
import MyMatchCard from "../components/MyMatchCard";
import AppTextInput from "../components/AppTextInput";

export default function TournamnetDetails({ navigation, route }) {
  const {
    teams,
    myTournaments,
    setmyTournaments,
    showModalTournament,
    setshowModalTournament,
  } = useContext(Context);
  const { id } = route.params;
  const tournamentIndex = myTournaments.findIndex(
    (tournament) => tournament.id === id
  );
  const currentTournament = { ...myTournaments[tournamentIndex] };
  const myTeams = teams.filter(
    (myteam) => !currentTournament.teams.some((team) => team.id === myteam.id)
  );
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [showAddTeamModal, setshowAddTeamModal] = useState(false);
  const [showSearchModal, setshowSearchModal] = useState(false);
  const [name, setname] = useState("");
  const [search, setsearch] = useState([]);
  const [searchStatus, setsearchStatus] = useState("");

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
    const resultFinal = result.filter(
      (teamSearch) =>
        !currentTournament.teams.some((team) => team.id === teamSearch.id)
    );

    if (resultFinal.length > 0) {
      setsearch(resultFinal);
      setsearchStatus("");
    } else {
      setsearchStatus("No Team to be added");
    }
  };

  const addTeamToTournament = async (team) => {
    try {
      if (team.players.length < 2) {
        alert("Team should have at leat two players");
        return;
      }
      currentTournament.teams.push(team);
      setmyTournaments((prevTournaments) => {
        return prevTournaments.map((tournament) => {
          if (tournament.id === id) {
            return { ...tournament, teams: currentTournament.teams };
          }
          return tournament;
        });
      });
      const teamRefPublic = doc(db, "Tournaments", id);
      const docRefPublic = await updateDoc(
        teamRefPublic,
        { teams: currentTournament.teams },
        { merge: true }
      );
      const teamRef = doc(db, "users", auth.currentUser.uid, "Tournaments", id);
      await updateDoc(
        teamRef,
        { teams: currentTournament.teams },
        { merge: true }
      );
      console.log("Team added to tournamnet");
    } catch (error) {
      console.error("Error adding team: ", error);
    }
  };

  const updateBanner = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const imageId = result.uri.substring(result.uri.lastIndexOf("/") + 1);
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `TournamentBanners/${imageId}`);
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);

        setmyTournaments((prevTournaments) => {
          return prevTournaments.map((tournament) => {
            if (tournament.id === id) {
              return { ...tournament, image: url };
            }
            return tournament;
          });
        });
        const tournamentRefPublic = doc(db, "Tournaments", id);
        const docRefPublic = await updateDoc(
          tournamentRefPublic,
          { image: url },
          { merge: true }
        );
        const tournamentRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "Tournaments",
          id
        );
        await updateDoc(tournamentRef, { image: url }, { merge: true });
        console.log("Banner updated");
      }
    } catch (error) {
      console.error("Error updating banner: ", error);
    }
  };

  const deleteTeam = (teamId) => {
    Alert.alert("Confirm", "Are you sure you want to remove the team?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const updatedTeams = currentTournament.teams.filter(
              (team) => team.id !== teamId
            );
            setmyTournaments((prevTournaments) => {
              return prevTournaments.map((tournament) => {
                if (tournament.id === id) {
                  return { ...tournament, teams: updatedTeams };
                }
                return tournament;
              });
            });
            const teamRefPublic = doc(db, "Tournaments", id);
            const docRefPublic = await updateDoc(
              teamRefPublic,
              { teams: updatedTeams },
              { merge: true }
            );
            const teamRef = doc(
              db,
              "users",
              auth.currentUser.uid,
              "Tournaments",
              id
            );
            await updateDoc(teamRef, { teams: updatedTeams }, { merge: true });
            console.log("Tournament Removed");
          } catch (error) {
            console.error("Error adding team: ", error);
          }
        },
      },
    ]);
  };

  const deleteTournament = () => {
    Alert.alert("Confirm", "Are you sure you want to delete the tournament?", [
      {
        text: "No",
        onPress: () => {
          setshowModalTournament(false);
        },
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "Tournaments", id));
            await deleteDoc(
              doc(db, "users", auth.currentUser.uid, "Tournaments", id)
            );
            navigation.goBack();
            setmyTournaments(
              myTournaments.filter((tournament) => tournament.id !== id)
            );
            setshowModalTournament(false);
          } catch (error) {
            console.error("Error deleting tournament: ", error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (search.length > 0) {
      if (search.length === 1) setsearchStatus("No Team to be added");
      setsearch(
        search.filter(
          (teamSearch) =>
            !currentTournament.teams.some((team) => team.id === teamSearch.id)
        )
      );
    }
  }, [currentTournament.teams]);

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else {
      setsearch([]);
      setsearchStatus("");
    }
  }, [name]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("blur", () => {
  //     console.log("went back tournament");
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "Create Tournament" }],
  //     });
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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
          Home
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
          Teams
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
          Matches
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSwiperIndex(3)}
        style={[styles.button, swiperIndex === 3 && styles.activeButton]}
      >
        <Text
          style={[
            styles.buttonText,
            swiperIndex === 3 && { fontWeight: "bold" },
          ]}
        >
          Statistics
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
      <View style={[styles.slide, { backgroundColor: "white", padding: 10 }]}>
        <Modal
          backdropColor="transparent"
          isVisible={showModalTournament}
          animationType="slide"
          animationIn={"slideInRight"}
          animationOut={"slideOutRight"}
          onRequestClose={() => setshowModalTournament(false)}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: 0,
            width: Dimensions.get("screen").width * 0.6,
            height: Dimensions.get("screen").height * 0.068,
            backgroundColor: "#d4d8d8",
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={deleteTournament}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 15,
                }}
              >
                <AntDesign name="delete" size={25} color="black" />
                <Text
                  style={{ fontWeight: "bold", fontSize: 17, marginLeft: 20 }}
                >
                  Delete Tournament
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        {currentTournament.image ? (
          <TouchableWithoutFeedback onPress={updateBanner}>
            <Image
              source={{ uri: currentTournament.image }}
              style={{
                width: "100%",
                height: Dimensions.get("screen").height * 0.22,
              }}
            />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback onPress={updateBanner}>
            <Image
              source={require("../assets/team4.jpg")}
              style={{
                width: "100%",
                height: Dimensions.get("screen").height * 0.22,
              }}
            />
          </TouchableWithoutFeedback>
        )}
        <View
          style={{
            alignSelf: "flex-start",
            height: "10%",
            justifyContent: "space-around",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {currentTournament.name}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "grey" }}>
            {`Organized by : ${currentTournament.organizer.name}`}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "grey" }}>
            {`Dates: ${currentTournament.startDate} - ${currentTournament.endDate}`}
          </Text>
        </View>
        <AppButton
          style={{
            borderRadius: 0,
            width: "100%",
            height: "8%",
            marginVertical: "3%",
          }}
          onPress={() => {
            if (currentTournament.teams.length < 2) {
              alert("Tournament must have minimum two teams to start a match");
              return;
            }
            navigation.navigate("Start a Match", {
              screen: "Create Match",
              params: { tournament: currentTournament },
            });
          }}
        >
          Start Match
        </AppButton>
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "flex-start",
            fontSize: 17,
          }}
        >
          Top Players
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            margin: "5%",
            height: "17%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Most Runs</Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 70, marginVertical: -7 }}
            >
              {currentTournament.mostRuns.runs}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {currentTournament.mostRuns.playerName}
              </Text>
              <Text style={{ color: "grey", fontSize: 12 }}>
                {currentTournament.mostRuns.teamName}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>
              Most Wickets
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 70, marginVertical: -7 }}
            >
              {currentTournament.mostWickets.wickets}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {currentTournament.mostWickets.playerName}
              </Text>
              <Text style={{ color: "grey", fontSize: 12 }}>
                {currentTournament.mostWickets.teamName}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "grey",
            width: "100%",
            margin: "2%",
          }}
        ></View>
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "flex-start",
            fontSize: 17,
          }}
        >
          Tournament Boundaries
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            margin: "3%",
            height: "17%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Sixes</Text>
            <Text style={{ fontWeight: "bold", fontSize: 70 }}>
              {currentTournament.sixes}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "grey" }}>Fours</Text>
            <Text style={{ fontWeight: "bold", fontSize: 70 }}>
              {currentTournament.fours}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.slide, { paddingBottom: "12.5%" }]}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          {currentTournament.teams.length > 0 ? (
            currentTournament.teams.map((team) => (
              <TeamCard
                key={team.id}
                name={team.name}
                place={team.place}
                captain="Usama"
                onDelete={() => deleteTeam(team.id)}
              />
            ))
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              No Team Added
            </Text>
          )}
        </ScrollView>
        <AppButton
          style={{
            position: "absolute",
            bottom: 0,
            width: "99%",
            borderRadius: 0,
            height: "8%",
            marginVertical: 0,
          }}
          onPress={() => setshowAddTeamModal(true)}
        >
          Add Team
        </AppButton>
        {/* Team Modal  */}
        <Modal
          visible={showAddTeamModal}
          animationType="slide"
          onRequestClose={() => setshowAddTeamModal(false)}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: "#07FFF0",
              width: "100%",
              height: "100%",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <TouchableOpacity onPress={() => setshowSearchModal(true)}>
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
              {myTeams.length > 0 ? (
                myTeams.map((team) => (
                  <TouchableOpacity
                    key={team.id}
                    onPress={() => addTeamToTournament(team)}
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
                ))
              ) : (
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                  No team to be added
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={{ position: "absolute", top: 5, right: 5 }}
              onPress={() => setshowAddTeamModal(false)}
            >
              <Entypo name="circle-with-cross" size={45} color="red" />
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Search Modal  */}
        <Modal
          visible={showSearchModal}
          animationType="slide"
          onRequestClose={() => setsearchModal(false)}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: "#07FFF0",
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
              {search.length > 0 ? (
                search.map((team) => (
                  <TouchableOpacity
                    key={team.id}
                    onPress={() => addTeamToTournament(team)}
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
                setshowSearchModal(false);
                setname("");
                setsearch([]);
              }}
            >
              <Entypo name="circle-with-cross" size={45} color="red" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <View style={[styles.slide, { paddingBottom: "12.5%" }]}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          {currentTournament.matches.length > 0 ? (
            currentTournament.matches.map((match) => (
              <MyMatchCard
                key={match.id}
                style={{
                  width: Dimensions.get("screen").width * 0.9,
                }}
                team1={match.battingTeam}
                team2={match.bowlingTeam}
                status={match.status}
                result={match.result}
                matchFormat={match.matchFormat}
                date={match.date}
                type={match.type}
                firstInningsBalls={
                  match.innings1 !== undefined
                    ? match.innings1.ballsDelivered
                    : 0
                }
                secondInningsBalls={
                  match.innings2 !== undefined
                    ? match.innings2.ballsDelivered
                    : 0
                }
                firstInningsRuns={
                  match.innings1 !== undefined ? match.innings1.totalRuns : 0
                }
                secondInningsRuns={
                  match.innings2 !== undefined ? match.innings2.totalRuns : 0
                }
                firstInningsWickets={
                  match.innings1 !== undefined ? match.innings1.wicketsDown : 0
                }
                secondInningsWickets={
                  match.innings2 !== undefined ? match.innings2.wicketsDown : 0
                }
                onPress={() =>
                  navigation.navigate("Match Details", { matchId: match.id })
                }
              />
            ))
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              No Match Played
            </Text>
          )}
        </ScrollView>
        <AppButton
          style={{
            position: "absolute",
            bottom: 0,
            width: "99%",
            borderRadius: 0,
            height: "8%",
            marginVertical: 0,
          }}
          onPress={() => {
            if (currentTournament.teams.length < 2) {
              alert("Tournament must have two teams to start a match");
              return;
            }
            navigation.navigate("Start a Match", {
              screen: "Create Match",
              params: { tournament: currentTournament },
            });
          }}
        >
          Start Match
        </AppButton>
      </View>
      <View style={[styles.slide]}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: "3%",
            padding: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 15,
            }}
          >
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("screen").height * 0.28,
                width: "48%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 25,
              }}
            >
              <Image
                source={require("../assets/shahid.jpg")}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: -10,
                  marginTop: 5,
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                  {currentTournament.mostRuns.runs}
                </Text>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Most Runs
                </Text>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    textTransform: "capitalize",
                  }}
                >
                  {currentTournament.mostRuns.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {currentTournament.mostRuns.teamName}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("screen").height * 0.28,
                width: "48%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 25,
              }}
            >
              <Image
                source={require("../assets/player1.jpg")}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: -10,
                  marginTop: 5,
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                  {currentTournament.mostWickets.wickets}
                </Text>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Most Wickets
                </Text>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    textTransform: "capitalize",
                  }}
                >
                  {currentTournament.mostWickets.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {currentTournament.mostWickets.teamName}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 15,
            }}
          >
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("screen").height * 0.28,
                width: "48%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 25,
              }}
            >
              <Image
                source={require("../assets/profile.jpeg")}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: -10,
                  marginTop: 5,
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                  {currentTournament.highestScore.score}
                </Text>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Highest Score
                </Text>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    textTransform: "capitalize",
                  }}
                >
                  {currentTournament.highestScore.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {currentTournament.highestScore.teamName}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("screen").height * 0.28,
                width: "48%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 25,
              }}
            >
              <Image
                source={require("../assets/shahid.jpg")}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: -10,
                  marginTop: 5,
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                  {currentTournament.bestBowling.best.wickets}-
                  {currentTournament.bestBowling.best.runs}
                </Text>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Best Bowling
                </Text>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    textTransform: "capitalize",
                  }}
                >
                  {currentTournament.bestBowling.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {currentTournament.bestBowling.teamName}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("screen").height * 0.28,
                width: "48%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 25,
              }}
            >
              <Image
                source={require("../assets/player1.jpg")}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: -10,
                  marginTop: 5,
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                  {currentTournament.mostSixes.sixes}
                </Text>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Most Sixes
                </Text>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    textTransform: "capitalize",
                  }}
                >
                  {currentTournament.mostSixes.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {currentTournament.mostSixes.teamName}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: Dimensions.get("screen").height * 0.28,
                width: "48%",
                backgroundColor: "white",
                elevation: 5,
                borderRadius: 25,
              }}
            >
              <Image
                source={require("../assets/profile.jpeg")}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginBottom: -10,
                  marginTop: 5,
                }}
              />
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                  {currentTournament.mostFours.fours}
                </Text>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  Most Fours
                </Text>
              </View>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    textTransform: "capitalize",
                  }}
                >
                  {currentTournament.mostFours.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {currentTournament.mostFours.teamName}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
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
});
