import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";
import { Context } from "../components/ContextProvider";
export default function MyStats({ route }) {
  const { players } = useContext(Context);
  const { id } = route.params;
  const PlayerIndex = players.findIndex((player) => player.id === id);
  const currentPlayer = { ...players[PlayerIndex] };
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
          Batting
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
          Bowling
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
          Fielding
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
    >
      <View style={styles.slide}>
        <View style={[styles.row, { marginTop: 44, backgroundColor: "pink" }]}>
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Overall</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Leather</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Tennis</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Other</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Matches</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.matches}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Innings</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.innings}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.innings}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.innings}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.innings}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Runs</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.runs}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Balls</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.balls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.balls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.balls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.balls}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Highest</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.highest}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.highest}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.highest}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.highest}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Average</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.average}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.average}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.average}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.average}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>SR</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.sr}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.sr}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.sr}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.sr}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Not out</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.notOut}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.notOut}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.notOut}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.notOut}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Ducks</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall.ducks}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather.ducks}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis.ducks}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other.ducks}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>100s</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall["100s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather["100s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis["100s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis["100s"]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>50s</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall["50s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather["50s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis["50s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other["50s"]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>30s</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall["30s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather["30s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis["30s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other["30s"]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>6s</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall["6s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather["6s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis["6s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other["6s"]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>4s</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.overall["4s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.leather["4s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.tennis["4s"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.batting.other["4s"]}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.slide}>
        <View style={[styles.row, { marginTop: 44, backgroundColor: "pink" }]}>
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Overall</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Leather</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Tennis</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Other</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Matches</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.matches}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Innings</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.innings}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.matches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.matches}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Overs</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.overs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.overs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.overs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.overs}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Balls</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.balls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.balls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.balls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.balls}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Runs</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.runs}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Dots</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.dots}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.dots}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.dots}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.dots}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Wides</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.wides}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.wides}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.wides}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.wides}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>No Balls</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.noBalls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.noBalls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.noBalls}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.noBalls}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Maidens</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.maidens}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.maidens}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.maidens}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.maidens}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Wickets</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.wickets}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.wickets}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.wickets}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.wickets}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Average</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.average}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.average}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.average}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.average}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Economy</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.economy}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.economy}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.economy}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.economy}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Best</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.best.wickets}-
            {currentPlayer.Stats.bowling.overall.best.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.best.wickets}-
            {currentPlayer.Stats.bowling.leather.best.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.best.wickets}-
            {currentPlayer.Stats.bowling.tennis.best.runs}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.best.wickets}-
            {currentPlayer.Stats.bowling.other.best.runs}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>SR</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall.sr}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather.sr}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis.sr}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other.sr}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>3W</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall["3W"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather["3W"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis["3W"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other["3W"]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>5W</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.overall["5W"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.leather["5W"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.tennis["5W"]}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.bowling.other["5W"]}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.slide}>
        <View style={[styles.row, { marginTop: 44, backgroundColor: "pink" }]}>
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Overall</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Leather</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Tennis</Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Other</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Catches</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.overall.catches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.leather.catches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.tennis.catches}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.other.catches}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Stumps</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.overall.stumps}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.leather.stumps}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.tennis.stumps}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.other.stumps}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={{ flex: 1, fontWeight: "bold" }}>Run Outs</Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.overall.runOuts}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.leather.runOuts}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.tennis.runOuts}
          </Text>
          <Text style={styles.cell}>
            {currentPlayer.Stats.fielding.other.runOuts}
          </Text>
        </View>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "#d4d0cd",
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
  row: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
