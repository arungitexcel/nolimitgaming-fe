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
  const [offset, setOffset] = useState(0);
  const [allPolymarketData, setAllPolymarketData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const polymarketWrapperRef = useRef(null);

  const { handleClose, handleOpenLogin, handleOpenSignup, openLogin, openSignUp, setLiveUpcome, isPredictionView } =
    useNavRoute();

  const POLYMARKET_KEY = `/sports/polymarket-events?slug=${activeSlug}&offset=${offset}`;
  const hideOnPrediction = location.pathname === "/prediction";

  const {
    data: polymarketData,
    error: polyError,
    isLoading: polyLoading,
  } = useSWR(isPredictionView && hideOnPrediction ? POLYMARKET_KEY : null, fetchData);

  // Handle infinite scroll
  useEffect(() => {
    if (polymarketData) {
      const newData = Object.entries(polymarketData)
        .filter(([key]) => !isNaN(key))
        .map(([, value]) => value);

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setAllPolymarketData((prev) => [...prev, ...newData]);
      }
    }
  }, [polymarketData]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!polymarketWrapperRef.current || polyLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = polymarketWrapperRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setOffset((prev) => prev + 20);
      }
    };

    const wrapper = polymarketWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("scroll", handleScroll);
      return () => wrapper.removeEventListener("scroll", handleScroll);
    }
  }, [polyLoading, hasMore]);

  // Reset when slug changes
  useEffect(() => {
    setAllPolymarketData([]);
    setOffset(0);
    setHasMore(true);
  }, [activeSlug]);

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

  const handlegameName = (gname, id) => {
    setGameName(gname);
    setGameId(id);
  };

  if (isPredictionView && polyLoading && allPolymarketData.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
        {isPredictionView && location.pathname === "/prediction" && (
          <div
            className="polymarket-wrapper"
            ref={polymarketWrapperRef}
            style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
          >
            {allPolymarketData.map((item, idx) => (
              <div key={`${idx}-${item.id || idx}`} className="polymarket-card">
                <div className="card-header">
                  <img src={item.image} alt={item.title} />
                  <h4 className="title" title={item.title}>
                    {item.title}
                  </h4>
                  <button className="ai-btn">AI Advisor</button>
                </div>
                <div className="market-list">
                  {item.markets?.map((market, mIdx) => {
                    return (
                      <div key={mIdx} className="market-row">
                        <span className="market-title">{market.groupItemTitle || "--"}</span>
                        <span className="market-price">{market.price || "--"}</span>
                        <div className="yes-no">
                          <HoverButton market={market} outcome="Yes" />
                          <HoverButton market={market} outcome="No" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {polyLoading && allPolymarketData.length > 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
                <Loader />
              </div>
            )}
            {!hasMore && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#aaa" }}>
                No more records to load
              </div>
            )}
          </div>
        )}
      </div>
      <GamenewListSlider titles="Live/Upcoming" handlegameName={handlegameName} sportsStatusTab={sportsStatusTab} />
      {sportsStatusTab === "live" && (
        <LiveSportsCard
          gameName={gameName}
          gameId={gameId}
          sportsBookData={sportsBookData}
          handleOpenLogin={handleOpenLogin}
        />
      )}
      {sportsStatusTab === "upcoming" && (
        <LiveSportsCard
          gameName={gameName}
          gameId={gameId}
          sportsBookData={sportsBookUpcomingData}
          handleOpenLogin={handleOpenLogin}
        />
      )}
    </div>
  );
};

export default Home;
