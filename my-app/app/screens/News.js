import React, { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Context } from "../components/ContextProvider";
import NewsItem from "../components/NewsItem";

export default function News({ navigation }) {
  const { news } = useContext(Context);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {news.map((article, index) => (
        <NewsItem
          key={index}
          title={article.title}
          description={article.description}
          date={article.pubDate}
          uri={article.coverImage}
          onPress={() =>
            navigation.navigate("News Details", { link: article.link })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    alignItems: "center",
    backgroundColor: "#e0dede",
  },
});
