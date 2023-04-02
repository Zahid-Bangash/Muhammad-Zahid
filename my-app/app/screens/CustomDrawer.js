import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Screen from "../components/Screen";

import { auth, db, storage } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, getMetadata } from "firebase/storage";

export default function CustomDrawer(props) {
  const navigation = useNavigation();
  const [userData, setuserData] = useState({});
  const [img, setimg] = useState(null);

  const getData = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setuserData(docSnap.data());
    } else {
      alert("user data not found!");
    }
  };

  // const downLoadImage = () => {
  //   const forestRef = ref(storage, auth.currentUser.uid);
  //   getMetadata(forestRef)
  //     .then((metadata) => {
  //       console.log(metadata);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    getData();
    // downLoadImage();
  }, []);

  return (
    <Screen>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#07FFF0" }}
      >
        <View
          style={{
            height: 150,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 3,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("../assets/profile.jpeg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            {/* <Image
            source={{uri:"gs://finalproject-78235.appspot.com/628dUZy5tzRBqp7aW7Clbnr3pGj2"}}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            /> */}
          </TouchableWithoutFeedback>
          <View style={{ marginLeft: 3 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {userData.Name}
            </Text>
            <Text style={{ fontSize: 12 }}>{userData.PhoneNumber}</Text>
            <Text style={{ fontSize: 12 }}>{userData.Email}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "white" }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{ backgroundColor: "white", position: "absolute", bottom: 0 }}
        onPress={() => {
          signOut(auth);
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginLeft: 16 }}
        >
          <Ionicons name="log-out-outline" size={30} color="red" />
          <Text style={{ color: "red", fontWeight: "bold", marginLeft: 27 }}>
            Log out
          </Text>
        </View>
      </TouchableOpacity>
    </Screen>
  );
}
