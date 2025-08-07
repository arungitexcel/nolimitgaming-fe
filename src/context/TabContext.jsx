import { createContext, useContext, useState } from "react";

// Create a context
const TabContext = createContext();

// Provider component
export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("Baseball");
  const [activeGameId, setActiveGameId] = useState(3);

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
