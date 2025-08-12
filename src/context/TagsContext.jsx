/** @format */

import { createContext, useContext, useState } from "react";

// Create context
const TagsContext = createContext();

// Provider
export const TagsProvider = ({ children }) => {
  const [activePolymarketTab, setActivePolymarketTab] = useState("dating");
  const [activeSlug, setActiveSlug] = useState("dating");

  const updateActiveTag = (label, slug) => {
    setActivePolymarketTab(label);
    setActiveSlug(slug);
  };

  return (
    <TagsContext.Provider value={{ activePolymarketTab, activeSlug, updateActiveTag }}>{children}</TagsContext.Provider>
  );
};

// Custom hook for using the context
export const useTags = () => useContext(TagsContext);
