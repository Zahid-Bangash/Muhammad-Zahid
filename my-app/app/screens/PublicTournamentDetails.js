import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { Context } from "../components/ContextProvider";

import TeamCard from "../components/cards/TeamCard";
import MyMatchCard from "../components/MyMatchCard";

export default function TournamnetDetails({ navigation, route }) {
  const { myTournaments } = useContext(Context);
  const { id } = route.params;
  const tournamentIndex = myTournaments.findIndex(
    (tournament) => tournament.id === id
  );
  const currentTournament = { ...myTournaments[tournamentIndex] };

  const [swiperIndex, setSwiperIndex] = useState(0);

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
        {currentTournament.image ? (
          <Image
            source={{ uri: currentTournament.image }}
            style={{
              width: "100%",
              height: Dimensions.get("screen").height * 0.22,
            }}
          />
        ) : (
          <Image
            source={require("../assets/team4.jpg")}
            style={{
              width: "100%",
              height: Dimensions.get("screen").height * 0.22,
            }}
          />
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
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "flex-start",
            fontSize: 17,
            marginTop: "5%",
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
                  navigation.navigate("Start a Match", {
                    screen: "Match Details",
                    params: { matchId: match.id },
                  })
                }
              />
            ))
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              No Match Played
            </Text>
          )}
        </ScrollView>
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
