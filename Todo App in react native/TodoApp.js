import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ItemView from "./ItemView";

export default function TodoApp() {
  const [item, setitem] = useState(null);
  const [itemList, setitemList] = useState([]);
  const [totalItems, settotalItems] = useState(0);
  const [unchecked, setunchecked] = useState(0);

  const handleAdd = () => {
    if (item && item.trim()) {
      setitemList([...itemList, item.trim()]);
      setitem(null);
      settotalItems(totalItems + 1);
      setunchecked(unchecked + 1);
    }
  };

  const handleComplete = (ind) => {
    // const itemsCopy = itemList.filter((v, i) => ind !== i);
    // setitemList(itemsCopy);

    let itemsCopy = [...itemList];
    itemsCopy.splice(ind, 1);
    setitemList(itemsCopy);
    settotalItems(totalItems - 1);
    setunchecked(unchecked - 1);
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Todo App</Text>
      <Text style={Styles.msg}>Swipe left to delete items</Text>
      <View style={Styles.countContainer}>
        <Text style={Styles.count}>Total Items:{totalItems}</Text>
        <Text style={Styles.count}>Unchecked Items:{unchecked}</Text>
      </View>
      <ScrollView style={Styles.itemContainer}>
        {/* <FlatList
          data={itemList}
          renderItem={()=>{}}
        /> */}
        {itemList.map((item, index) => {
          return (
            <GestureHandlerRootView key={index}>
              <Swipeable
                renderRightActions={() => (
                  <View
                    style={{
                      width: 80,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => handleComplete(index)}>
                      <AntDesign name="delete" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              >
                <ItemView item={item} />
              </Swipeable>
            </GestureHandlerRootView>
          );
        })}
      </ScrollView>
      <View style={Styles.addContainer}>
        <TextInput
          placeholder="Add New Item"
          style={Styles.input}
          placeholderTextColor="black"
          value={item}
          onChangeText={(item) => setitem(item)}
        />
        <TouchableOpacity style={Styles.iconBg} onPress={handleAdd}>
          <Ionicons
            name="add-circle"
            size={60}
            color="white"
            style={Styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#94ade3",
    alignItems: "center",
  },
  title: {
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    fontSize: 40,
    fontWeight: "bold",
    color: "tomato",
    textAlign: "center",
  },
  msg: {
    marginTop: 30,
    fontSize: 15,
    color: "yellow",
  },
  countContainer: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  count: {
    margin: 5,
    fontSize: 15,
    fontWeight: "bold",
  },
  itemContainer: {
    marginTop: 0,
    width: "97%",
  },
  addContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
