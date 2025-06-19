import React from "react";
import { FaFutbol } from "react-icons/fa";
import sportstrophy from "../../assets/sportstrophy.webp";
const SportsCard = () => {
  return (
    <div className="sports_card_container">
      <div>
        <h2 className="sports_heading">
          <FaFutbol className="sports_icon" /> Sports
        </h2>
        <div className="sports_details">
          <p>
            Experience the thrill of betting on Football, Cricket, NFL, eSports,
            and over 80+ exciting sports!
            <strong> Your gateway to action-packed games starts here.</strong>
          </p>
          <button className="sports-btn"> Play Now</button>
        </div>
      </div>
      <div className="sports-im">
        <img src={sportstrophy} alt="" />
      </div>
    </div>
  );
};

export default SportsCard;
