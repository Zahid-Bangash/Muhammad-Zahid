import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";

import { auth, db } from "../config/firebase-config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, setDoc, doc, collection } from "firebase/firestore";

import Screen from "../components/Screen";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";

export default function RegisterScreen({ navigation }) {
  const [userData, setuserData] = useState({
    name: "",
    phoneNumber: null,
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setpasswordVisibility] = useState(true);
  const [confirmVisibility, setconfirmVisibility] = useState(true);

  const handleSignUp = () => {
    if (userData.password !== userData.confirmPassword) {
      alert("Password doesn't match");
      return;
    }
    createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(() => {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            alert("Email verification sent");
          })
          .catch((error) => alert(error.message))
          .then(() => {
            setDoc(doc(db, "users", auth.currentUser.uid), {
              Name: userData.name,
              PhoneNumber: userData.phoneNumber,
              Email: userData.email,
              DOB: "-",
              Location: "-",
              BattingStyle: "-",
              PlayingRole: "-",
              BowlingStyle: "-",
              ShirtNumber: "-",
              Stats: {
                batting: {
                  overall: {
                    matches: 0,
                    innings: 0,
                    runs: 0,
                    balls: 0,
                    highest: 0,
                    average: 0,
                    sr: 0,
                    notOut: 0,
                    ducks: 0,
                    "100s": 0,
                    "50s": 0,
                    "30s": 0,
                    "6s": 0,
                    "4s": 0,
                  },
                  leather: {
                    matches: 0,
                    innings: 0,
                    runs: 0,
                    balls: 0,
                    highest: 0,
                    average: 0,
                    sr: 0,
                    notOut: 0,
                    ducks: 0,
                    "100s": 0,
                    "50s": 0,
                    "30s": 0,
                    "6s": 0,
                    "4s": 0,
                  },
                  tennis: {
                    matches: 0,
                    innings: 0,
                    runs: 0,
                    balls: 0,
                    highest: 0,
                    average: 0,
                    sr: 0,
                    notOut: 0,
                    ducks: 0,
                    "100s": 0,
                    "50s": 0,
                    "30s": 0,
                    "6s": 0,
                    "4s": 0,
                  },
                  other: {
                    matches: 0,
                    innings: 0,
                    runs: 0,
                    balls: 0,
                    highest: 0,
                    average: 0,
                    sr: 0,
                    notOut: 0,
                    ducks: 0,
                    "100s": 0,
                    "50s": 0,
                    "30s": 0,
                    "6s": 0,
                    "4s": 0,
                  },
                },
                bowling: {
                  overall: {
                    matches: 0,
                    innings: 0,
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    dots: 0,
                    wides: 0,
                    noBalls: 0,
                    maidens: 0,
                    wickets: 0,
                    average: 0,
                    economy: 0,
                    best: 0,
                    sr: 0,
                    "3W": 0,
                    "5W": 0,
                  },
                  leather: {
                    matches: 0,
                    innings: 0,
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    dots: 0,
                    wides: 0,
                    noBalls: 0,
                    maidens: 0,
                    wickets: 0,
                    average: 0,
                    economy: 0,
                    best: 0,
                    sr: 0,
                    "3W": 0,
                    "5W": 0,
                  },
                  tennis: {
                    matches: 0,
                    innings: 0,
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    dots: 0,
                    wides: 0,
                    noBalls: 0,
                    maidens: 0,
                    wickets: 0,
                    average: 0,
                    economy: 0,
                    best: 0,
                    sr: 0,
                    "3W": 0,
                    "5W": 0,
                  },
                  other: {
                    matches: 0,
                    innings: 0,
                    overs: 0,
                    balls: 0,
                    runs: 0,
                    dots: 0,
                    wides: 0,
                    noBalls: 0,
                    maidens: 0,
                    wickets: 0,
                    average: 0,
                    economy: 0,
                    best: 0,
                    sr: 0,
                    "3W": 0,
                    "5W": 0,
                  },
                },
                fielding: {
                  overall: {
                    catches: 0,
                    stumps: 0,
                    runOuts: 0,
                  },
                  leather: {
                    catches: 0,
                    stumps: 0,
                    runOuts: 0,
                  },
                  tennis: {
                    catches: 0,
                    stumps: 0,
                    runOuts: 0,
                  },
                  other: {
                    catches: 0,
                    stumps: 0,
                    runOuts: 0,
                  },
                },
              },
            });
            navigation.navigate("Welcome");
          })
          .catch((error) => alert(error.message));
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Screen>
      <ImageBackground
        source={require("../assets/bgRegister.jpg")}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            alignItems: "center",
            bottom: 230,
          }}
        >
          <AppTextInput
            placeholder="Name"
            value={userData.name}
            onChangeText={(text) => setuserData({ ...userData, name: text })}
          />
          <AppTextInput
            placeholder="Phone Number"
            keyboardType="numeric"
            value={userData.phoneNumber}
            onChangeText={(text) =>
              setuserData({ ...userData, phoneNumber: text })
            }
          />
          <AppTextInput
            placeholder="Email"
            keyboardType="email-address"
            value={userData.email}
            onChangeText={(text) => setuserData({ ...userData, email: text })}
          />
          <AppTextInput
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            secureTextEntry={passwordVisibility}
            visibility={passwordVisibility}
            onPress={() => setpasswordVisibility(!passwordVisibility)}
            rightIcon={passwordVisibility ? "eye" : "md-eye-off-sharp"}
            value={userData.password}
            onChangeText={(text) =>
              setuserData({ ...userData, password: text })
            }
          />
          <AppTextInput
            placeholder="Confirm Password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            secureTextEntry={confirmVisibility}
            visibility={confirmVisibility}
            onPress={() => setconfirmVisibility(!confirmVisibility)}
            rightIcon={confirmVisibility ? "eye" : "md-eye-off-sharp"}
            value={userData.confirmPassword}
            onChangeText={(text) =>
              setuserData({ ...userData, confirmPassword: text })
            }
          />
          <AppButton
            onPress={handleSignUp}
            style={{ marginTop: 30, backgroundColor: "#07FFF0", width: "82%" }}
          >
            REGISTER
          </AppButton>
        </View>
      </ImageBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({});
