import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Swiper from "react-native-swiper";
import { Context } from "../components/ContextProvider";

import { addDoc, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

import AppButton from "../components/AppButton";
import TeamCard from "../components/cards/TeamCard";
import MyMatchCard from "../components/MyMatchCard";
import AppTextInput from "../components/AppTextInput";

export default function TournamnetDetails({ navigation, route }) {
  const { TournamentData, myTournamentTeams, teams } = useContext(Context);
  const { id } = route.params;
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [showAddTeamModal, setshowAddTeamModal] = useState(false);
  const [showSearchModal, setshowSearchModal] = useState(false);
  const [name, setname] = useState("");
  const [search, setsearch] = useState([]);

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
    setsearch(result);
  };

  const addTeamToTournament = async (team) => {
    try {
      const teamRef = collection(db, "Tournaments", id, "Teams");
      const docRef = await addDoc(teamRef, team);
      console.log("Team added to tournamnet", docRef.id);
    } catch (error) {
      console.error("Error adding team: ", error);
    }
  };

  const deleteTeam = async (teamId) => {
    const updatedTeams = teams.filter((team) => team.id !== teamId);
    // setTeams(updatedTeams);
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "Teams", teamId));
  };

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else setsearch([]);
  }, [name]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Create Tournament" }],
      });
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
        <Image
          source={require("../assets/team4.jpg")}
          style={{
            width: "100%",
            height: Dimensions.get("screen").height * 0.22,
          }}
        />
        <View
          style={{
            alignSelf: "flex-start",
            height: "10%",
            justifyContent: "space-around",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {TournamentData.name}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "grey" }}>
            {`Organized by : ${TournamentData.organizer.name}`}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "grey" }}>
            {`Dates: ${TournamentData.startDate} - ${TournamentData.endDate}`}
          </Text>
        </View>
        <AppButton
          style={{
            borderRadius: 0,
            width: "100%",
            height: "8%",
            marginVertical: "3%",
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
              {TournamentData.mostRuns.runs}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {TournamentData.mostRuns.playerName}
              </Text>
              <Text style={{ color: "grey", fontSize: 12 }}>
                {TournamentData.mostRuns.teamName}
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
              {TournamentData.mostWickets.wickets}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {TournamentData.mostWickets.playerName}
              </Text>
              <Text style={{ color: "grey", fontSize: 12 }}>
                {TournamentData.mostWickets.teamName}
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
              {TournamentData.sixes}
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
              {TournamentData.fours}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.slide, { paddingBottom: "12.5%" }]}>
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          {/* {myTournamentTeams.length > 0 ? (
            <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              No Team Added
            </Text>
          )} */}
        </ScrollView>
        <AppButton
          style={{
            position: "absolute",
            bottom: 0,
            width: "95%",
            borderRadius: 0,
            height: "8%",
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
              {teams.map((team) => (
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
              ))}
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
                  No Team Found
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
          <MyMatchCard
            style={{
              width: Dimensions.get("screen").width * 0.9,
            }}
            team1="zahid"
            team2="usama"
            status="completed"
            result="zahid won by 9 runs"
            matchFormat="T20"
            date="14/05/23"
            firstInningsBalls={32}
            secondInningsBalls={22}
            firstInningsRuns={71}
            secondInningsRuns={62}
            firstInningsWickets={2}
            secondInningsWickets={3}
          />
          <MyMatchCard
            style={{
              width: Dimensions.get("screen").width * 0.9,
            }}
            team1="zahid"
            team2="usama"
            status="completed"
            result="zahid won by 9 runs"
            matchFormat="T20"
            date="14/05/23"
            firstInningsBalls={32}
            secondInningsBalls={22}
            firstInningsRuns={71}
            secondInningsRuns={62}
            firstInningsWickets={2}
            secondInningsWickets={3}
          />
          <MyMatchCard
            style={{
              width: Dimensions.get("screen").width * 0.9,
            }}
            team1="zahid"
            team2="usama"
            status="completed"
            result="zahid won by 9 runs"
            matchFormat="T20"
            date="14/05/23"
            firstInningsBalls={32}
            secondInningsBalls={22}
            firstInningsRuns={71}
            secondInningsRuns={62}
            firstInningsWickets={2}
            secondInningsWickets={3}
          />
          <MyMatchCard
            style={{
              width: Dimensions.get("screen").width * 0.9,
            }}
            team1="zahid"
            team2="usama"
            status="completed"
            result="zahid won by 9 runs"
            matchFormat="T20"
            date="14/05/23"
            firstInningsBalls={32}
            secondInningsBalls={22}
            firstInningsRuns={71}
            secondInningsRuns={62}
            firstInningsWickets={2}
            secondInningsWickets={3}
          />
          <MyMatchCard
            style={{
              width: Dimensions.get("screen").width * 0.9,
            }}
            team1="zahid"
            team2="usama"
            status="completed"
            result="zahid won by 9 runs"
            matchFormat="T20"
            date="14/05/23"
            firstInningsBalls={32}
            secondInningsBalls={22}
            firstInningsRuns={71}
            secondInningsRuns={62}
            firstInningsWickets={2}
            secondInningsWickets={3}
          />
        </ScrollView>
        <AppButton
          style={{
            position: "absolute",
            bottom: 0,
            width: "95%",
            borderRadius: 0,
            height: "8%",
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
                  {TournamentData.mostRuns.runs}
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
                  {TournamentData.mostRuns.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {TournamentData.mostRuns.teamName}
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
                  {TournamentData.mostWickets.wickets}
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
                  {TournamentData.mostWickets.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {TournamentData.mostWickets.teamName}
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
                  {TournamentData.highestScore.score}
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
                  {TournamentData.highestScore.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {TournamentData.highestScore.teamName}
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
                  {TournamentData.bestBowling.best}
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
                  {TournamentData.highestScore.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {TournamentData.highestScore.teamName}
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
                  {TournamentData.mostSixes.sixes}
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
                  {TournamentData.mostSixes.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {TournamentData.mostSixes.teamName}
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
                  {TournamentData.mostFours.fours}
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
                  {TournamentData.mostFours.playerName}
                </Text>
                <Text
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  {TournamentData.mostFours.teamName}
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
