import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import TeamsContext from "./TeamsContext";

const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);

  const updateTeams = (updatedTeams) => {
    setTeams(updatedTeams);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollectionRef = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollectionRef);
      const teamsData = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
    };

    fetchTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, updateTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

export default TeamsProvider;
