import { createContext, useContext, useState } from "react";

// Create a context
const TabContext = createContext();

// Provider component
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Baseball");
  const [activeGameId, setActiveGameId] = useState(3);
  const [activeLeagueId, setActiveLeagueId] = useState(null);

  return (
    <TabContext.Provider
      value={{ activeTab, setActiveTab, activeGameId, setActiveGameId, activeLeagueId, setActiveLeagueId }}
    >
      {children}
    </TabContext.Provider>
  );
};

// Custom hook for consuming the context
export const useTab = () => {
  return useContext(TabContext);
};
