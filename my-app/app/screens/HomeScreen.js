import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Context } from "../components/ContextProvider";
import Screen from "../components/Screen";
import Header from "../components/Header";
import MyMatchCard from "../components/MyMatchCard";
import TournamentCard from "../components/cards/TournamentCard";
import ClubCard from "../components/cards/ClubCard";
import PlayerCard from "../components/cards/PlayerCard";
import NewsCard from "../components/cards/NewsCard";
import AppButton from "../components/AppButton";

export default function HomeScreen({ navigation }) {
  const { news, allMatches, players, allTournaments } = useContext(Context);

  return (
    <Screen>
      <Header
        handleSearch={() => navigation.navigate("Search")}
        handleNews={() => navigation.navigate("News")}
        handleDrawer={() => navigation.openDrawer()}
      />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#e0dede",
          minHeight: "100%",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          Matches
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            height: Dimensions.get("screen").height * 0.213,
            paddingRight: 20,
          }}
        >
          {allMatches.length > 0 ? (
            allMatches.slice(0, 6).map((match) => (
              <MyMatchCard
                style={{
                  width: Dimensions.get("screen").width * 0.9,
                  marginLeft: 20,
                }}
                key={match.id}
                team1={match.battingTeam}
                team2={match.bowlingTeam}
                status={match.status}
                result={match.result}
                matchFormat={match.matchFormat}
                date={match.date}
                firstInningsBalls={
                  match.innings1.length > 0
                    ? match.innings1[0].ballsDelivered
                    : 0
                }
                secondInningsBalls={
                  match.innings2.length > 0
                    ? match.innings2[0].ballsDelivered
                    : 0
                }
                firstInningsRuns={
                  match.innings1.length > 0 ? match.innings1[0].totalRuns : 0
                }
                secondInningsRuns={
                  match.innings2.length > 0 ? match.innings2[0].totalRuns : 0
                }
                firstInningsWickets={
                  match.innings1.length > 0 ? match.innings1[0].wicketsDown : 0
                }
                secondInningsWickets={
                  match.innings2.length > 0 ? match.innings2[0].wicketsDown : 0
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
            <MyMatchCard
              style={{
                width: Dimensions.get("screen").width * 0.9,
                marginLeft: 20,
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
          )}
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          Tournaments
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            paddingRight: 20,
            height: Dimensions.get("screen").height * 0.213,
          }}
        >
          {allTournaments.length > 0 ? (
            allTournaments
              .slice(0, 6)
              .map((tournament) => (
                <TournamentCard
                  name="zahid bangash tournament- hangu"
                  teams={12}
                  status="Ongoing"
                  image={require("../assets/t1.jpg")}
                  startDate="03 Nov, 2022"
                  endDate="03 Dec, 2022"
                />
              ))
          ) : (
            <TournamentCard
              name="zahid bangash tournament- hangu"
              teams={12}
              status="Ongoing"
              image={require("../assets/t1.jpg")}
              startDate="03 Nov, 2022"
              endDate="03 Dec, 2022"
            />
          )}
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          Clubs
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            paddingRight: 20,
            height: Dimensions.get("screen").height * 0.213,
          }}
        >
          <ClubCard
            name="Harzo Cricket Club"
            image={require("../assets/t3.jpg")}
            address="Hazro"
          />
          <ClubCard
            name="Osama club"
            image={require("../assets/t2.jpg")}
            address="Attock"
          />
          <ClubCard
            name="Karachi Club"
            image={require("../assets/t1.jpg")}
            address="Karachi"
          />
          <ClubCard
            name="Club name"
            image={require("../assets/t3.jpg")}
            address="Islamabad"
          />
          <ClubCard
            name="King Club"
            image={require("../assets/t2.jpg")}
            address="Peshawar"
          />
          <ClubCard
            name="Club name"
            image={require("../assets/t1.jpg")}
            address="Faisalabad"
          />
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          Featured Players
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            height: Dimensions.get("screen").height * 0.213,
            paddingRight: 20,
          }}
        >
          {players.length > 0 ? (
            players
              .slice(0, 6)
              .map((player) => (
                <PlayerCard
                  key={player.id}
                  name={player.Name}
                  image={
                    player.image
                      ? { uri: player.image }
                      : require("../assets/profile.jpeg")
                  }
                  runs={player.Stats.batting.overall.runs}
                  wickets={player.Stats.bowling.overall.wickets}
                  matches={player.Stats.batting.overall.matches}
                  type={player.PlayingRole}
                />
              ))
          ) : (
            <PlayerCard
              name="Muhammad Zahid"
              image={require("../assets/profile.jpeg")}
              runs={200}
              wickets={25}
              matches={10}
              type="Batter"
            />
          )}
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          News/Blogs
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            paddingRight: 5,
            height: Dimensions.get("screen").height * 0.27,
            alignItems: "center",
          }}
        >
          {news.length > 0 ? (
            news
              .slice(0, 6)
              .map((article, index) => (
                <NewsCard
                  key={index}
                  uri={article.coverImage}
                  description={article.description}
                  date={article.pubDate}
                  onPress={() =>
                    navigation.navigate("News Details", { link: article.link })
                  }
                />
              ))
          ) : (
            <NewsCard
              uri=""
              description="On a pitch where none of his team-mates crossed 30, Prabhsrimran scored a 65-ball 103 to secure"
              date="Sunday, 14 May 2023 1:10:10"
            />
          )}
          {news.length > 0 ? (
            <AppButton
              style={{
                width: 100,
                marginLeft: 5,
                backgroundColor: "green",
                borderRadius: 10,
              }}
              onPress={() => navigation.navigate("News")}
            >
              View More
            </AppButton>
          ) : null}
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          Support
        </Text>
        <View
          style={{
            padding: 20,
            width: Dimensions.get("screen").width * 0.9,
            height: Dimensions.get("screen").height * 0.19,
            backgroundColor: "#3f8c67",
            borderRadius: 20,
            marginLeft: 20,
            elevation: 5,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
            Need help?
          </Text>
          <Text style={{ color: "white", lineHeight: 20 }}>
            {`Mail us at support@cricworld.com \nCall or WhatsApp at \nOsama +923125273333 \nZahid +923125274444`}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
