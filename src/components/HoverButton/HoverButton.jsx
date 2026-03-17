import React, { useState } from "react";

const HoverButton = ({ market, outcome, eventTitle, onLoginRequired, onPlaceClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getOutcomePrice = (m, o) =>
    m?.prices?.find((p) => p.outcome === o)?.price ?? "—";

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      onLoginRequired?.();
      return;
    }
    onPlaceClick?.({ market, outcome, eventTitle });
  };

  return (
    <button
      className={outcome.toLowerCase()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {isHovered ? getOutcomePrice(market, outcome) : outcome}
    </button>
  );
};

export default HoverButton;
