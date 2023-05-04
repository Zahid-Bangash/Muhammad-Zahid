import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";

import { auth, db } from "../config/firebase-config";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";

import Batter from "../components/Batter";
import Bowler from "../components/Bowler";

export default function MatchDetails() {
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [matchData, setmatchData] = useState({
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
  const [firstInnings, setfirstInnings] = useState({});
  const [secondInnings, setsecondInnings] = useState({});

  useEffect(() => {
    const matchDocRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "Matches",
      mWFTV4NOY0fMSY8N03xk
    );

    const matchUnsubscribe = onSnapshot(matchDocRef, (doc) => {
      const data = doc.data();
      setMatchData(data);
    });

    return () => {
      matchUnsubscribe();
    };
  }, []);

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        onPress={() => setSwiperIndex(0)}
        style={[styles.button, swiperIndex === 1 && styles.activeButton]}
      >
        <Text
          style={[
            styles.buttonText,
            swiperIndex === 0 && { fontWeight: "bold" },
          ]}
        >
          Scorecard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSwiperIndex(1)}
        style={[styles.button, swiperIndex === 1 && styles.activeButton]}
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
        <ScrollView style={{ width: "100%" }}>
          <View
            style={{
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "red", fontWeight: "bold" }}>
              {inningsData.isCompleted === true && inningsData.inningsNo === 2
                ? matchData.result
                : inningsData.inningsNo === 1
                ? `${matchData.tossResult.winnerTeam} selected to ${matchData.tossResult.decision} first`
                : `${inningsData.battingTeam} requires ${
                    matchData.target - inningsData.totalRuns
                  } in ${
                    matchData.totalOvers * 6 - inningsData.ballsDelivered
                  } balls`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#5ca5a9",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {matchData.battingTeam}
            </Text>
            {inningsData.ballsDelivered === 0 ? (
              <Text style={{ fontWeight: "bold" }}>Yet to bat</Text>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {inningsData.totalRuns} / {inningsData.wicketsDown}
                </Text>
                <Text>{`(${
                  Math.floor(inningsData.ballsDelivered / 6) +
                  (inningsData.ballsDelivered % 6) / 10
                } Ov)`}</Text>
              </View>
            )}
          </View>
          {inningsData.ballsDelivered === 0 ? null : (
            <>
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
              {inningsData.allBatsmen.map((batter) => (
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
                    batter.id === inningsData.currentBatsmen[0].id
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
                <Text>{inningsData.extras}</Text>
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
                      {inningsData.totalRuns}/{inningsData.wicketsDown}
                    </Text>
                    <Text>
                      {`(${
                        Math.floor(inningsData.ballsDelivered / 6) +
                        (inningsData.ballsDelivered % 6) / 10
                      } Ov)`}
                    </Text>
                  </View>
                  <Text>CRR {inningsData.runRate}</Text>
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
              {inningsData.bowlers.map((bowler) => (
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
          {inningsData.outBatsmen.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#d8dede",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Fall of Wickets</Text>
                <Text style={{ fontWeight: "bold" }}>Score(Over)</Text>
              </View>
              {inningsData.outBatsmen.map((batter, index) => (
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
              {/* <Text style={{height:500}}>hhhhh</Text> */}
            </>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#5ca5a9",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              {matchData.bowlingTeam}
            </Text>
            {inningsData.ballsDelivered === 0 ? (
              <Text style={{ fontWeight: "bold" }}>Yet to bat</Text>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  {inningsData.totalRuns} / {inningsData.wicketsDown}
                </Text>
                <Text>{`(${
                  Math.floor(inningsData.ballsDelivered / 6) +
                  (inningsData.ballsDelivered % 6) / 10
                } Ov)`}</Text>
              </View>
            )}
          </View>
          {inningsData.ballsDelivered === 0 ? null : (
            <>
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
              {inningsData.allBatsmen.map((batter) => (
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
                    batter.id === inningsData.currentBatsmen[0].id
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
                <Text>{inningsData.extras}</Text>
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
                      {inningsData.totalRuns}/{inningsData.wicketsDown}
                    </Text>
                    <Text>
                      {`(${
                        Math.floor(inningsData.ballsDelivered / 6) +
                        (inningsData.ballsDelivered % 6) / 10
                      } Ov)`}
                    </Text>
                  </View>
                  <Text>CRR {inningsData.runRate}</Text>
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
              {inningsData.bowlers.map((bowler) => (
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
          {inningsData.outBatsmen.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#d8dede",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Fall of Wickets</Text>
                <Text style={{ fontWeight: "bold" }}>Score(Over)</Text>
              </View>
              {inningsData.outBatsmen.map((batter, index) => (
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
            <Text style={{ fontWeight: "bold" }}>
              {inningsData.battingTeam}
            </Text>
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
            <Text style={{ fontWeight: "bold" }}>
              {inningsData.bowlingTeam}
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
});
