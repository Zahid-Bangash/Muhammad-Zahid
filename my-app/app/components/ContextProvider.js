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
  });
  const [teams, setTeams] = useState([]);
  const [profileImageUri, setprofileImageUri] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const teamsCollectionRef = collection(db, "users",auth.currentUser.uid,"Teams");
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
