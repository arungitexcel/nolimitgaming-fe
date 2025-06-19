import React, { useState } from "react";
import "./BetSlip.css";
import "./BetSlipPopup.css"
import { MdOutlineEventNote } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoFootballOutline } from "react-icons/io5";
import { MdOutlineLiveTv } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { RiDeleteBinFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { RiRobot3Fill } from "react-icons/ri";
import { useBetSlip } from "../../context/BetSlipContext";

const BetSlipPopup = () => {
  const [activeTab, setActiveTab] = useState("Single");
  const [betAmount, setBetAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);

  const { bets, removeBet, clearBets } = useBetSlip();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAmountClick = (amount) => {
    if (amount < 1 || amount > 5000) {
      setErrorMessage("Bet amount must be between 0 and 2000.");
    } else {
      setBetAmount(amount);
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value < 1 || value > 5000) {
      setErrorMessage("Bet amount must be between 0 and 2000.");
    } else {
      setBetAmount(value);
      setErrorMessage("");
    }
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <>
      <button className="toggle-popup-button" onClick={togglePopup}>
        Open Bet Slip
      </button>
      <div className={`bet-slip-box ${isPopupVisible ? "show" : ""}`}>
        <div className="bet-slip-header">
          <MdOutlineEventNote />
          <p>
            Betslip <span>1</span>
          </p>
        </div>

        <div className="bet-slip-tab-navigator">
          <div
            className={`bet-slip-tab ${activeTab === "Single" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("Single")}
          >
            Single
          </div>
          <div
            className={`bet-slip-tab ${activeTab === "Express" ? "active-tab" : ""}`}
            onClick={() => handleTabClick("Express")}
          >
            Express
          </div>
        </div>

        {/* Bet Slip Card */}
        <div className="bet-odds-placed-card">
          {bets.map((item, index) => (
            <div key={index} className="bet-odds-placed-card-container">
              <div className="bet-odds-placed-card-header" onClick={() => removeBet(index)}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <RxCross2 />
                </span>
              </div>

              <div className="bet-odds-placed-card-body">
                <p className="bet-odds-placed-card-body-game-name">
                  <span>
                    <IoFootballOutline style={{ marginRight: ".4rem" }} />
                    {item?.teams[0].name}
                  </span>
                  <p className="ai-robo">
                    <span>
                      <RiRobot3Fill />
                    </span>
                  </p>
                </p>
                <p className="bet-odds-placed-card-body-game-vs">
                  {item?.teams[0].name} <span>vs</span> {item?.teams[1].name}
                </p>
                <p className="bet-odds-placed-card-body-game-vs-odds">1 X 2</p>
                <p className="bet-odds-placed-card-body-game-vs-price">
                  {item.odd}
                  <span>
                    50 <FaIndianRupeeSign />
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bet-slip-card">
          <div>
            <p className="game-slip-name">
              Bonus Odds <span>1</span>
            </p>
            <p className="game-slip-odds">
              Total Odds <span style={{ color: "greenyellow" }}>1</span>
            </p>
            <p className="game-slip-odds">
              Total Possible win <span>0. 00</span>
            </p>
          </div>
        </div>

        <div className="bet-slip-amount">
          <h5>Bet amount</h5>
          <div>
            <div className="bet-input-field">
              <input type="number" value={betAmount} onChange={handleInputChange} />
              <span>USD</span>
            </div>
            <div className="bet-price-set">
              {[200, 500, 2000, 5000].map((amount) => (
                <p
                  key={amount}
                  onClick={() => handleAmountClick(amount)}
                  className={amount <= 5000 ? "" : "disabled"}
                >
                  {amount}
                </p>
              ))}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="bet-min-max-amt">
              <p>
                Min. Bet amount <span>1.00</span>
              </p>
              <p>
                Max. Bet amount <span>5000.00</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bet-slip-make-bet">
          <div className="custom-checkbox-container">
            <label className="custom-checkbox-label">
              <input type="checkbox" className="custom-checkbox" />
              <span className="custom-checkbox-text">
                If not exchanged by another user, the bet goes to the sportsbook at its odds.
              </span>
            </label>
          </div>
          <button>MAKE BET</button>
        </div>

        <div className="odds-setting">
          <p className="odds-delete-btn" onClick={() => clearBets()}>
            <RiDeleteBinFill />
          </p>

          <p className="odds-settings-btn">
            <IoSettings />
            Odds Settings
          </p>
        </div>
      </div>
    </>
  );
};

export default BetSlipPopup;
