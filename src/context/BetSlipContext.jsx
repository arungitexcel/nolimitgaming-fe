import React, { createContext, useContext, useState } from "react";

const BetSlipContext = createContext();
// Custom hook to use BetSlip context
export const useBetSlip = () => useContext(BetSlipContext);

// BetSlip Provider
export const BetSlipProvider = ({ children }) => {
  const [bets, setBets] = useState([]);
// console.log("bets", bets)
  // Add a new bet to the slip

  const addBet = (bet,oddIdx) => {
    setBets((prevBets) => [...prevBets, bet]);
  };
  const [openBetSlip,setOpenBetSlip]=useState(false);


  // Remove a bet from the slip
  const removeBet = (betId) => {
    setBets((prevBets) => prevBets.filter((bet,index) => index !== betId));
  };

  // Clear all bets
  const clearBets = () => {
    setBets([]);
  };

  return (
    <BetSlipContext.Provider value={{ bets, addBet, removeBet, clearBets , openBetSlip,setOpenBetSlip}}>
      {children}
    </BetSlipContext.Provider>
  );
};
