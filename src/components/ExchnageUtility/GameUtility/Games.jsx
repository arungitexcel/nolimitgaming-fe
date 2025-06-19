import React, { useState, useEffect } from "react";
import "./GameUtility.css"; // Import the CSS file for styles
import { MdLiveTv } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  formatDateToRelative,
  formatDateToUTC,
} from "../../../api/ClientFunction";
import { useNavRoute } from "../../../context/navRoute";
import { useAuth } from "../../../context/AuthContext";
import BettingTable from "../BettingTable";

function OddsContainer({ marketId, oddsSports }) {
  const { handleOpenLogin } = useNavRoute();
  const filteredOdds =
    oddsSports?.data?.find((item) => item?.marketId === marketId)?.runners ||
    [];
  const teamOne = filteredOdds?.length > 0 ? filteredOdds[0] : [];
  const teamTwo = filteredOdds?.length > 1 ? filteredOdds[1] : [];
  const draw = filteredOdds?.length > 2 ? filteredOdds[2] : [];

  const { isLogin } = useAuth();
  const openLogin = () => {
    if (!isLogin) {
      handleOpenLogin();
    }
  };
  return (
    <>
      <div className="game_name_odds">
        <div className="game_name_odds-value">
          <p onClick={openLogin}>
            {teamOne?.ex?.availableToBack[0]?.price || "-"}
            <span> {teamOne?.ex?.availableToBack[0]?.size || "-"}</span>
          </p>
          <p onClick={openLogin}>
            {teamOne?.ex?.availableToLay[0]?.price || "-"}
            <span> {teamOne?.ex?.availableToLay[0]?.size || "-"}</span>
          </p>
        </div>
        <div className="game_name_odds-value">
          <p onClick={openLogin}>
            {draw?.ex?.availableToBack[0]?.price || "-"}
            <span> {draw?.ex?.availableToBack[0]?.size || "-"}</span>
          </p>
          <p onClick={openLogin}>
            {draw?.ex?.availableToLay[0]?.price || "-"}
            <span> {draw?.ex?.availableToLay[0]?.size || "-"}</span>
          </p>
        </div>
        <div className="game_name_odds-value">
          <p onClick={openLogin}>
            {teamTwo?.ex?.availableToBack[0]?.price || "-"}
            <span> {teamTwo?.ex?.availableToBack[0]?.size || "-"}</span>
          </p>
          <p onClick={openLogin}>
            {teamTwo?.ex?.availableToLay[0]?.price || "-"}
            <span> {teamTwo?.ex?.availableToLay[0]?.size || "-"}</span>
          </p>
        </div>
      </div>
    </>
  );
}
const Games = ({ sportsData, gametype }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("InPlay");
  const { handleOpenLogin, activeNavRoute } = useNavRoute();

  const openLogin = () => {
    if (location.pathname === "/signin") {
      handleOpenLogin();
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setStatus((prev) => (prev === "InPlay" ? "OutPlay" : "InPlay"));
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  // const filterSportData =
  //   gametype === "Basketball"
  //     ? sportsData?.filter((game) => game?.name === "NBA")
  //     : sportsData;

  return (
    <>
      {sportsData?.markets?.length > 0 ? (
        <>
          <h1 style={{ marginLeft: 10 }}>
            {sportsData.markets[0].leagueLabel}
          </h1>

          <BettingTable sportsData={sportsData?.markets} />
        </>
      ) : (
        <div className="datanotfound">
          <img
            src="https://bc.co/assets/common/empty.png"
            alt="No Data Found"
          />
          <p>Oops! There is no data yet!</p>
        </div>
      )}
    </>
  );
};
export default Games;
