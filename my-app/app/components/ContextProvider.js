import { useEffect, useState } from "react";
import { createContext } from "react";

import { collection, getDocs, onSnapshot, doc } from "firebase/firestore";
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

  useEffect(() => {
    const fetchData = async () => {
      const teamsCollectionRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "Teams"
      );
      const teamsSnapshot = await getDocs(teamsCollectionRef);
      const teamsData = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);

      const imageRef = ref(storage, `ProfileImages/dp${auth.currentUser.uid}`);
      getDownloadURL(imageRef)
        .then((url) => setprofileImageUri(url))
        .catch((error) => console.log(error));

      const userId = auth.currentUser && auth.currentUser.uid;
      const docRef = doc(db, "users", userId);
      onSnapshot(docRef, (doc) => {
        const data = doc.data();
        setUserData(data);
      });
    };

    fetchData();
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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
