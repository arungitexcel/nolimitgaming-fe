import React from "react";

const GameCard = () => {
  return (
    <>
      <div className="game_card_container">
        <div className="image-container">
          <img
            src="https://media.istockphoto.com/id/952007312/vector/card-games-flat-design-western-icon.jpg?b=1&s=170x170&k=20&c=HJyvzQPy86MuzO3BnLPqkx4jKx0mK4su6XRV-rYHSeM="
            alt="Game"
          />
          <div className="game_card_info">
            <p>Poker</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;
