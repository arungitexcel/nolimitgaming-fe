import React, { useState, useEffect } from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useBetSlip } from "../../context/BetSlipContext";

const GameDetailOddsDropdown = ({ data, fullData }) => {
  const [openDropdowns, setOpenDropdowns] = useState(true);
  const [activeItems, setActiveItems] = useState({});
  const { addBet, removeBet, setOpenBetSlip } = useBetSlip();

  // useEffect(() => {
  //   if (indvSport) {
  //     const initialState = indvSport.reduce((acc, _, index) => {
  //       acc[index] = true;
  //       return acc;
  //     }, {});
  //     setOpenDropdowns(initialState);
  //   }
  // }, [indvSport]);


  const toggleDropdown = () => {
     setOpenDropdowns(!openDropdowns)
  };

  const handleOddSelection = (cardIdx, oddIdx, card) => {
    setActiveItems((prev) => ({
      ...prev,
      [cardIdx]: prev[cardIdx] === oddIdx ? removeBet(oddIdx) : oddIdx, // Toggle active state
    }));

    const updatedCard = {
      ...card,
      selectedOddIndex: oddIdx,
      competitionName: fullData?.event?.competitionName,
      eventId: fullData?.event?.eventId,
      sportId: fullData?.event?.sportId,
      eventName: fullData?.event?.eventName,
      sportName: fullData?.event?.sportName,
    };

    addBet(updatedCard);
    setOpenBetSlip(true);
  };

const isOpen = openDropdowns ?? true;

  return (
    <div style={{margin:"6px 0px"}}>
      <p style={{display:"flex",fontSize:"12px",fontWeight:"600",marginBottom:"5px"}}>
        {data[0]?.marketName}
        <span
          className="sports-details-odds-dropdown"
          onClick={toggleDropdown}
        >
          {openDropdowns ? (
            <MdArrowDropUp className="sports-details-odds-dropdown-icon" />
          ) : (
            <MdArrowDropDown className="sports-details-odds-dropdown-icon" />
          )}
        </span>
      </p>
      {data?.map((item, dropdownIndex) => {
       
        return (
          <div className="sports-details-odds-container" key={dropdownIndex}>
            {openDropdowns && (
              <div
                className={`sports-details-odds-game-odds ${
                  item?.runners?.length > 0 ? "multi-column" : "single-column"
                }`}
              >
                {item?.runners?.map((runner, itemIndex) => {
                  const hasOdds = runner.backPrices?.[0]?.price !== undefined;
                  const isActive = activeItems[dropdownIndex] === itemIndex;

                  return (
                    <div key={itemIndex} className="odds-item">
                      <p
                        className={`Odds-dropdown-item ${
                          isActive ? "active" : ""
                        } ${!hasOdds ? "locked" : ""}`}
                        onClick={() =>
                          hasOdds &&
                          handleOddSelection(dropdownIndex, itemIndex, item)
                        }
                      >
                        {hasOdds ? (
                          <>
                            {runner?.runnerName}
                            <span>{runner.backPrices?.[0]?.price}</span>
                          </>
                        ) : (
                          <FaLock className="lock-icon" />
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameDetailOddsDropdown;
