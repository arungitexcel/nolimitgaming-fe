import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFutbol } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useBetSlip } from "../../context/BetSlipContext";
import SportsGameCarsLoader from "./SpotsGameCardLoader";

// Custom Hook to detect screen width
const useMediaQuery = (query) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export const LiveSportsCard = ({
  gameName,
  gameId,
  sportsBookData,
  sportsBookUpcomingData,
  isLoading,
  isLoadingUpcomingData,
  handleOpenLogin,
}) => {
  const navigate = useNavigate();
  const { addBet, removeBet, openBetSlip, setOpenBetSlip } = useBetSlip();

  const [selectedOdds, setSelectedOdds] = useState(() => {
    const savedOdds = localStorage.getItem("selectedOdds");
    return savedOdds ? JSON.parse(savedOdds) : [];
  });

  const handleOddSelection = (cardIdx, oddIdx, card) => {
    if (location.pathname === "/signin") {
      handleOpenLogin();
    } else {
      setSelectedOdds((prevState) => {
        const newSelection = { cardIdx, oddIdx };
        const exists = prevState.some(
          (item) => item.cardIdx === cardIdx && item.oddIdx === oddIdx
        );

        let updatedOdds;
        if (exists) {
          updatedOdds = prevState.filter(
            (item) => !(item.cardIdx === cardIdx && item.oddIdx === oddIdx)
          );
          removeBet(oddIdx);
        } else {
          updatedOdds = [...prevState, newSelection];
        }
        localStorage.setItem("selectedOdds", JSON.stringify(updatedOdds));

        return updatedOdds;
      });
      const updatedCard = { ...card, selectedOddIndex: oddIdx };
      addBet(updatedCard);
      setOpenBetSlip(true);
    }
  };

  const handleNavigation = (item) => {
    if (location.pathname === "/signin") {
      handleOpenLogin();
    } else {
      navigate(
        `/gamedetails_odds?eventId=${item?.eventId}&sportsId=${item?.sportId}&gamnename=${item?.competitionName}&min=${item?.markets?.matchOdds?.[0]?.limits?.minBetValue}&max=${item?.markets?.matchOdds?.[0]?.limits?.maxBetValue}`
      );
    }
  };
  
  const openLogin =()=>{
     if(location.pathname==="/signin"){
      handleOpenLogin();
     }
  }

  const isSmallScreen = useMediaQuery("(max-width: 990px)");
  const cardsPerPage = isSmallScreen ? 1 : 2;
  const maxIndex = sportsBookData
    ? Math.max(0, Math.ceil(sportsBookData?.length / cardsPerPage) - 1)
    : 0;

  return (
    <div className="livesports-container">
      <div className="livesports-slider">
        {sportsBookData?.map((card, cardIdx) => (
          <div key={cardIdx} className="livesports-card-container">
            <p className="livesports-card-game-name-Odds-page-heading" onClick={openLogin}>
              <span
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                {card?.eventName} <GoDotFill />
              </span>
              {card?.competitionName}
            </p>

            <div
              className="livesports-card-game-name-Odds-page"
              onClick={() => handleNavigation(card)}
            >
              <p className="teamname-sports">
                <FaFutbol className="livesports-card-game-name-Odds-page-icon" />{" "}
                {card?.markets?.matchOdds?.[0]?.runners?.[0]?.runnerName ||
                  "--"}
              </p>
              <p
                className="teamname-sports"
                style={{ fontWeight: "bold", margin: "0 8px" }}
              >
                {card?.awayScore} : {card?.homeScore}
                <span style={{ fontSize: ".7rem", color: "grey" }}>
                  {card?.status}
                </span>
              </p>
              <p className="teamname-sports">
                <FaFutbol className="livesports-card-game-name-Odds-page-icon" />{" "}
                {card?.markets?.matchOdds?.[0]?.runners?.[1]?.runnerName ||
                  "--"}
              </p>
            </div>

            {/* Check if matchOdds exist before mapping */}
            {card?.markets?.matchOdds?.[0]?.runners?.length > 0 ? (
              <div className="live-sports-fields">
                {card?.markets?.matchOdds?.[0]?.runners?.map((odd, oddIdx) => (
                  <p
                    key={oddIdx}
                    onClick={() => handleOddSelection(cardIdx, oddIdx, card)}
                    className={
                      selectedOdds.some(
                        (item) =>
                          item.cardIdx === cardIdx && item.oddIdx === oddIdx
                      )
                        ? "active"
                        : ""
                    }
                    style={{
                      cursor:
                        odd?.backPrices?.[0]?.price === "-"
                          ? "not-allowed"
                          : "pointer",
                      pointerEvents:
                        odd?.backPrices?.[0]?.price === "-" ? "none" : "auto",
                    }}
                  >
                    {odd?.backPrices?.[0]?.price || "-"}
                    <span>{odd?.backPrices?.[0]?.size || "-"}</span>
                  </p>
                ))}
              </div>
            ) : (
              <div className="live-sports-fields">
                <p>
                  --<span>--</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loading and No Data States */}
      {isLoading ? (
        sportsBookData?.length === 0 && <SportsGameCarsLoader />
      ) : sportsBookData?.length === 0 ? (
        <div className="datanotfound">
          <img
            src="https://bc.co/assets/common/empty.png"
            alt="No Data Found"
          />
          <p>Oops! There is no data yet!</p>
        </div>
      ) : null}

      {isLoadingUpcomingData ? (
        sportsBookUpcomingData?.length === 0 && (
          <div className="cardloading">
            <div className="cardelement phonehideload"></div>
            <div className="cardelement"></div>
          </div>
        )
      ) : sportsBookUpcomingData?.length === 0 ? (
        <div className="datanotfound">
          <img
            src="https://bc.co/assets/common/empty.png"
            alt="No Data Found"
          />
          <p>Oops! There is no data yet!</p>
        </div>
      ) : null}
    </div>
  );
};
