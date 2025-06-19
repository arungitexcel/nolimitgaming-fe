import React from "react";

const SportsGameCarsLoader = () => {
  return (
    <div className="livesports-container">
      <div className="livesports-slider">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="livesports-card-container " style={{ padding: "15px" }}>
            <p className="livesports-card-game-name-Odds-page-heading" style={{ margin: "5px" }}>
              <span className="skeleton-text shimmer" style={{ width: "140px", height: "8px" }}></span>
              <span className="skeleton-text shimmer" style={{ width: "140px", height: "8px" }}></span>
            </p>
            <span className="timedate skeleton-text shimmer" style={{ width: "100px", height: "8px" }}></span>
            <div className="livesports-card-game-name-Odds-page" style={{ padding: "5px 0" }}>
              <p className="skeleton-text shimmer" style={{ width: "120px", height: "20px", borderRadius: "8px" }}></p>
              <p className="skeleton-text shimmer" style={{ width: "120px", height: "20px", borderRadius: "8px" }}></p>
            </div>
            <div className="type-game-bet skeleton-text shimmer" style={{ width: "150px", height: "10px" }}></div>
            <div className="live-sports-fields">
              {[...Array(2)].map((_, oddIdx) => (
                <p key={oddIdx} className="skeleton-text shimmer" style={{ width: "50%", height: "30px" }}>
                  <span className="skeleton-text shimmer" style={{ width: "50%", height: "30px" }}></span>
                </p>
              ))}
              <div className="open-all-bet skeleton-icon shimmer" style={{ width: "30px", height: "30px" }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsGameCarsLoader;
