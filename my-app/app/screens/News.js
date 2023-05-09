import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { parseString } from "react-native-xml2js";

import NewsItem from "../components/NewsItem";

export default function News({ navigation }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("https://www.espncricinfo.com/rss/content/story/feeds/0.xml")
      .then((response) => response.text())
      .then((responseText) => {
        parseString(responseText, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            const newsData = result.rss.channel[0].item.map((item) => ({
              title: item.title[0],
              link: item.link[0],
              description: item.description[0],
              pubDate: item.pubDate[0],
              coverImage: item.coverImages[0] ? item.coverImages[0] : "",
            }));
            setNews(newsData);
          }
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {news.map((article, index) => (
        <NewsItem
          key={index}
          title={article.title}
          description={article.description}
          date={article.pubDate}
          uri={article.coverImage}
          link={article.link}
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
