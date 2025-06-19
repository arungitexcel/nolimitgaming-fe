import React from 'react';
import "./Gameskelton.css"
const GameListSkelton = () => {
  return (
    <div className="gamelist-slider">
   
        {[...Array(5)].map((_, index) => (
          <li key={index} className="skeleton-item">
            <span className="skeleton-icon"></span>
            <span className="skeleton-text"></span>
          </li>
        ))}
     
    </div>
  );
}

export default GameListSkelton;
