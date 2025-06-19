import React from "react";
import "./DropDown.css";
import { FaUserCircle } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { DiOpenshift } from "react-icons/di";
import { RiExchangeLine } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { FiGift } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const DropDown = ({ handleMenu, showMenu }) => {
  const { setUser, setIsLogin } = useAuth();

  const menuOptions = [
    { option: "  My Profie", icon: <FaUserCircle />, route: "/profile" },
    { option: "Refer & Earn", icon: <FiGift />, route: "/referearn" },
    // { option: "Bet History", icon: <DiOpenshift /> , route: "/bethistory"},
    {
      option: "Coin History",
      icon: <FaMoneyBillWave />,
      route: "/coinhistory",
    },
    {
      option: "Bonus History",
      icon: <RiFolderHistoryFill />,
      route: "/bonushistory",
    },
    {
      option: "Sportbook History",
      icon: <MdHistory />,
      route: "/sporthistory",
    },
    {
      option: "Exchange History",
      icon: <RiExchangeLine />,
      route: "/exchangehistory",
    },
    { option: "Logout", icon: <AiOutlineLogout />, route: "/exchangehistory" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLogin(false);
    navigate("/signin");
  };
  const handleroute = (route, option) => {
    if (option === "Logout") {
      handleLogout();
    } else {
      navigate(route);
    }
    handleMenu();
  };

  return (
    <>
      <div className="overlay-menudrop" onClick={handleMenu}></div>
      <div
        className={`dropdown-container ${
          showMenu ? "active" : isClosing ? "closing" : ""
        }`}
      >
        <div className="dropdown-menu-content">
          {menuOptions.map((item, index) => (
            <button
              className="dropdown-button"
              type="button"
              key={index}
              onClick={() => handleroute(item.route, item.option)}
            >
              <span>{item.icon}</span>
              <span>{item.option}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default DropDown;
