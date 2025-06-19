import { createContext, useContext, useState } from "react";

// Create a context
const TabContext = createContext();

// Provider component
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Tennis");
  const [activeGameId, setActiveGameId] = useState(null);

  // console.log(activeGameId)

  return (
    <TabContext.Provider
      value={{ activeTab, setActiveTab, activeGameId, setActiveGameId }}
    >
      {children}
    </TabContext.Provider>
  );
};

// Custom hook for consuming the context
export const useTab = () => {
  return useContext(TabContext);
};
