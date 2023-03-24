import React from "react";
import { View, Text, StyleSheet, ScrollView,TouchableOpacity, } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import TeamCard from '../components/cards/TeamCard';
export default function MyTeams({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:"80%"}}>
        <Text>Add New Team</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Add Your Team")}>
        <Ionicons name="add" size={45} color="green" />
        </TouchableOpacity>
      </View>
    <ScrollView>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
      <TeamCard name="Team 1" place="Islamabad" captain="Zahid" onPress={() => navigation.navigate("Team Details")}/>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#e0dede",
    // paddingBottom:40,
  },
});
