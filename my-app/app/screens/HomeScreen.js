import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
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
  const { news, allMatches, myMatches } = useContext(Context);
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
          contentContainerStyle={{ height: 160, paddingRight: 20 }}
        >
          {allMatches.length > 0 ? (
            allMatches.map((match) => (
              <MyMatchCard
                style={{ width: 320, marginLeft: 20 }}
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
              />
            ))
          ) : (
            <MyMatchCard
              style={{ width: 320, marginLeft: 20 }}
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
          contentContainerStyle={{ paddingRight: 20, height: 160 }}
        >
          <TournamentCard
            name="zahid bangash tournament- hangu"
            teams={12}
            status="Ongoing"
            image={require("../assets/t1.jpg")}
            date="03 Nov, 2022 to 20 Dec, 2022"
            onPress={() => navigation.navigate("Tournament Details")}
          />
          <TournamentCard
            name="Night tournament - Hazro"
            teams={20}
            status="Ongoing"
            image={require("../assets/t2.jpg")}
            date="03 Nov, 2022 to 30 Nov, 2022"
            onPress={() => navigation.navigate("Tournament Details")}
          />
          <TournamentCard
            name="Peshawar Super league - Peshawar"
            teams={8}
            status="Ongoing"
            image={require("../assets/t3.jpg")}
            date="08 Oct, 2022 to 29 Nov, 2022"
            onPress={() => navigation.navigate("Tournament Details")}
          />
          <TournamentCard
            name="Tournament Name- City"
            teams={19}
            status="Ongoing"
            image={require("../assets/t1.jpg")}
            date="20 Nv, 2022 to 20 Dec, 2022"
            onPress={() => navigation.navigate("Tournament Details")}
          />
          <TournamentCard
            name="Karachi T10 League- Karachi"
            teams={14}
            status="Ongoing"
            image={require("../assets/t2.jpg")}
            date="20 Nv, 2022 to 20 Dec, 2022"
            onPress={() => navigation.navigate("Tournament Details")}
          />
          <TournamentCard
            name="zahid bangash tournament- hangu"
            teams={6}
            status="Ongoing"
            image={require("../assets/t3.jpg")}
            date="20 Nv, 2022 to 20 Dec, 2022"
            onPress={() => navigation.navigate("Tournament Details")}
          />
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          Clubs
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{ paddingRight: 20, height: 160 }}
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
          contentContainerStyle={{ height: 160, paddingRight: 20 }}
        >
          <PlayerCard
            name="Muhammad Zahid"
            image={require("../assets/profile.jpeg")}
            runs={200}
            wickets={25}
            matches={10}
            type="Batter"
          />
          <PlayerCard
            name="Shahid Afridi"
            image={require("../assets/shahid.jpg")}
            runs={2000}
            wickets={50}
            matches={70}
            type="All rounder"
          />
          <PlayerCard
            name="Alyan Subhani"
            image={require("../assets/player2.jpg")}
            runs={200}
            wickets={20}
            matches={7}
            type="Batter"
          />
          <PlayerCard
            name="Muhammad Osama"
            image={require("../assets/player1.jpg")}
            runs={150}
            wickets={7}
            matches={3}
            type="Bowler"
          />
        </ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          News/Blogs
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            paddingRight: 5,
            height: 200,
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
            width: 320,
            height: 140,
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
