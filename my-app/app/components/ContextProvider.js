import { useEffect, useState } from "react";
import { createContext } from "react";

import { collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { db, storage } from "../config/firebase-config";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [teams, setTeams] = useState([]);
  const [profileImageUri, setprofileImageUri] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const teamsCollectionRef = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollectionRef);
      const teamsData = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);

      const imageRef = ref(storage, "ProfileImages/dp.jpg");
      getDownloadURL(imageRef)
        .then((url) => setprofileImageUri(url))
        .catch((error) => console.log(error));
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
