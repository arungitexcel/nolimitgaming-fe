/** @format */

import React, { useState, useRef, useEffect } from "react";
import GamelistSlider from "../components/GamelistSlider/GamelistSlider";
import BannerCard from "../components/Cards/BannerCard";
import SportsCard from "../components/Cards/SportsCard";
import { LiveSportsCard } from "../components/Cards/LiveSportsCard";
import Slider from "../components/Slider/Slider";
import GamenewListSlider from "../components/GamelistSlider/GamenewListSlider";
import useSWR, { mutate } from "swr";
import { fetchData } from "../api/ClientFunction";
import { useTab } from "../context/TabContext";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { SiTomorrowland } from "react-icons/si";
import SignIn from "../components/Registration/SignIn";
import SignUp from "../components/Registration/SignUp";
import { useNavRoute } from "../context/navRoute";
import { useLocation } from "react-router-dom";
import Loader from "../components/ExchnageUtility/GameUtility/Loader";
import "../Style/Home.css";
import HoverButton from "../components/HoverButton/HoverButton";
import PredictionSlipModal from "../components/PredictionSlipModal/PredictionSlipModal";
import MyPredictions from "../components/MyPredictions/MyPredictions";
import { useTags } from "../context/TagsContext";

const Home = () => {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef([]);
  const { activeTab, setActiveTab, setActiveGameId, activeGameId } = useTab();
  const { activeSlug } = useTags();
  const [gameName, setGameName] = useState("American Football");
  const [gameId, setGameId] = useState("sr:sport:16");
  const [sportsBookData, setSportsData] = useState();
  const [sportsBookUpcomingData, setSportsUpcomingData] = useState();
  const [sportsStatusTab, setSportsStatusTab] = useState("live");
  const location = useLocation();

  const { handleClose, handleOpenLogin, handleOpenSignup, openLogin, openSignUp, setLiveUpcome, isPredictionView } =
    useNavRoute();

  const [slipOpen, setSlipOpen] = useState(false);
  const [slipData, setSlipData] = useState(null);

  const POLYMARKET_KEY = `/sports/polymarket-events?slug=${activeSlug}`;
  const isPredictionRoute = location.pathname.startsWith("/prediction");
  const isMyPredictionsRoute = location.pathname === "/prediction/my";
  const hideOnPrediction = isPredictionRoute;

  const {
    data: polymarketData,
    error: polyError,
    isLoading: polyLoading,
  } = useSWR(isPredictionView && hideOnPrediction ? POLYMARKET_KEY : null, fetchData);

  // Optional: refetch on each click if you want fresh data
  useEffect(() => {
    if (isPredictionView) {
      mutate(POLYMARKET_KEY); // refresh data
    }
  }, [isPredictionView]);

  useEffect(() => {
    const activeTab = tabRefs.current.find((el) => el?.dataset.tab === sportsStatusTab);
    if (activeTab) {
      setUnderlineStyle({
        left: activeTab.offsetLeft + "px",
        width: activeTab.offsetWidth + "px",
      });
    }
    setLiveUpcome(sportsStatusTab);
  }, [sportsStatusTab]);

  const handleStatusTab = (type) => {
    setSportsStatusTab(type);
  };

  // const { data, error, isLoading } = useSWR(
  //   `/sports/book/inplay-events?sportId=${activeGameId}&pageNo=1`,
  //   fetchData,
  //   { refreshInterval: 1000 }
  // );

  // const {
  //   data: UpcomingData,
  //   UpcomingDataerror,
  //   isLoadingUpcomingData,
  // } = useSWR(
  //   `/sports/book/upcoming-events?sportId=${activeGameId}&pageNo=1`,
  //   fetchData,
  //   { refreshInterval: 1000 }
  // );

  // useEffect(() => {
  //   if (data?.sports) {
  //     setSportsData(data.sports);
  //   }
  //   if (UpcomingData?.sports) {
  //     setSportsUpcomingData(UpcomingData.sports);
  //   }
  // }, [data, UpcomingData]);

  const handlegameName = (gname, id) => {
    setGameName(gname);
    setGameId(id);
  };
  // API may return { data: [...] } or a spread object { 0: item, 1: item, ..., success, message }
  const polymarketArray = (() => {
    if (Array.isArray(polymarketData?.data)) return polymarketData.data;
    if (polymarketData && typeof polymarketData === "object" && polymarketData.success) {
      const keys = Object.keys(polymarketData).filter(
        (k) => k !== "success" && k !== "message" && String(Number(k)) === k
      );
      if (keys.length) {
        return keys.sort((a, b) => Number(a) - Number(b)).map((k) => polymarketData[k]);
      }
    }
    return [];
  })();

  if (isPredictionView && polyLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full screen height
          width: "100%",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="homePage_Sportsbook">
      {!hideOnPrediction && <Slider handleOpenLogin={handleOpenLogin} />}

      <div className="home-tab-type">
        {!hideOnPrediction && (
          <div className="livesports-header" style={{ position: "relative" }}>
            <h5
              ref={(el) => (tabRefs.current[0] = el)}
              data-tab="live"
              className={sportsStatusTab === "live" ? "active-tab-type" : ""}
              onClick={() => setSportsStatusTab("live")}
            >
              <MdOutlineOnlinePrediction />
              Live Sports
            </h5>

            <h5
              ref={(el) => (tabRefs.current[1] = el)}
              data-tab="upcoming"
              className={sportsStatusTab === "upcoming" ? "active-tab-type" : ""}
              onClick={() => setSportsStatusTab("upcoming")}
            >
              <SiTomorrowland />
              Upcoming Sports
            </h5>

            {/* Animated underline */}
            <div className="underline" style={underlineStyle}></div>
          </div>
        )}
        {isPredictionView && isPredictionRoute && (
          <>
            {isMyPredictionsRoute ? (
              <MyPredictions />
            ) : (
              <div className="polymarket-wrapper">
                {polymarketArray.map((item, idx) => (
                  <div key={idx} className="polymarket-card">
                    <div className="card-header">
                      <img src={item.image} alt={item.title} />
                      <h4 className="title" title={item.title}>
                        {item.title}
                      </h4>
                      <button className="ai-btn">AI Advisor</button>
                    </div>
                    <div className="market-list">
                      {item.markets.map((market, mIdx) => {
                        const eventTitle = [item.title, market.groupItemTitle].filter(Boolean).join(" — ");
                        return (
                          <div key={mIdx} className="market-row">
                            <span className="market-title">{market.groupItemTitle || "--"}</span>
                            <span className="market-price">{market.price || "--"}</span>
                            <div className="yes-no">
                              <HoverButton
                                market={market}
                                outcome="Yes"
                                eventTitle={eventTitle}
                                onLoginRequired={handleOpenLogin}
                                onPlaceClick={({ market: m, outcome: o, eventTitle: t }) => {
                                  setSlipData({ market: m, outcome: o, eventTitle: t });
                                  setSlipOpen(true);
                                }}
                              />
                              <HoverButton
                                market={market}
                                outcome="No"
                                eventTitle={eventTitle}
                                onLoginRequired={handleOpenLogin}
                                onPlaceClick={({ market: m, outcome: o, eventTitle: t }) => {
                                  setSlipData({ market: m, outcome: o, eventTitle: t });
                                  setSlipOpen(true);
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {slipOpen && slipData && (
              <PredictionSlipModal
                market={slipData.market}
                outcome={slipData.outcome}
                eventTitle={slipData.eventTitle}
                onClose={() => {
                  setSlipOpen(false);
                  setSlipData(null);
                }}
                onSuccess={() => mutate("/user/prediction/my")}
              />
            )}
          </>
        )}
      </div>
      <GamenewListSlider titles="Live/Upcoming" handlegameName={handlegameName} sportsStatusTab={sportsStatusTab} />
      {sportsStatusTab === "live" && (
        <LiveSportsCard
          gameName={gameName}
          gameId={gameId}
          sportsBookData={sportsBookData}
          // isLoading={isLoading}
          // isLoadingUpcomingData={isLoadingUpcomingData}
          handleOpenLogin={handleOpenLogin}
        />
      )}

      {/* <GamenewListSlider titles="Upcoming" handlegameName={handlegameName} /> */}
      {sportsStatusTab === "upcoming" && (
        <LiveSportsCard
          gameName={gameName}
          gameId={gameId}
          sportsBookData={sportsBookUpcomingData}
          // isLoading={isLoading}
          // isLoadingUpcomingData={isLoadingUpcomingData}
          handleOpenLogin={handleOpenLogin}
        />
      )}
      {/* <SportsCard /> */}
    </div>
  );
};

export default Home;
