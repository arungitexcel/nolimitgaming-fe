import React, { useEffect, useState } from "react";
import GamelistSlider from "../components/GamelistSlider/GamelistSlider";
import Game from "../components/ExchnageUtility/GameUtility/Games";
import Slider from "../components/Slider/Slider";
import GamenewListSlider from "../components/GamelistSlider/GamenewListSlider";
import { fetchData } from "../api/ClientFunction";
import useSWR from "swr";
import { useTab } from "../context/TabContext";
import Loader from "../components/ExchnageUtility/GameUtility/Loader";

const Exchange = () => {
  const [gametype, setGametype] = useState("Tennis");
  const [sportsData, setSportsData] = useState([]);

  const [game, setgame] = useState("NFL");
  const { activeGameId, activeLeagueId } = useTab();

  const handlegameName = (gname) => {
    setGametype(gname);
  };

  const getSingleSportsData = async (game) => {
    setgame(game);
  };

  const marketUrl =
    activeGameId == null
      ? null
      : activeGameId === 3
        ? "/sports/get-mlb-market"
        : `/sports/get-active-market?sportIds=${activeGameId}&pageSize=50${activeLeagueId != null ? `&leagueId=${activeLeagueId}` : ""}`;
  const { data, error, isLoading } = useSWR(activeGameId != null ? marketUrl : null, fetchData);

  useEffect(() => {
    if (data) {
      setSportsData(data.markets);
    }

    if (error) {
      console.error("Error fetching sports data:", error);
    }
  }, [data, error]);

  // const { data, error } = useSWR(
  //   gametype ? `/sports/get-allmatch-by-sportname?sport=${game}` : null,
  //   fetchData,
  //   { refreshInterval: 1000 }
  // );
  // const { data: indvSportsData, indvSportsDataerror } = useSWR(
  //   gametype ? `/sports/get-odds-by-sportname?sport=${gametype}` : null,
  //   fetchData,
  //   { refreshInterval: 5000 }
  // );

  useEffect(() => {
    getSingleSportsData(gametype);
  }, [gametype]);

  useEffect(() => {
    if (data && data?.data) {
      setSportsData(data?.data);
    }
  }, [data]);

  return (
    <div
      style={{
        color: "#fff",
        padding: "8px 5px",
      }}
    >
      <Slider />
      {/* <GamelistSlider titles={"Live"} /> */}
      <GamelistSlider titles={"Live"} handlegameName={handlegameName} />
      <p className="exchange_page_container_header">
        No Limit Sports Betting Exchanges
      </p>

      {isLoading ? (
        <Loader />
      ) : sportsData && sportsData?.markets?.length > 0 ? (
        <div className="game_exchange_odds_container">
          <Game sportsData={sportsData} gametype={gametype} />
        </div>
      ) : (
        <div className="datanotfound">
          <img
            src="https://bc.co/assets/common/empty.png"
            alt="No Data Found"
          />
          <p>Oops! There is no data yet!</p>
        </div>
      )}
    </div>
  );
};

export default Exchange;
