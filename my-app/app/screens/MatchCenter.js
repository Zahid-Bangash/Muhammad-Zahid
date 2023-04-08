import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import Swiper from "react-native-swiper";
import Entypo from "@expo/vector-icons/Entypo";

import { db } from "../config/firebase-config";
import { doc, onSnapshot } from "firebase/firestore";

import Batter from "../components/Batter";
import Bowler from "../components/Bowler";

export default function MatchCenter({ route, navigation }) {
  const { matchId, inningsId } = route.params;
  const [swiperIndex, setSwiperIndex] = useState(0);

  const [matchData, setMatchData] = useState({});
  const [inningsData, setInningsData] = useState({});

  useEffect(() => {
    const matchDocRef = doc(db, "matches", matchId);
    const inningsDocRef = doc(
      db,
      "matches",
      matchId,
      "First innings",
      inningsId
    );

    const matchUnsubscribe = onSnapshot(matchDocRef, (doc) => {
      const data = doc.data();
      setMatchData(data);
    });

    const inningsUnsubscribe = onSnapshot(inningsDocRef, (doc) => {
      const data = doc.data();
      setInningsData(data);
    });

    return () => {
      matchUnsubscribe();
      inningsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      Alert.alert("Confirm", "Are you sure you want to leave the match?", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            unsubscribe();
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          },
        },
      ]);
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
          Scoring
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
          Scorecard
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
    >
      <View style={[styles.slide]}>
        <View
          style={{
            flex: 2.5,
            width: "100%",
            marginTop: 44,
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderColor: "gray",
          }}
        >
          <Text>Team</Text>
          <Text style={{ fontWeight: "bold", fontSize: 40, color: "#8f4705" }}>
            {Object.keys(inningsData).length > 0 ? inningsData.totalRuns : "99"}
            -
            {Object.keys(inningsData).length > 0
              ? inningsData.wicketsDown
              : "hh"}
          </Text>
          <Text>(0.4/5)</Text>
        </View>
        <View
          style={{
            flex: 2.5,
            borderBottomWidth: 0.5,
            borderColor: "gray",
            width: "100%",
            flexDirection: "row",
            padding: 5,
          }}
        >
          <View
            style={{
              flex: 2,
              justifyContent: "space-around",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Batsman</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>Zahid*</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>Bangash</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>R</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>B</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>4s</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>5</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>6s</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>1</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>SR</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>254</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            borderBottomWidth: 0.5,
            borderColor: "gray",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 2,
              justifyContent: "space-around",
              height: "100%",
              padding: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Bowler</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>Zahid</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>O</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>M</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>54</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>R</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>5</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>W</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>1</Text>
          </View>
          <View style={styles.cell}>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Eco</Text>
            <Text style={{ fontWeight: "bold", color: "grey" }}>254</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1.5,
            borderBottomWidth: 0.5,
            borderColor: "gray",
            width: "100%",
          }}
        ></View>
        <View
          style={{
            flex: 1.3,
            borderBottomWidth: 1,
            borderColor: "gray",
            width: "100%",
          }}
        ></View>
        <View
          style={{
            flex: 4,
            backgroundColor: "pink",
            width: "100%",
            padding: 5,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => console.log("dot")}>
              <View style={styles.buttonCell}>
                <Entypo name="dot-single" size={30} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("1")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>1</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("2")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>2</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("3")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>3</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("undo")}>
              <View style={[styles.buttonCell, { borderRightWidth: 0 }]}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 17, color: "green" }}
                >
                  Undo
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => console.log("wide")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>Wide</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("Bye")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>Bye</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("4")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>4</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("6")}>
              <View style={styles.buttonCell}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>6</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("out")}>
              <View style={[styles.buttonCell, { borderRightWidth: 0 }]}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 17, color: "red" }}
                >
                  Out
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => console.log("nb")}>
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>NB</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("lb")}>
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>LB</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("5,7")}>
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>5,7</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("input")}>
              <View style={[styles.buttonCell, { borderBottomWidth: 0 }]}>
                <Entypo name="pencil" size={25} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("more")}>
              <View
                style={[
                  styles.buttonCell,
                  { borderRightWidth: 0, borderBottomWidth: 0 },
                ]}
              >
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>More</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={styles.slide}>
        <ScrollView contentContainerStyle={{ marginTop: 44, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#5ca5a9",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Team1</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
              <Text>(2.0 Ov)</Text>
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
            <Text style={{ fontWeight: "500", flex: 3 }}>Batters</Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              B
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              4s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              6s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              SR
            </Text>
          </View>
          <Batter
            name="Zahid"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
          <Batter
            name="Bangash"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
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
            <Text>0</Text>
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
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
                <Text>(2.0 Ov)</Text>
              </View>
              <Text>RR 20.60</Text>
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
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              O
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              M
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              W
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              Eco
            </Text>
          </View>
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Dharkan"
          />
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Janu"
          />
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#5ca5a9",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Team1</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
              <Text>(2.0 Ov)</Text>
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
            <Text style={{ fontWeight: "500", flex: 3 }}>Batters</Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              B
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              4s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              6s
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              SR
            </Text>
          </View>
          <Batter
            name="Zahid"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
          <Batter
            name="Bangash"
            runs={46}
            balls={73}
            fours={5}
            sixes={6}
            srate={234.6}
          />
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
            <Text>0</Text>
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
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>41/0</Text>
                <Text>(2.0 Ov)</Text>
              </View>
              <Text>RR 20.60</Text>
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
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              O
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              R
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              M
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              W
            </Text>
            <Text style={{ fontWeight: "500", flex: 1, textAlign: "center" }}>
              Eco
            </Text>
          </View>
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Dharkan"
          />
          <Bowler
            overs={5}
            middens={0}
            runs={45}
            wickets={2}
            eco={19.0}
            name="Janu"
          />
        </ScrollView>
      </View>
      <View style={styles.slide}>
        <Text style={styles.buttonText}>Info Screen</Text>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  cell: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonCell: {
    flex: 1,
    borderColor: "black",
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
