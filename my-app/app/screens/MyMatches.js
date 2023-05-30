import React, { useContext } from "react";
import { StyleSheet, ScrollView, View, Text,Dimensions } from "react-native";
import { Context } from "../components/ContextProvider";

import MyMatchCard from "../components/MyMatchCard";
import AppButton from "../components/AppButton";

export default function MyMatches({ navigation }) {
  const { myMatches } = useContext(Context);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      {myMatches.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.container}
          style={{ width: "100%" }}
        >
          {myMatches.map((match) => (
            <MyMatchCard
              key={match.id}
              team1={match.battingTeam}
              team2={match.bowlingTeam}
              status={match.status}
              result={match.result}
              matchFormat={match.matchFormat}
              date={match.date}
              type={match.type}
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
          ))}
        </ScrollView>
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Match</Text>
      )}
      <AppButton
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderRadius: 0,
          height: "8%",
          marginVertical: 0,
        }}
        onPress={() => navigation.navigate("Start a Match")}
      >
        Start Match
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "#e0dede",
    paddingTop: 10,
    paddingBottom: Dimensions.get('screen').height*0.08,
  },
});
