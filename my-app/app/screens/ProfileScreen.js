import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Camera } from "expo-camera";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { storage } from "../config/firebase-config";
import AppButton from "../components/AppButton";

export default function ProfileScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      // setImageUri(result.uri);
      if (result.uri) {
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const imageName = result.uri.substring(result.uri.lastIndexOf("/") + 1);
        const imageRef = ref(storage, "ProfileImages/dp");
        await uploadBytes(imageRef, blob);
        console.log("Image uploaded successfully");
      }
    }
  };

  useEffect(() => {
    const imageRef = ref(storage, "ProfileImages/dp.jpeg");
    getDownloadURL(imageRef)
      .then((url) => setImageUri(url))
      .catch((error) => console.log(error));
  }, []);

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
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        ) : (
          <Image
            source={require("../assets/profile.jpeg")}
            style={{ width: 130, height: 130, borderRadius: 65 }}
          />
        )}
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
