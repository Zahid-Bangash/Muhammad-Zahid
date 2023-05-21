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

export default function Search() {
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
            style={{ height: Dimensions.get("screen").height * 0.075 }}
            contentContainerStyle={{
              marginTop: 10,
            }}
          >
            <AppButton
              style={{
                width: Dimensions.get("screen").width * 0.3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: selected === "users" ? "brown" : "#5da3a4",
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
                backgroundColor: selected === "Teams" ? "brown" : "#5da3a4",
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
                backgroundColor: selected === "Matches" ? "brown" : "#5da3a4",
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
                  selected === "Tournaments" ? "brown" : "#5da3a4",
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
                backgroundColor: selected === "Club" ? "brown" : "#5da3a4",
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
            style={{ marginTop: 15, paddingBottom: 300, width: "100%" }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {searchData.length > 0 ? (
              searchData.map((item) => {
                if (selected === "users") {
                  return (
                    <PlayerCardForAddPlayer
                      key={item.id}
                      name={item.name}
                      location={item.location}
                    />
                  );
                } else if (selected === "Teams") {
                  return <TeamCard key={item.id} />;
                } else if (selected === "Matches") {
                  return <MyMatchCard key={item.id} />;
                } else if (selected === "Tournaments") {
                  return <TournamentCard key={item.id} />;
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
