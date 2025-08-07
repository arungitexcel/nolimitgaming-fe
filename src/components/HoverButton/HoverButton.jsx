import React, { useState } from "react";

const HoverButton = ({ market, outcome }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getOutcomePrice = (market, outcome) =>
        market.prices?.find(p => p.outcome === outcome)?.price ?? "—";

    return (
        <button
            className={outcome.toLowerCase()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered ? getOutcomePrice(market, outcome) : outcome}
        </button>
    );
};

export default HoverButton;
