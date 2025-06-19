import React, { useState } from "react";
import "./BetSlip.css";
import { MdOutlineEventNote } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoFootballOutline } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { useBetSlip } from "../../context/BetSlipContext";
import { PiNotepadFill } from "react-icons/pi";
import { useNavRoute } from "../../context/navRoute";
import { postData, postNormalData } from "../../api/ClientFunction";
import { toast } from "react-toastify";
import { mutate } from "swr";

export const BetSlip = () => {
  const { bets, removeBet, clearBets, openBetSlip, setOpenBetSlip } =
    useBetSlip();
  // console.log(bets);
  const { handleOpenLogin } = useNavRoute();

  const [activeTab, setActiveTab] = useState("Single");
  const [betAmounts, setBetAmounts] = useState({}); // Object to hold bet amounts
  const [errorMessage, setErrorMessage] = useState("");

  const toggleShowBet = () => {
    setOpenBetSlip(!openBetSlip);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle input changes for each bet
  const handleInputChange = (e, index) => {
    let value = parseInt(e.target.value, 10) || 0;
    if (value < 1) value = 1;
    if (value > 5000) value = 5000;

    setBetAmounts((prev) => ({ ...prev, [index]: value }));
  };

  // Handle setting bet amount when clicking predefined values
  const handleAmountClick = (amount, index) => {
    if (amount < 1 || amount > 5000) {
      setErrorMessage("Bet amount must be between 1 and 5000.");
    } else {
      setBetAmounts((prev) => ({ ...prev, [index]: amount }));
      setErrorMessage("");
    }
  };

  //-------------------- Single Bet Placed ---------------------------------
  const handlePlaceBet = async (index, bets) => {
    const betAmount = betAmounts[index] || 5;
    // console.log(bets);

    const marketData = bets?.markets?.matchOdds?.[0];
    // console.log(marketData);

    const runners = marketData?.runners || bets?.runners || [];

    const selectedRunner = runners.find((runner, i) => i === index);

    const betObjects = [
      {
        marketId: marketData?.marketId || bets?.marketId,
        marketName: marketData?.marketName || bets?.marketName,
        runnerId: selectedRunner?.runnerId || "",
        runnerName: selectedRunner?.runnerName || "",
        stake: betAmount,
        sportId: bets?.sportId || "",
        sportName: bets?.sportName || "",
        competitionName: bets?.competitionName || "",
        eventName: bets?.eventName || "",
        eventId: bets?.eventId || "",
        marketType: marketData?.marketType || bets?.marketType || "",
        betOdd: selectedRunner?.backPrices?.[0]?.price || 0,
      },
    ];

    // console.log("Placing bet:", betObjects);

    const response = await postData("/user/placebookbet", {
      bet: betObjects,
    });
    // console.log(response);

    if (response.success) {
      toast.success(response.message);
      mutate(`/user/get-user-info`);
      toggleShowBet();
      clearBets();
    } else {
      toast.error(response.message || "Bet placement failed.");
    }
  };

  //-------------------- Combo Bet Placed ---------------------------------
  const handleMakeBet = () => {
    const betData = bets.map((bet, index) => ({
      ...bet,
      stake: betAmounts[index] || 5,
    }));
    // console.log("Sending batch bets:", betData);
    // Send all bets in one API call...
  };

  return (
    <>
      <div
        className={`betslip-overlay ${
          openBetSlip ? "betslip-overlay-open" : ""
        }`}
        onClick={toggleShowBet}
      ></div>

      <div className={`bet-slip-wrapper ${openBetSlip ? "betslip-open" : ""}`}>
        <div className="bet-slip-box">
          {/* Header */}
          <div className="bet-slip-header" onClick={toggleShowBet}>
            <span>
              <MdOutlineEventNote /> Betslip{" "}
              {openBetSlip ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
            </span>
            <span>{bets.length}</span>
          </div>

          {/* Tab Navigator */}
          <div className="bet-slip-tab-navigator">
            {["Single", "Combo", "System"].map((tab) => (
              <div
                key={tab}
                className={`bet-slip-tab ${
                  activeTab === tab ? "active-tab" : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Bet Place Data */}
          <div className="betplace-container">
            <div className="bet-place-data">
              <div className="bet-odds-placed-card">
                {bets.map((item, index) => (
                  <div key={index} className="bet-odds-placed-card-container">
                    {/* Remove Bet Button */}
                    <div
                      className="bet-odds-placed-card-header"
                      onClick={() => removeBet(index)}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <RxCross2 />
                      </span>
                    </div>

                    <div className="place-bet-indv">
                      {/* Bet Details */}
                      <div className="bet-odds-placed-card-body">
                        <p className="bet-odds-placed-card-body-game-name">
                          {/* <IoFootballOutline style={{ marginRight: ".4rem" }} /> */}
                          {item?.eventName || item?.gameName}
                        </p>
                        <p className="bet-odds-placed-card-body-game-vs">
                          {item?.marketName}
                        </p>
                        {/* <p className="bet-odds-placed-card-body-game-vs-odds">
                          1 X 2
                        </p> */}
                        <p className="bet-odds-placed-card-body-game-vs-price">
                          {
                            item?.markets?.matchOdds?.[0]?.runners[
                              item.selectedOddIndex
                            ]?.backPrices?.[0]?.price
                          }
                          <span>
                            <input
                              type="text"
                              value={betAmounts[index] || 5} // Default amount
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </span>
                        </p>
                      </div>

                      {/* Individual Place Bet Button (Hide in Combo) */}
                      {activeTab === "Single" && (
                        <div
                          className={`indv-placebet-btn ${
                            isLoading || bets.length === 0 ? "disabled" : ""
                          }`}
                          onClick={() => {
                            if (!isLoading && bets.length > 0) {
                              handlePlaceBet(index, item);
                            }
                          }}
                        >
                          {isLoading ? "Placing Bet..." : "Place Bet"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bet Amount Selection */}
              <div className="bet-slip-amount">
                <div className="bet-price-set">
                  {[10, 50, 100, 500].map((amount) => (
                    <p
                      key={amount}
                      onClick={() => handleAmountClick(amount, bets.length - 1)}
                    >
                      {amount}
                    </p>
                  ))}
                </div>
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}

                <div className="bet-min-max-amt">
                  <p>
                    Total Bet{" "}
                    <span>
                      {Object.values(betAmounts).reduce(
                        (acc, val) => acc + val,
                        0
                      )}
                      $
                    </span>
                  </p>
                  <p>
                    Potential Win <span>100$</span>
                  </p>
                </div>
              </div>

              {/* Make Bet Button (Only in Combo Mode) */}
              {activeTab === "Combo" && (
                <div className="bet-slip-make-bet">
                  <button
                    onClick={handleMakeComboBet}
                    disabled={bets.length === 0 || isLoading}
                    className={`bet-button ${
                      bets.length === 0 ? "disabled" : ""
                    } ${isLoading ? "loading" : ""}`}
                  >
                    {isLoading ? "Placing Bet..." : "MAKE BET"}
                  </button>
                </div>
              )}
            </div>

            {/* Settings & Clear Bets */}
            <div className="odds-setting">
              <p className="odds-delete-btn" onClick={() => clearBets()}>
                <RiDeleteBinFill />
              </p>
              <p className="odds-settings-btn">
                <IoSettings /> Odds Settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bet Slip Icon */}
      <div className="bet-slip-icon">
        <div className="no-bet-icon" onClick={toggleShowBet}>
          <span className="bet-slip-count">{bets.length}</span>
          <PiNotepadFill />
        </div>
      </div>
    </>
  );
};
