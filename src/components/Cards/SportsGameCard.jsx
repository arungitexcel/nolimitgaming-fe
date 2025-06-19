import React, { useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SportsGameCard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sports-card-container">
      <p
        className="sports-card-heading"
        onClick={() => navigate("/gamedetails_odds")}
      >
        <FaFutbol /> Australia Big Bash League, Women
      </p>
      <p className="sports-card-time">Tomorrow, 13:45</p>
      <div className="sports-card-game-name">
        <p>
          <FaFutbol /> Sydney Thunder
        </p>
        <p>
          <FaFutbol /> Hobart Hurricanes
        </p>
      </div>
      <div className="sports-card-game-odds-container">
        <p>Which team wins the coin toss</p>
        <div className="sports-card-game-odds">
          <p>
            1<span>1.9</span>
          </p>
          <p>
            2<span>1.9</span>
          </p>
          <span className="sports-card-game-dropdown" onClick={toggleDropdown}>
            {isDropdownOpen ? (
              <MdArrowDropUp className="sports-card-game-dropdown-icon" />
            ) : (
              <MdArrowDropDown className="sports-card-game-dropdown-icon" />
            )}
          </span>
        </div>
      </div>

      <div
        className={`sports-card-game-container-odds-list ${
          isDropdownOpen ? "open" : "closed"
        }`}
      >
        <p>Winner</p>
        <div className="sports-card-game-odds">
          <p>
            Sydney Thunder<span>2.9</span>
          </p>
          <p>
            Hobart Hurricanes<span>1.79</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SportsGameCard;
