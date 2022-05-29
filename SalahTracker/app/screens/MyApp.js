import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PrayerTitle from "../components/PrayerTitle";
import AppButton from "../components/AppButton";
import Report from "./Report";

const Stack = createStackNavigator();

function Home({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [date, setdate] = useState(new Date());
  const [text, settext] = useState(
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
  );

  const [fajar, setFajar] = useState("");
  const [zuhar, setzuhar] = useState("");
  const [asar, setasar] = useState("");
  const [maghrib, setmaghrib] = useState("");
  const [isha, setisha] = useState("");

  const onChange = (event, selectedDate) => {
    setVisible(false);
    const currentDate = selectedDate || date;
    setdate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getFullYear() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getDate();

    settext(fDate);
  };

  const storeFajar = async (val) => {
    setFajar(val);
    try {
      await AsyncStorage.setItem(text + "f", val);
    } catch (e) {
      // saving error
    }
  };
  const storeZuhar = async (val) => {
    setzuhar(val);
    try {
      await AsyncStorage.setItem(text + "z", val);
    } catch (e) {
      // saving error
    }
  };
  const storeAsar = async (val) => {
    setasar(val);
    try {
      await AsyncStorage.setItem(text + "a", val);
    } catch (e) {
      // saving error
    }
  };
  const storeMaghrib = async (val) => {
    setmaghrib(val);
    try {
      await AsyncStorage.setItem(text + "m", val);
    } catch (e) {
      // saving error
    }
  };
  const storeIsha = async (val) => {
    setisha(val);
    try {
      await AsyncStorage.setItem(text + "i", val);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const fajar = await AsyncStorage.getItem(text + "f");
      const zuhar = await AsyncStorage.getItem(text + "z");
      const asar = await AsyncStorage.getItem(text + "a");
      const maghrib = await AsyncStorage.getItem(text + "m");
      const isha = await AsyncStorage.getItem(text + "i");

      setFajar(fajar);
      setzuhar(zuhar);
      setasar(asar);
      setmaghrib(maghrib);
      setisha(isha);
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salah Tracker</Text>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={(val) => setVisible(val)}
      >
        <Text style={styles.btnText}>Show Date Picker</Text>
      </TouchableOpacity>
      <Text style={styles.date}>{text}</Text>
      {visible && (
        <DateTimePicker
          value={date}
          maximumDate={new Date()}
          minimumDate={new Date(2018, 1, 1)}
          onChange={onChange}
        />
      )}
      <View style={styles.prayersContainer}>
        <View style={styles.prayer}>
          <PrayerTitle>Fajar</PrayerTitle>
          <RadioButtonGroup
            selected={fajar}
            onSelected={(val) => storeFajar(val)}
            containerStyle={{ flexDirection: "row" }}
            radioStyle={{ backgroundColor: "white" }}
            radioBackground="green"
          >
            <RadioButtonItem
              value="offered"
              label="Offered"
              style={{ margin: 10 }}
            />
            <RadioButtonItem
              value="not offered"
              label="not offered"
              style={{ margin: 10 }}
            />
          </RadioButtonGroup>
        </View>
        <View style={styles.prayer}>
          <PrayerTitle>Zuhar</PrayerTitle>
          <RadioButtonGroup
            selected={zuhar}
            onSelected={(val) => storeZuhar(val)}
            containerStyle={{ flexDirection: "row" }}
            radioStyle={{ backgroundColor: "white" }}
            radioBackground="green"
          >
            <RadioButtonItem
              value="offered"
              label="Offered"
              style={{ margin: 10 }}
            />
            <RadioButtonItem
              value="notOffered"
              label="not offered"
              style={{ margin: 10 }}
            />
          </RadioButtonGroup>
        </View>
        <View style={styles.prayer}>
          <PrayerTitle>Asar</PrayerTitle>
          <RadioButtonGroup
            selected={asar}
            onSelected={(val) => storeAsar(val)}
            containerStyle={{ flexDirection: "row" }}
            radioStyle={{ backgroundColor: "white" }}
            radioBackground="green"
          >
            <RadioButtonItem
              value="offered"
              label="Offered"
              style={{ margin: 10 }}
            />
            <RadioButtonItem
              value="notOffered"
              label="not offered"
              style={{ margin: 10 }}
            />
          </RadioButtonGroup>
        </View>
        <View style={styles.prayer}>
          <PrayerTitle>Maghrib</PrayerTitle>
          <RadioButtonGroup
            selected={maghrib}
            onSelected={(val) => storeMaghrib(val)}
            containerStyle={{ flexDirection: "row" }}
            radioStyle={{ backgroundColor: "white" }}
            radioBackground="green"
          >
            <RadioButtonItem
              value="offered"
              label="Offered"
              style={{ margin: 10 }}
            />
            <RadioButtonItem
              value="notOffered"
              label="not offered"
              style={{ margin: 10 }}
            />
          </RadioButtonGroup>
        </View>
        <View style={styles.prayer}>
          <PrayerTitle>Isha</PrayerTitle>
          <RadioButtonGroup
            selected={isha}
            onSelected={(val) => storeIsha(val)}
            containerStyle={{ flexDirection: "row" }}
            radioStyle={{ backgroundColor: "white" }}
            radioBackground="green"
          >
            <RadioButtonItem
              value="offered"
              label="Offered"
              style={{ margin: 10 }}
            />
            <RadioButtonItem
              value="notOffered"
              label="not offered"
              style={{ margin: 10 }}
            />
          </RadioButtonGroup>
        </View>
      </View>
      <View style={styles.recordContainer}>
        <Text style={styles.recordTitle}>Previous Records</Text>
        <View style={styles.recordItems}>
          <AppButton onPress={() => navigation.navigate("Weekly")}>
            Last Week
          </AppButton>
          <AppButton onPress={() => navigation.navigate("Monthly")}>
            Last Month
          </AppButton>
          <AppButton onPress={() => navigation.navigate("Custom")}>
            Custom
          </AppButton>
        </View>
      </View>
    </View>
  );
}

function Weekly() {
  let defaultValues = [1, 1, 1, 1, 1];
  const [prayerRecord, setprayerRecord] = useState(defaultValues);
  const [curDate, setcurDate] = useState(new Date());
  const [weeklyCount, setweeklyCount] = useState(0);
  let fajarCount = 0;
  let zuharCount = 0;
  let asarCount = 0;
  let maghribCount = 0;
  let ishaCount = 0;

  const getWeeklyRecord = async () => {
    for (let i = curDate.getDate() - 7; i < curDate.getDate(); i++) {
      try {
        const fajarValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "f"
        );
        const zuharValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "z"
        );
        const asarValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "a"
        );
        const maghribValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "m"
        );
        const ishaValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "i"
        );
        if (fajarValue === "offered") {
          fajarCount++;
        }
        if (zuharValue === "offered") {
          zuharCount++;
        }
        if (asarValue === "offered") {
          asarCount++;
        }
        if (maghribValue === "offered") {
          maghribCount++;
        }
        if (ishaValue === "offered") {
          ishaCount++;
        }
      } catch (e) {
        console.log(e);
      }
    }
    setweeklyCount(
      fajarCount + zuharCount + asarCount + maghribCount + ishaCount
    );
    if (weeklyCount !== 0) {
      setprayerRecord([
        fajarCount,
        zuharCount,
        asarCount,
        maghribCount,
        ishaCount,
      ]);
    }
  };

  useEffect(() => {
    getWeeklyRecord();
  });

  return (
    <Report
      title="Last Week Report"
      message={`You offered ${weeklyCount} prayers out of 35`}
      data={prayerRecord}
      labels={["Fajar", "Zuhar", "Asar", "Maghrib", "Isha"]}
    ></Report>
  );
}

function Monthly() {
  let defaultValues = [1, 1, 1, 1, 1];
  const [prayerRecord, setprayerRecord] = useState(defaultValues);
  const [curDate, setcurDate] = useState(new Date());
  const [monthlyCount, setmonthlyCount] = useState(0);

  let fajarCount = 0;
  let zuharCount = 0;
  let asarCount = 0;
  let maghribCount = 0;
  let ishaCount = 0;

  const getMonthlyRecord = async () => {
    for (let i = curDate.getDate() - 30; i < curDate.getDate(); i++) {
      try {
        const fajarValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "f"
        );
        const zuharValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "z"
        );
        const asarValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "a"
        );
        const maghribValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "m"
        );
        const ishaValue = await AsyncStorage.getItem(
          curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "i"
        );
        if (fajarValue === "offered") {
          fajarCount++;
        }
        if (zuharValue === "offered") {
          zuharCount++;
        }
        if (asarValue === "offered") {
          asarCount++;
        }
        if (maghribValue === "offered") {
          maghribCount++;
        }
        if (ishaValue === "offered") {
          ishaCount++;
        }
      } catch (e) {
        console.log(e);
      }
    }
    setmonthlyCount(
      fajarCount + zuharCount + asarCount + maghribCount + ishaCount
    );
    if (monthlyCount !== 0) {
      setprayerRecord([
        fajarCount,
        zuharCount,
        asarCount,
        maghribCount,
        ishaCount,
      ]);
    }
  };

  useEffect(() => {
    getMonthlyRecord();
  });

  return (
    <Report
      title="Last Month Report"
      message={`You offered ${monthlyCount} prayers out of 150`}
      data={prayerRecord}
      labels={["Fajar", "Zuhar", "Asar", "Maghrib", "Isha"]}
    ></Report>
  );
}

function Custom() {
  let defaultValues = [1, 1, 1, 1, 1];
  const [customRecord, setcustomRecord] = useState(defaultValues);
  const [offeredCount, setofferedCount] = useState(0);
  const [totalCount, settotalCount] = useState(0);
  const [visible1, setvisible1] = useState(false);
  const [visible2, setvisible2] = useState(false);
  const [fromDate, setfromDate] = useState(new Date());
  const [toDate, settoDate] = useState(new Date());
  const [from, setfrom] = useState(
    fromDate.getFullYear() +
      "/" +
      (fromDate.getMonth() + 1) +
      "/" +
      fromDate.getDate()
  );
  const [to, setto] = useState(
    toDate.getFullYear() +
      "/" +
      (toDate.getMonth() + 1) +
      "/" +
      toDate.getDate()
  );

  const onChange1 = (event, selectedDate) => {
    setvisible1(false);
    const frDate = selectedDate || fromDate;
    setfromDate(frDate);
    let tempDate = new Date(frDate);
    let fDate =
      tempDate.getFullYear() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getDate();

    setfrom(fDate);
  };
  const onChange2 = (event, selectedDate) => {
    setvisible2(false);
    const tDate = selectedDate || toDate;
    settoDate(tDate);
    let tempDate = new Date(tDate);
    let fDate =
      tempDate.getFullYear() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getDate();

    setto(fDate);
  };

  let fajarCount = 0;
  let zuharCount = 0;
  let asarCount = 0;
  let maghribCount = 0;
  let ishaCount = 0;

  const getCustomRecord = async () => {
    let fromYear = fromDate.getFullYear();
    let fromMonth = fromDate.getMonth();
    let frmDate = fromDate.getDate();

    let toYear = toDate.getFullYear();
    let toMonth = toDate.getMonth();
    let tDate = toDate.getDate();

    let YearDifference = toYear - fromYear;
    let MonthDifference = toMonth - fromMonth;
    let DateDifference = tDate - frmDate;

    let tcount =
      YearDifference * 1825 + MonthDifference * 150 + DateDifference * 5;
    settotalCount(tcount);

    // for (let i = curDate.getDate() - 30; i < curDate.getDate(); i++) {
    //   try {
    //     const fajarValue = await AsyncStorage.getItem(
    //       curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "f"
    //     );
    //     const zuharValue = await AsyncStorage.getItem(
    //       curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "z"
    //     );
    //     const asarValue = await AsyncStorage.getItem(
    //       curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "a"
    //     );
    //     const maghribValue = await AsyncStorage.getItem(
    //       curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "m"
    //     );
    //     const ishaValue = await AsyncStorage.getItem(
    //       curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + i + "i"
    //     );
    //     if (fajarValue === "offered") {
    //       fajarCount++;
    //     }
    //     if (zuharValue === "offered") {
    //       zuharCount++;
    //     }
    //     if (asarValue === "offered") {
    //       asarCount++;
    //     }
    //     if (maghribValue === "offered") {
    //       maghribCount++;
    //     }
    //     if (ishaValue === "offered") {
    //       ishaCount++;
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    setofferedCount(
      fajarCount + zuharCount + asarCount + maghribCount + ishaCount
    );
    if (offeredCount !== 0) {
      setcustomRecord([
        fajarCount,
        zuharCount,
        asarCount,
        maghribCount,
        ishaCount,
      ]);
    }
  };

  useEffect(() => {
    getCustomRecord();
  });

  return (
    <>
      <Report
        title={`From ${from} to ${to}`}
        message={`You offered ${offeredCount} prayers out of ${totalCount}`}
        data={customRecord}
        labels={["Fajar", "Zuhar", "Asar", "Maghrib", "Isha"]}
      ></Report>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <AppButton onPress={(val) => setvisible1(val)}>From Date</AppButton>
        <AppButton onPress={(val) => setvisible2(val)}>To Date</AppButton>
      </View>
      {visible1 && (
        <DateTimePicker
          value={new Date()}
          maximumDate={new Date()}
          minimumDate={new Date(2018, 1, 1)}
          onChange={onChange1}
        />
      )}
      {visible2 && (
        <DateTimePicker
          value={new Date()}
          maximumDate={new Date()}
          minimumDate={new Date(2018, 1, 1)}
          onChange={onChange2}
        />
      )}
    </>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home Screen" component={Home} />
        <Stack.Screen name="Weekly" component={Weekly} />
        <Stack.Screen name="Monthly" component={Monthly} />
        <Stack.Screen name="Custom" component={Custom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff9cf0",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
  },
  btnContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1ac920",
    padding: 10,
    borderRadius: 20,
  },
  btnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
  },
  prayersContainer: {
    marginTop: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#9dd1d4",
  },
  prayer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordTitle: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  recordContainer: {
    position: "absolute",
    bottom: 10,
  },
  recordItems: {
    marginTop: 20,
    flexDirection: "row",
  },
  input: {
    backgroundColor: "white",
    width: "80%",
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
});
