import { useEffect, useId, useState } from "react";
import { createContext } from "react";
import { parseString } from "react-native-xml2js";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { auth, db, storage } from "../config/firebase-config";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    Name: "Your Name",
    PhoneNumber: "Phone Number",
    Email: "Email",
    DOB: "-",
    Location: "your city",
    BattingStyle: "-",
    PlayingRole: "Playing Role",
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
          best: { runs: 0, wickets: 0 },
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
          best: { runs: 0, wickets: 0 },
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
          best: { runs: 0, wickets: 0 },
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
          best: { runs: 0, wickets: 0 },
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
  const [teams, setTeams] = useState([]);
  const [profileImageUri, setprofileImageUri] = useState(null);
  const [news, setNews] = useState([]);
  const [allMatches, setallMatches] = useState([]);
  const [myMatches, setmyMatches] = useState([]);
  const [players, setplayers] = useState([]);
  const [TournamentData, setTournamentData] = useState({
    name: "Name",
    city: "City",
    organizer: { name: "Organizer", phone: "Phone", email: "Email" },
    startDate: "01/01/23",
    endDate: "15/01/23",
    ballType: "Ball Type",
    matchTye: "Match Type",
    status: "Ongoing",
    mostRuns: { playerName: "Player Name", runs: 0, teamName: "Team Name" },
    mostWickets: {
      playerName: "Player Name",
      wickets: 0,
      teamName: "Team Name",
    },
    sixes: 0,
    fours: 0,
    highestScore: {
      playerName: "Player Name",
      score: 0,
      teamName: "Team Name",
    },
    bestBowling: {
      playerName: "Player Name",
      best: "0-0",
      teamName: "Team Name",
    },
    mostSixes: { playerName: "Player Name", sixes: 0, teamName: "Team Name" },
    mostFours: { playerName: "Player Name", fours: 0, teamName: "Team Name" },
  });
  const [tournamentTeams, settournamentTeams] = useState([]);

  useEffect(() => {
    const getAllMatches = async () => {
      const allMatchesRef = collection(db, "Matches");

      onSnapshot(allMatchesRef, (allmatchesSnapshot) => {
        const matches = [];

        allmatchesSnapshot.forEach(async (matchDoc) => {
          const matchData = matchDoc.data();
          const matchId = matchDoc.id;
          let innings1 = [],
            innings2 = [];
          const inningsQuery1 = query(
            collection(db, "Matches", matchId, "innings"),
            where("inningsNo", "==", 1)
          );
          const inningsSnapshot1 = await getDocs(inningsQuery1);
          if (!inningsSnapshot1.empty) {
            innings1 = inningsSnapshot1.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }
          const inningsQuery2 = query(
            collection(db, "Matches", matchId, "innings"),
            where("inningsNo", "==", 2)
          );
          const inningsSnapshot2 = await getDocs(inningsQuery2);
          if (!inningsSnapshot2.empty) {
            innings2 = inningsSnapshot2.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }

          matches.push({ id: matchId, ...matchData, innings1, innings2 });
        });

        setallMatches(matches);
      });
    };

    getAllMatches();
  }, []);

  useEffect(() => {
    const userId = auth.currentUser && auth.currentUser.uid;
    const fetchData = async () => {
      const teamsCollectionRef = collection(db, "users", userId, "Teams");
      const teamsSnapshot = await getDocs(teamsCollectionRef);
      const teamsData = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);

      const imageRef = ref(storage, `ProfileImages/dp${userId}`);
      getDownloadURL(imageRef)
        .then((url) => setprofileImageUri(url))
        .catch((error) => console.log(error));

      const docRef = doc(db, "users", userId);
      onSnapshot(docRef, (doc) => {
        const data = doc.data();
        setUserData(data);
      });
    };
    const getMatchesWithInnings = async () => {
      const matchesCollectionRef = collection(db, "users", userId, "Matches");

      onSnapshot(matchesCollectionRef, (matchesSnapshot) => {
        const matches = [];

        matchesSnapshot.forEach(async (matchDoc) => {
          const matchData = matchDoc.data();
          const matchId = matchDoc.id;
          let innings1 = [],
            innings2 = [];
          const inningsQuery1 = query(
            collection(db, "users", userId, "Matches", matchId, "innings"),
            where("inningsNo", "==", 1)
          );
          const inningsSnapshot1 = await getDocs(inningsQuery1);
          if (!inningsSnapshot1.empty) {
            innings1 = inningsSnapshot1.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }
          const inningsQuery2 = query(
            collection(db, "users", userId, "Matches", matchId, "innings"),
            where("inningsNo", "==", 2)
          );
          const inningsSnapshot2 = await getDocs(inningsQuery2);
          if (!inningsSnapshot2.empty) {
            innings2 = inningsSnapshot2.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }

          matches.push({ id: matchId, ...matchData, innings1, innings2 });
        });

        setmyMatches(matches);
      });
    };
    fetchData();
    getMatchesWithInnings();
  }, []);

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

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "users");

      onSnapshot(usersRef, (usersSnapshot) => {
        const usersData = [];

        usersSnapshot.forEach(async (doc) => {
          const userData = doc.data();
          const userId = doc.id;
          let dp = "";
          const imageRef = ref(storage, `ProfileImages/dp${userId}`);
          try {
            const url = await getDownloadURL(imageRef);
            if (url) dp = url;
          } catch (error) {
            console.log(
              `Error getting profile image for user ${userId}: ${error}`
            );
          }

          usersData.push({ id: userId, image: dp, ...userData });
        });

        setplayers(usersData);
      });
    };

    fetchUsers();
  }, []);
  return (
    <Context.Provider
      value={{
        userData,
        setUserData,
        teams,
        setTeams,
        profileImageUri,
        setprofileImageUri,
        news,
        myMatches,
        allMatches,
        players,
        TournamentData,
        tournamentTeams,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
