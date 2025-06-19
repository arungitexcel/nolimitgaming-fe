import React, { useEffect, useState } from "react";
import "../Style/GameOddsDetails.css";
import GameDetailOddsDropdown from "../components/Cards/GameDetailOddsDropdown";
import GameOddsDetailsCard from "../components/Cards/GameOddsDetailsCard";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import { fetchData } from "../api/ClientFunction";
import GamenewListSlider from "../components/GamelistSlider/GamenewListSlider";
import GameDetailsCardLoader from "../components/Cards/GameDetailsCardLoader";
import { array } from "yup";

const GameOddsDetails = () => {
  const [activeItem, setActiveItem] = useState("ALL");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = ["English", "Spanish", "French", "German", "Chinese"];
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get("eventId");
  const [matchData, steMatchData] = useState("");
  const sportId = searchParams.get("sportsId");
  const gameName = searchParams.get("gamnename");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const [indvSport, setIndvSport] = useState([]);

  const { data, error, isLoading } = useSWR(
    `/sports/book/list-market?sportId=${sportId}&eventId=${eventId}`,
    fetchData,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (data && data?.event?.markets?.premiumMarkets) {
      setIndvSport(data?.event?.markets?.premiumMarkets);
    }
  }, [data]);

  useEffect(() => {
    steMatchData(data?.event);
  }, [data]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  const groupedMarkets = matchData?.markets?.premiumMarkets?.reduce(
    (acc, market) => {
      const { marketName } = market;

      if (!marketName) return acc; // Skip if marketName is undefined

      if (!acc[marketName]) {
        acc[marketName] = []; // Initialize an array for this marketName
      }

      acc[marketName].push(market); // Push the market data into the corresponding group
      return acc;
    },
    {}
  );

  const allMarketName = [
    ...new Set(
      matchData?.markets?.premiumMarkets
        ?.map((item) => item?.marketName)
        .filter(Boolean) || []
    ),
  ];

  return (
    <div
      style={{
        color: "#fff",
        padding: "20px 20px",
      }}
    >
      <GamenewListSlider titles="Live/Upcoming" />

      <div className="gamename-header">
        <h2 className="gamename">{gameName}</h2>
        <div className="min-max">
          <span className="min">Min: {min}</span>
          <span className="min">Max: {max}</span>
        </div>
      </div>

      {/* <GameOddsDetailsCard /> */}
      <div className="gameodds_details_header_items">
        <ul>
          {["ALL"].map((item, index) => (
            <li
              key={index}
              className={activeItem === item ? "active" : ""}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {isLoading && (
        <div>
          {[1, 2, 3, 5, 6].map((item, index) => (
            <GameDetailsCardLoader key={index} />
          ))}
        </div>
      )}
      {error && (
        <div className="datanotfound">
          <img
            src="https://bc.co/assets/common/empty.png"
            alt="No Data Found"
          />
          <p>Oops! There is no data yet!</p>
        </div>
      )}
      {allMarketName.map((item, index) => (
        <GameDetailOddsDropdown data={groupedMarkets[item]} fullData={data}/>
      ))}

      {/*ODDS Format DropDown */}
      {/* <div className="odds_format_dropdown">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p className="odds-format-heading">ODDS FORMAT</p>
          <div className="odds_format_language-dropdown">
            <div
              className="odds_format_dropdown-header"
              onClick={toggleDropdown}
            >
              <p className="lang">{selectedLanguage}</p>
              <span className="odds_format_dropdown-icon">
                {isOpen ? "▲" : "▼"}
              </span>
            </div>
            {isOpen && (
              <ul className="odds_format_dropdown-menu">
                {languages.map((language, index) => (
                  <li
                    key={index}
                    className={`odds_format_dropdown-item ${
                      selectedLanguage === language ? "active" : ""
                    }`}
                    onClick={() => selectLanguage(language)}
                  >
                    {language}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="odds-format-desc">
          Although every effort is made to ensure data displayed on our site is
          accurate, this data is for information purposes and should be used as
          a guide only. In the event of any particular information being
          incorrect, we assume no liability for it.
        </p>
      </div> */}
    </div>
  );
};

export default GameOddsDetails;
