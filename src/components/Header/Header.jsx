import React, { useState } from "react";
import "./Header.css";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { FaLocationArrow } from "react-icons/fa";
import { GrSearchAdvanced } from "react-icons/gr";
import { PiChatsTeardropFill } from "react-icons/pi";
import { GrLanguage } from "react-icons/gr";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CiMenuKebab } from "react-icons/ci";
import DropDown from "../Dropdown/DropDown";

const Header = ({ toggleBar, handleClosePopup, handlePopup }) => {
  const { isLogin } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div className="header">
      <div className="header_icon" onClick={toggleBar}>
        <HiBars3CenterLeft />
        <span>
          <FaLocationArrow />
        </span>
      </div>
      <div className="header_logo" onClick={() => navigate("/")}>
        <img src={logo} alt="" />
        <div className="logo-heading">NoLimitGaming.Bet</div>
      </div>
      <div className="coming_soon">WHOLESALE BETTING EXCHANGE - COMING IN 2025</div>
      <div className="header_btns">
        <button className="header-desc-btn" style={{ fontSize: "13px" }}>
          White Label inquiries
        </button>

        {!isLogin && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className="header-login-btn"
              onClick={() => handlePopup("signIn", true)}
            >
              Sign In
            </button>
            <button
              className="header-signup-btn"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
        {isLogin && (
          <p
            className="header-chat-icon"
            style={{ cursor: "pointer" }}
            onClick={handleMenu}
          >
            <CiMenuKebab />
          </p>
        )}
      </div>
      {showMenu && <DropDown handleMenu={handleMenu} showMenu={showMenu} />}
    </div>
  );
};

export default Header;
