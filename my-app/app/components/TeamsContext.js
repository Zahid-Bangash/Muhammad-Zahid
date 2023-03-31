import { createContext } from "react";
const TeamsContext = createContext({
  teams: [],
  updateTeams: () => {},
});
export default TeamsContext;
