import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { async } from "@firebase/util";

import { ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../config/firebase-config";

import AppButton from "../components/AppButton";

export default function ProfileScreen({ navigation }) {
  const [image, setImage] = useState(null);
  // const [loading, setloading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result.uri);

    if (!result.canceled) {
      setImage(result.uri);
      // setloading(true);
      uploadImage();
    }
  };

  const uploadImage = async () => {
    // setloading(true);
    const storageRef = ref(storage, auth.currentUser.uid);
    const metadata = {
      contentType: "image/jpeg",
    };

    uploadBytes(storageRef, image, metadata).then(() => {
      alert("Uploaded a blob or file!");
    });
    // setloading(false);
  };

  // useEffect(() => {
  //   uploadImage();
  // }, []);

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
        <Image
          source={require("../assets/profile.jpeg")}
          style={{ width: 130, height: 130, borderRadius: 65 }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",
            top: -40,
          }}
          onPress={pickImage}
        >
          <Ionicons name="camera" size={30} />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>Zahid Bangash</Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Ionicons name="location" size={19} color="#FE7F0A" />
        <Text style={{ marginLeft: 10, fontSize: 17 }}>Attock</Text>
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
          <Text style={{ fontWeight: "bold" }}>Muhammad Zahid</Text>
          <Text style={{ marginTop: 20 }}>PLAYING ROLE</Text>
          <Text style={{ fontWeight: "bold" }}>Batter</Text>
          <Text style={{ marginTop: 20 }}>BOWLING STYLE</Text>
          <Text style={{ fontWeight: "bold" }}>Right Arm Offbreak</Text>
          <Text style={{ marginTop: 20 }}>EMAIL</Text>
          <Text style={{ fontWeight: "bold" }}>zahidbangash@gmail.com</Text>
        </View>
        <View>
          <Text style={{ marginTop: 20 }}>DATE OF BIRTH</Text>
          <Text style={{ fontWeight: "bold" }}>03.03.2001</Text>
          <Text style={{ marginTop: 20 }}>BATTING STYLE</Text>
          <Text style={{ fontWeight: "bold" }}>Right Hand Bat</Text>
          <Text style={{ marginTop: 20 }}>DATE OF BIRTH</Text>
          <Text style={{ fontWeight: "bold" }}>03.03.2001</Text>
          <Text style={{ marginTop: 20 }}>MOBILE NUMBER</Text>
          <Text style={{ fontWeight: "bold" }}>03125273883</Text>
        </View>
      </View>
      <AppButton
        style={{ width: "50%", marginTop: 70 }}
        onPress={() => navigation.navigate("Edit Profile")}
      >
        Edit Info
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
