import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BottomTabBar.css";
import { FaFutbol, FaComments, FaGift } from "react-icons/fa";
import { SiExpertsexchange, SiStorybook } from "react-icons/si";
import { CgMenuGridR } from "react-icons/cg";

const BottomTabBar = ({ handlePopup }) => {
  const navigate = useNavigate();

  // Retrieve initial activeTab from localStorage or default to "Menu"
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Menu"
  );

  // Define tab items
  const tabItems = [
    {
      name: "Menu",
      icon: <CgMenuGridR />,
      action: () => handlePopup("responsive", true),
    },
    {
      name: "Sportsbook",
      icon: <SiStorybook />,
      action: () => {
        navigate("/home");
        handlePopup("responsive", false);
      },
    },
    {
      name: "Exchange",
      icon: <SiExpertsexchange />,
      action: () => {
        navigate("/exchange");
        handlePopup("responsive", false);
      },
    },
    {
      name: "AI Chat",
      icon: <FaComments />,
      action: () => {
        navigate("/resChatAI");
        handlePopup("responsive", false);
      },
    },
    {
      name: "Bonus",
      icon: <FaGift />,
      action: () => {
        navigate("/bonus");
        handlePopup("responsive", false);
      },
    },
  ];

  // Update activeTab in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabClick = (item) => {
    // console.log(item);
    setActiveTab(item.name); // Update activeTab state
    item.action(); // Execute the corresponding action
  };

  return (
    <div className="bottom-tabbar">
      {tabItems.map((item) => (
        <div
          key={item.name}
          className={`tab-item ${activeTab === item.name ? "active" : ""}`}
          onClick={() => handleTabClick(item)}
        >
          <div className="tab-icon">
            {item.icon} <span className="tab-label">{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BottomTabBar;
