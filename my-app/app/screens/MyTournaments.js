import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Context } from "../components/ContextProvider";

import TournamentCard from "../components/cards/TournamentCard";
import { collection, deleteDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";

import AppButton from "../components/AppButton";

export default function MyTournaments({ navigation }) {
  const { myTournaments } = useContext(Context);
  const [showDeleteIcon, setshowDeleteIcon] = useState(false);

  const deleteTournament = async (id) => {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "Tournaments", id));
    await deleteDoc(doc(db, "Tournaments", id));
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      {myTournaments.length > 0 ? (
        <ScrollView contentContainerStyle={styles.container}>
          {myTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              style={{ marginLeft: 0, marginBottom: 10 }}
              name={tournament.name}
              teams={12}
              status={tournament.status}
              image={require("../assets/t1.jpg")}
              startDate={tournament.startDate}
              endDate={tournament.endDate}
              onPress={() =>
                navigation.navigate("Add Tournament", {
                  screen: "Tournament Details",
                  params: {
                    id: tournament.id,
                  },
                })
              }
              showDelete={showDeleteIcon}
              onDelete={() => deleteTournament(tournament.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>No Tournaments</Text>
      )}
      <AppButton
        style={{
          position: "absolute",
          bottom: 0,
          width: "95%",
          borderRadius: 0,
          height: "8%",
        }}
        onPress={() => setshowDeleteIcon(!showDeleteIcon)}
      >
        Delete Tournament
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    padding: 15,
    paddingBottom: "12.5%",
  },
});
