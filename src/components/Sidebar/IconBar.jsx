import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IconBar.css";
import {
  FaBasketballBall,
  FaFootballBall,
  FaBaseballBall,
  FaConfluence,
  FaTableTennis,
} from "react-icons/fa";
import { GiTennisRacket, GiSoccerBall } from "react-icons/gi";
import { MdSportsCricket, MdSportsEsports } from "react-icons/md";
import { FaCrown, FaRobot } from "react-icons/fa";
import { BiGift } from "react-icons/bi";
import { MdGroup } from "react-icons/md";
import { PiBoxingGloveFill } from "react-icons/pi";
import { BiMessageDetail } from "react-icons/bi";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { SiExpertsexchange, SiStorybook } from "react-icons/si";
import { useNavRoute } from "../../context/navRoute";
import { IoIosFootball } from "react-icons/io";
import { FaBaseball } from "react-icons/fa6";

const IconBar = () => {
  const { handleNavRoute } = useNavRoute();

  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [exchangeDropdown, setExchangeDropdown] = useState(false);

  const toggleDropdown = () => {
    console.log("Dropdown toggled drop");
    setIsDropdownVisible((prev) => !prev);
    setExchangeDropdown(false);
    navigate("/exchange");
  };
  const toggleExchangeDropdown = () => {
    console.log("Dropdown toggled exch");
    setExchangeDropdown(!exchangeDropdown);
    setIsDropdownVisible(false);
    navigate("/");
  };
  const sportsArray = [
    { title: "American Football", icon: <FaConfluence /> },
    { title: "Basketball", icon: <FaBasketballBall /> },
    { title: "Boxing", icon: <PiBoxingGloveFill /> },
    // { title: "Mixed Martial Arts", icon: <MdSportsMartialArts /> },
    // { title: "Baseball", icon: <FaBaseballBall /> },
    { title: "Tennis", icon: <GiTennisRacket /> },
    { title: "Soccer", icon: <GiSoccerBall /> },
    { title: "Cricket", icon: <MdSportsCricket /> },
    { title: "Darts", icon: <FaBaseball /> },
    { title: "Snooker", icon: <FaTableTennis /> },
  ];

  return (
    <div className="iconbar-container">
      {/* Esports Icon with Dropdown */}
      <div className="icon-dropdown">
        <SiStorybook
          className="icon"
          title="Esports"
          onClick={toggleExchangeDropdown}
        />
        {exchangeDropdown && (
          <ul className="iconbar-dropdown">
            {sportsArray.map((item) => (
              <li key={item.title}  style={{cursor:"pointer"}}  onClick={()=>handleNavRoute(item.title)}>{item.icon}</li>
            ))}
          </ul>
        )}
      </div>
      {/* Exchange Icon with Dropdown */}
      <div className="icon-dropdown">
        <SiExpertsexchange
          className="icon"
          title="Exchnage"
          onClick={toggleDropdown}
        />
        {isDropdownVisible && (
          <ul className="iconbar-dropdown">
            {sportsArray.map((item) => (
              <li key={item.title} style={{cursor:"pointer"}} onClick={()=>handleNavRoute(item.title)}>{item.icon}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Other Icons */}
      <FaCrown className="icon" title="Crown" />
      <BiGift className="icon" title="Gift" />
      <MdGroup className="icon" title="Group" />
      <BiMessageDetail className="icon" title="Message" />
      <AiOutlineSafetyCertificate className="icon" title="Certificate" />
      <FaRobot className="icon" title="AI Advisory" />
      {/* <BiSupport className="icon" title="Support" /> */}
    </div>
  );
};

export default IconBar;
