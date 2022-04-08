import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      <View style={styles.child}>
        <View style={styles.btnContainer}>
          <Text style={styles.btn}>Register</Text>
          <Text style={styles.btn}>Login</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Ionicons
              name="person-sharp"
              size={24}
              color="#595b5e"
              style={styles.icon}
            />
            <TextInput placeholder="Name"></TextInput>
          </View>
          <View style={styles.input}>
            <Entypo
              name="email"
              size={24}
              color="#595b5e"
              style={styles.icon}
            />
            <TextInput placeholder="Email address"></TextInput>
          </View>
          <View style={styles.input}>
            <MaterialIcons
              name="lock"
              size={24}
              color="#595b5e"
              style={styles.icon}
            />
            <TextInput placeholder="Create a password"></TextInput>
          </View>
        </View>
        <Text style={styles.btnCreate}>Create Account</Text>
        <Text style={styles.text}>
          By creating an account, you agree to Amazon's Terms of Use.
        </Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e8e6",
    justifyContent: "flex-end",
  },
  child: {
    flex: 2.8,
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 35,
    borderTopEndRadius: 35,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  btnContainer: {
    paddingTop: "12%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btn: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  inputContainer: {
    paddingTop: "15%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: "12%",
  },
  input: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    width: "85%",
    height: "19%",
    backgroundColor: "#e6e8e6",
    borderRadius: 18,
  },
  icon: {
    marginRight: 10,
  },
  btnCreate: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    borderRadius: 20,
    lineHeight: 38,
    color: "white",
    backgroundColor: "#fc8403",
    width: "60%",
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 12,
    paddingTop: "8%",
  },
  sectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    height: 40,
    borderRadius: 5,
    margin: 10,
  },
  imageStyle: {
    height: 30,
    width: 30,
    resizeMode: "stretch",
    alignItems: "center",
  },
});
