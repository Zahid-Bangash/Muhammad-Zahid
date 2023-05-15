import React, { useState, useEffect, useContext } from "react";
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

import AppButton from "../components/AppButton";
import TeamCard from "../components/cards/TeamCard";
import MyMatchCard from "../components/MyMatchCard";

export default function TournamnetDetails({ navigation }) {
  const { TournamentData } = useContext(Context);
  const [swiperIndex, setSwiperIndex] = useState(0);

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
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
          <TeamCard name="Usama 11" place="Hazro" captain="Usama" />
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
          Add Team
        </AppButton>
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
