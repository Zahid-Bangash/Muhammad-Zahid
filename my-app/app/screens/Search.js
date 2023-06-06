import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import PlayerCardForAddPlayer from "../components/PlayerCardForAddPlayer";
import TournamentCard from "../components/cards/TournamentCard";
import TeamCard from "../components/cards/TeamCard";
import MyMatchCard from "../components/MyMatchCard";

import { addDoc, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase-config";

export default function Search({ navigation }) {
  const [name, setname] = useState("");
  const [filterVisible, setfilterVisible] = useState(false);
  const [selected, setselected] = useState("users");
  const [searchData, setsearchData] = useState([]);

  const searchByName = async () => {
    const searchref = collection(db, selected);
    const snapshot = await getDocs(searchref);
    let field;
    if (selected === "users") field = "Name";
    else if (selected === "Teams") field = "name";
    else if (selected === "Matches") field = "title";
    else if (selected === "Tournaments") field = "name";
    const searchResults = snapshot.docs.filter((doc) =>
      doc.data()[field].toLowerCase().includes(name.toLowerCase())
    );
    const result = searchResults.map((doc) => ({ id: doc.id, ...doc.data() }));
    setsearchData(result);

    setfilterVisible(true);
  };

  useEffect(() => {
    if (name.length > 0) {
      searchByName();
    } else setsearchData([]);
  }, [selected]);

  return (
    <View style={{ alignItems: "center" }}>
      <AppTextInput
        placeholder="Search Here"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        rightIcon="search"
        onPress={searchByName}
        value={name}
        onChangeText={(text) => setname(text)}
        onFocus={() => setfilterVisible(false)}
      />

      {filterVisible && (
        <>
          <ScrollView
            horizontal
            style={{
              height: Dimensions.get("screen").height * 0.085,
              marginTop: 10,
            }}
          >
            <AppButton
              style={{
                width: Dimensions.get("screen").width * 0.3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: selected === "users" ? "#043939" : "#328c8d",
              }}
              onPress={() => {
                setsearchData([]);
                setselected("users");
              }}
            >
              Player
            </AppButton>
            <AppButton
              style={{
                width: Dimensions.get("screen").width * 0.3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: selected === "Teams" ? "#043939" : "#328c8d",
              }}
              onPress={() => {
                setsearchData([]);
                setselected("Teams");
              }}
            >
              Team
            </AppButton>
            <AppButton
              style={{
                width: Dimensions.get("screen").width * 0.3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: selected === "Matches" ? "#043939" : "#328c8d",
              }}
              onPress={() => {
                setsearchData([]);
                setselected("Matches");
              }}
            >
              Match
            </AppButton>
            <AppButton
              style={{
                width: Dimensions.get("screen").width * 0.3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor:
                  selected === "Tournaments" ? "#043939" : "#328c8d",
              }}
              onPress={() => {
                setsearchData([]);
                setselected("Tournaments");
              }}
            >
              Tournament
            </AppButton>
            <AppButton
              style={{
                width: Dimensions.get("screen").width * 0.3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: selected === "Club" ? "#043939" : "#328c8d",
              }}
              onPress={() => {
                setsearchData([]);
                setselected("Club");
              }}
            >
              Club
            </AppButton>
          </ScrollView>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: Dimensions.get("screen").height * 0.2,
              marginTop: 10,
            }}
          >
            {searchData.length > 0 ? (
              searchData.map((item) => {
                if (selected === "users") {
                  return (
                    <PlayerCardForAddPlayer
                      key={item.id}
                      name={item.Name}
                      location={item.Location}
                      uri={item.image}
                    />
                  );
                } else if (selected === "Teams") {
                  return (
                    <TeamCard
                      key={item.id}
                      name={item.name}
                      place={item.place}
                      uri={item.image}
                      onPress={()=>navigation.navigate("Team Details",{team:item})}
                    />
                  );
                } else if (selected === "Matches") {
                  return (
                    <MyMatchCard
                      key={item.id}
                      team1={item.battingTeam}
                      team2={item.bowlingTeam}
                      status={item.status}
                      result={item.result}
                      matchFormat={item.matchFormat}
                      date={item.date}
                      type={item.type}
                      firstInningsBalls={
                        item.innings1 && item.innings1.length > 0
                          ? item.innings1[0].ballsDelivered
                          : 0
                      }
                      secondInningsBalls={
                        item.innings2 && item.innings2.length > 0
                          ? item.innings2[0].ballsDelivered
                          : 0
                      }
                      firstInningsRuns={
                        item.innings1 && item.innings1.length > 0
                          ? item.innings1[0].totalRuns
                          : 0
                      }
                      secondInningsRuns={
                        item.innings2 && item.innings2.length > 0
                          ? item.innings2[0].totalRuns
                          : 0
                      }
                      firstInningsWickets={
                        item.innings1 && item.innings1.length > 0
                          ? item.innings1[0].wicketsDown
                          : 0
                      }
                      secondInningsWickets={
                        item.innings2 && item.innings2.length > 0
                          ? item.innings2[0].wicketsDown
                          : 0
                      }
                      onPress={() =>
                        navigation.navigate("Match Details", {
                          matchId: item.id,
                        })
                      }
                    />
                  );
                } else if (selected === "Tournaments") {
                  return (
                    <TournamentCard
                      key={item.id}
                      style={{ marginLeft: 0, marginBottom: 10 }}
                      name={item.name}
                      city={item.city}
                      teams={item.teams.length}
                      status={item.status}
                      image={require("../assets/t1.jpg")}
                      startDate={item.startDate}
                      endDate={item.endDate}
                      onPress={() =>
                        navigation.navigate("Tournament Details", {
                          id: item.id,
                        })
                      }
                    />
                  );
                } else {
                  return null;
                }
              })
            ) : (
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                No {selected} found
              </Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}
