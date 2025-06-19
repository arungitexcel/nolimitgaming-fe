import React from "react";
import { FaFutbol } from "react-icons/fa";

const GameOddsDetailsCard = () => {
  return (
    <div className="sports-card-container">
      <p className="sports-card-game-name-Odds-page-heading">
        <FaFutbol /> akdjka
      </p>

      <div className="sports-card-game-name-Odds-page">
        <p
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FaFutbol className="sports-card-game-name-Odds-page-icon" />
          <span>aldsjla</span>
        </p>
        <p className="sports-card-game-name-Odds-page-time">
          <span style={{ color: "grey" }}>Tomorrow</span>
          <span style={{ textAlign: "center", fontSize: "1rem" }}>
            13:45
          </span>{" "}
        </p>
        <p
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FaFutbol className="sports-card-game-name-Odds-page-icon" />
          <span> asdkjal</span>
        </p>
      </div>
    </div>
  );
};

export default GameOddsDetailsCard;
