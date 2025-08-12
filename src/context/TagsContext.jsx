/** @format */

import { createContext, useContext, useState } from "react";

// Create context
const TagsContext = createContext();

// Provider
export const TagsProvider = ({ children }) => {
  const [activePolymarketTab, setActivePolymarketTab] = useState("All");
  const [activeSlug, setActiveSlug] = useState("all");

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
