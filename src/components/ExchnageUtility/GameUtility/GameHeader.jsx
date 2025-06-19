import React from "react";
import "./GameUtility.css";

const GameHeader = () => {
  return (
    <div className="game-header">
      {/* Container for Header */}
      <div className="game-header-container">
        {/* Left-Aligned "Game" */}
        <div className="game-title">Game</div>

        {/* Right-Aligned Items */}
        <div className="game-options">
          <p className="game-option">1</p>
          <p className="game-option">X</p>
          <p className="game-option">2</p>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
