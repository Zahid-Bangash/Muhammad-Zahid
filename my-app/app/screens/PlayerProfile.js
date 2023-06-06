import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Context } from "../components/ContextProvider";

export default function ProfileScreen({ route }) {
  const { players } = useContext(Context);
  const { id } = route.params;
  const PlayerIndex = players.findIndex((player) => player.id === id);
  const currentPlayer = { ...players[PlayerIndex] };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          width: 150,
          height: 150,
          marginTop: 10,
        }}
      >
        {currentPlayer.image ? (
          <Image
            source={{ uri: currentPlayer.image }}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        ) : (
          <Image
            source={require("../assets/profile.jpeg")}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        )}
      </View>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>
        {currentPlayer.Name}
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Ionicons name="location" size={19} color="#FE7F0A" />
        <Text style={{ marginLeft: 10, fontSize: 17 }}>
          {currentPlayer.Location}
        </Text>
      </View>
      <View
        style={{
          width: "90%",
          marginTop: 20,
          padding: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ marginTop: 20 }}>FULL NAME</Text>
          <Text style={{ fontWeight: "bold" }}>{currentPlayer.Name}</Text>
          <Text style={{ marginTop: 20 }}>PLAYING ROLE</Text>
          <Text style={{ fontWeight: "bold" }}>
            {currentPlayer.PlayingRole}
          </Text>
          <Text style={{ marginTop: 20 }}>BOWLING STYLE</Text>
          <Text style={{ fontWeight: "bold" }}>
            {currentPlayer.BowlingStyle}
          </Text>
          <Text style={{ marginTop: 20 }}>EMAIL</Text>
          <Text style={{ fontWeight: "bold" }}>{currentPlayer.Email}</Text>
        </View>
        <View>
          <Text style={{ marginTop: 20 }}>DATE OF BIRTH</Text>
          <Text style={{ fontWeight: "bold" }}>{currentPlayer.DOB}</Text>
          <Text style={{ marginTop: 20 }}>BATTING STYLE</Text>
          <Text style={{ fontWeight: "bold" }}>
            {currentPlayer.BattingStyle}
          </Text>
          <Text style={{ marginTop: 20 }}>Shirt Number</Text>
          <Text style={{ fontWeight: "bold" }}>
            {currentPlayer.ShirtNumber}
          </Text>
          <Text style={{ marginTop: 20 }}>MOBILE NUMBER</Text>
          <Text style={{ fontWeight: "bold" }}>
            {currentPlayer.PhoneNumber}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
