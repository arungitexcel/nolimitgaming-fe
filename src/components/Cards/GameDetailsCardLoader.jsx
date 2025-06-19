import React, { useState } from "react";
import "./GameDetailsCardLoader.css"

const GameDetailsCardLoader = () => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className="winner-container ">
      <div className="winner-header">
        <span className="arrow skeleton-icon" ></span>
      </div>
        <div className="winner-options">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className={`team-option skeleton-text ${activeItem === index ? "active" : ""}`}         
            >
              <span className="team-name " style={{ height: "22px" }}></span>
              <span className="teamodds " style={{ height: "21px" }}></span>
            </div>
          ))}
        </div>
     
    </div>
  );
};

export default GameDetailsCardLoader;
