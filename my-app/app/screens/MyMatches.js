import React, { useContext } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Context } from "../components/ContextProvider";

import MyMatchCard from "../components/MyMatchCard";

export default function MyMatches({ navigation }) {
  const { myMatches } = useContext(Context);
  return (
    <View style={{ alignItems: "center",justifyContent:'center',flex:1 }}>
      {myMatches.length > 0 ? (
        myMatches.map((match) => (
          <ScrollView key={match.id} contentContainerStyle={styles.container}>
            <MyMatchCard
              team1={match.battingTeam}
              team2={match.bowlingTeam}
              status={match.status}
              result={match.result}
              matchFormat={match.matchFormat}
              date={match.date}
              firstInningsBalls={
                match.innings1.length > 0 ? match.innings1[0].ballsDelivered : 0
              }
              secondInningsBalls={
                match.innings2.length > 0 ? match.innings2[0].ballsDelivered : 0
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
          </ScrollView>
        ))
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Match</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "#e0dede",
    paddingTop: 10,
  },
});
