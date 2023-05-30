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
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "@firebase/storage";
import { auth, db, storage } from "../config/firebase-config";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    Name: "Your Name",
    PhoneNumber: "Phone Number",
    Email: "Email",
    DOB: "-",
    Location: "City",
    BattingStyle: "BattingStyle",
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
  const [myTournaments, setmyTournaments] = useState([]);
  const [allTournaments, setallTournaments] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [showModalTournament, setshowModalTournament] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser && auth.currentUser.uid;

    const fetchAllTournamentData = async () => {
      const tournamentsCollectionRef = collection(db, "Tournaments");

      onSnapshot(tournamentsCollectionRef, async (tournamentSnapshot) => {
        const tournaments = [];

        for (const doc of tournamentSnapshot.docs) {
          const tournamentData = doc.data();
          const tournamentId = doc.id;

          const matchesCollectionRef = collection(
            tournamentsCollectionRef,
            tournamentId,
            "Matches"
          );

          onSnapshot(matchesCollectionRef, async (matchesSnapshot) => {
            const matches = [];

            for (const matchDoc of matchesSnapshot.docs) {
              const matchData = matchDoc.data();
              const matchId = matchDoc.id;

              const inningsCollectionRef = collection(
                matchesCollectionRef,
                matchId,
                "innings"
              );

              const inningsSnapshot = await getDocs(inningsCollectionRef);
              const innings = [];

              inningsSnapshot.forEach((inningDoc) => {
                const inningData = inningDoc.data();
                innings.push(inningData);
              });

              const innings1 = innings.find((inning) => inning.inningsNo === 1);
              const innings2 = innings.find((inning) => inning.inningsNo === 2);

              const matchWithInnings = {
                id: matchId,
                ...matchData,
                innings1: innings1,
                innings2: innings2,
              };

              matches.push(matchWithInnings);
            }

            const tournamentWithMatches = {
              id: tournamentId,
              ...tournamentData,
              matches: matches,
            };

            tournaments.push(tournamentWithMatches);
            setallTournaments(tournaments);
          });
        }
      });
    };
    const fetchTournamentData = async () => {
      const tournamentsCollectionRef = collection(
        db,
        "users",
        userId,
        "Tournaments"
      );

      onSnapshot(tournamentsCollectionRef, async (tournamentSnapshot) => {
        const tournaments = [];

        for (const doc of tournamentSnapshot.docs) {
          const tournamentData = doc.data();
          const tournamentId = doc.id;

          const matchesCollectionRef = collection(
            tournamentsCollectionRef,
            tournamentId,
            "Matches"
          );

          onSnapshot(matchesCollectionRef, async (matchesSnapshot) => {
            const matches = [];

            for (const matchDoc of matchesSnapshot.docs) {
              const matchData = matchDoc.data();
              const matchId = matchDoc.id;

              const inningsCollectionRef = collection(
                matchesCollectionRef,
                matchId,
                "innings"
              );

              const inningsSnapshot = await getDocs(inningsCollectionRef);
              const innings = [];

              inningsSnapshot.forEach((inningDoc) => {
                const inningData = inningDoc.data();
                innings.push(inningData);
              });

              const innings1 = innings.find((inning) => inning.inningsNo === 1);
              const innings2 = innings.find((inning) => inning.inningsNo === 2);

              const matchWithInnings = {
                id: matchId,
                ...matchData,
                innings1: innings1,
                innings2: innings2,
              };

              matches.push(matchWithInnings);
            }

            const tournamentWithMatches = {
              id: tournamentId,
              ...tournamentData,
              matches: matches,
            };

            tournaments.push(tournamentWithMatches);
            setmyTournaments(tournaments);
          });
        }
      });
    };

    const fetchUsers = async () => {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

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
    };

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

    const fetchMyTeams = async () => {
      const teamsCollectionRef = collection(db, "users", userId, "Teams");
      const teamsSnapshot = await getDocs(teamsCollectionRef);
      const teamsData = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
    };
    const fetchMyData = async () => {
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

      onSnapshot(matchesCollectionRef, async (matchesSnapshot) => {
        const matches = [];

        for (const matchDoc of matchesSnapshot.docs) {
          const matchData = matchDoc.data();
          const matchId = matchDoc.id;
          let innings1 = [];
          let innings2 = [];

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
        }

        setmyMatches(matches);
      });
    };

    const getAllMatches = async () => {
      const allMatchesRef = collection(db, "Matches");
      const allMatchesSnapshot = await getDocs(allMatchesRef);

      const matches = [];

      allMatchesSnapshot.forEach(async (matchDoc) => {
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
    };
    fetchMyData();
    getAllMatches();
    fetchAllTournamentData();
    fetchUsers();
    fetchTournamentData();
    getMatchesWithInnings();
    fetchMyTeams();
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
        setmyMatches,
        setallMatches,
        allMatches,
        players,
        myTournaments,
        setmyTournaments,
        allTournaments,
        setallTournaments,
        showModal,
        setshowModal,
        showModalTournament,
        setshowModalTournament,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
