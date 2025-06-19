import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/ExchangeOddDetails.css";
// import GamelistSlider from "./GamelistSlider/GamelistSlider";
import { MdConnectedTv } from "react-icons/md";
import useSWR from "swr";
// import BetModal from "./BetModal"
import { fetchData, formatDateToUTC } from "../api/ClientFunction";
import { useBetSlip } from "../context/BetSlipContext";


const ExchangeOddDetails = () => {
  const { addBet } = useBetSlip();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedBet, setSelectedBet] = useState(null);
  const [selectedOdds, setSelectedOdds] = useState({});

  const navigat = useNavigate();
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betModalData, setBetModalData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("scoreboard");
  const location = useLocation();

  const [details, setDetails] = useState({
    marketId: "",
    eventId: "",
    time: "",
    marketName: "",
    matchName: "",
    sportsName: "",
  });

  const [matchOdds, setMatchOdds] = useState([]);
  const teamOne = matchOdds[0];
  const teamTwo = matchOdds[1];
  const draw = matchOdds[2];
  const [fancySportsMakerData, setFancySportsMakerData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [wpXtra, setWpXtra] = useState([]);
  const [oddEven, setOddEven] = useState([]);
  const [fancydata, setFancyData] = useState([]);

  const bookMaker = fancySportsMakerData?.bookMaker || [];
  const fancy = fancySportsMakerData?.fancy || [];
  const [modaldata, setModalData] = useState(null);

  useEffect(() => {
    if (fancy) {
      const allFancy = fancy;
      setSessions(allFancy.filter((item) => item?.catagory === "SESSIONS"));
      setWpXtra(allFancy.filter((item) => item?.catagory === "W/P/XTRA"));
      setOddEven(allFancy.filter((item) => item?.catagory === "ODD_EVEN"));
      setFancyData(allFancy.filter((item) => item?.catagory === "FANCY"));
    }
  }, [fancy]);

  // console.log("teamOne", teamOne);
  // console.log("teamTwo", teamTwo);
  // console.log("draw", draw);
  // console.log("bookemaker", bookMaker);
  // console.log("wptra", wpXtra);
  // console.log("sessions", sessions);
  // console.log("oddEven", oddEven);
  // console.log("fancydata", fancydata);
  // console.log("fancy", fancy);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setDetails({
      marketId: searchParams.get("marketId") || "",
      eventId: searchParams.get("eventId") || "",
      time: searchParams.get("time") || "",
      marketName: searchParams.get("marketName") || "",
      matchName: searchParams.get("matchName") || "",
      sportsName: searchParams.get("sportsName") || "",
    });
  }, [location]);

  // Live TV API
  const { data: liveTV, error: liveTVError } = useSWR(
    details?.eventId ? `/sports/live-tv?eventId=${details?.eventId}` : null,
    fetchData
  );

  // Live ScoreBoard API
  const { data, error } = useSWR(
    details?.eventId ? `/sports/live-score?eventId=${details?.eventId}` : null,
    fetchData
  );

  // Match ODDS API
  const { data: indvSportsData } = useSWR(
    details?.marketId ? `/sports/get-odds?marketId=${details?.marketId}` : null,
    fetchData,
    { refreshInterval: 1000 }
  );

  // Match Fancy Sprots data API
  const { data: fancySportsData } = useSWR(
    details?.marketId
      ? `/sports/bookmaker-fancy-session?eventId=${details?.eventId}`
      : null,
    fetchData,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (indvSportsData) {
      setMatchOdds(indvSportsData?.data[0]?.runners);
    }
    if (fancySportsData) {
      setFancySportsMakerData(fancySportsData?.data);
    }
  }, [indvSportsData, fancySportsData, setFancySportsMakerData]);

  const toggleLiveTv = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle bet Modal Popup
  const handleBetModalOpen = (details) => {
    addBet(details);
  };

  return (
    <>
      <div className="exchange-odds-details-container">
        {/* <GamelistSlider titles={"Sports Betting Exchange"} /> */}
        {/* LIVE TV */}
        <div className="live_tv_container">
          <div className="live_tv_header" onClick={toggleLiveTv}>
            <p>
              {details?.marketName} <MdConnectedTv />
            </p>
            <span>{formatDateToUTC(details?.time || "")}</span>
          </div>
          <div
            className="live_tv"
            style={{
              height: isExpanded ? "200px" : "0",
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            {liveTV?.data ? (
              <iframe
                src={liveTV.data}
                frameBorder="0"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.4rem",
                }}
              ></iframe>
            ) : (
              <p>Live stream is not available.</p>
            )}
          </div>
        </div>

        {/* LIVE MATCH SCOREBOARD */}
        <div className="live_match_scoreboard">
          {data?.data ? (
            <iframe
              src={data?.data}
              frameBorder="0"
              style={{ width: "100%", height: "100%", borderRadius: "0.4rem" }}
            ></iframe>
          ) : (
            <div className="loading-message">Scoreboard is loading...</div>
          )}
        </div>

        <div className="exchange_odds_container_box">
          {/* MATCH ODD */}
          <div className="exchange_match_odds">
            <div className="exchange_match_title">MATCH OODS</div>
            <div className="exchange_odds_consider">
              <div className="exchange_match_header">
                <p>Back</p>
                <p style={{ width: "170px" }} className="p3"></p> <p>Lay</p>
              </div>
              {/* Country1 */}
              <div className="exchange_match_game">
                <div className="exchange_match_game_title">
                  <div className="exchange_match_game_name">
                    <p>{details?.marketName.split("v")[0]}</p>
                  </div>
                  <div className="exchange_match_game_name_odds_container">
                    <div className="exchange_match_game_name_odds">
                      {/* Back */}
                      <div className="exchange_match_game_odds_type1">
                        <p style={{ backgroundColor: "#57acd2" }}>
                          {teamOne?.ex?.availableToBack[2]?.price || "-"}{" "}
                          <span>
                            {teamOne?.ex?.availableToBack[2]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                        <p style={{ backgroundColor: "#57acd2" }}>
                          {teamOne?.ex?.availableToBack[1]?.price || "-"}{" "}
                          <span>
                            {teamOne?.ex?.availableToBack[1]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                      </div>
                      {/* Draw */}
                      <div className="exchange_match_game_odds_type2">
                        <p
                          style={{ backgroundColor: "#66D1FF" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: teamOne?.ex?.availableToBack[0]?.price,
                              betType: "Back",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[0],
                              sport: details?.sportsName,
                              type: "Match_Odds",
                            })
                          }
                        >
                          {teamOne?.ex?.availableToBack[0]?.price || "-"}
                          <span>
                            {teamOne?.ex?.availableToBack[0]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                        <p
                          style={{ backgroundColor: "#FF7C99" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: teamOne?.ex?.availableToLay[0]?.price,
                              betType: "Lay",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[1],
                              sport: details?.sportsName,
                              type: "Match_Odds",
                            })
                          }
                        >
                          {teamOne?.ex?.availableToLay[0]?.price || "-"}{" "}
                          <span>
                            {teamOne?.ex?.availableToLay[0]?.size || "-"}{" "}
                          </span>
                        </p>
                      </div>
                      {/* Lay */}
                      <div className="exchange_match_game_odds_type3">
                        <p style={{ backgroundColor: "#D16880" }}>
                          {teamOne?.ex?.availableToLay[1]?.price || "-"}{" "}
                          <span>
                            {teamOne?.ex?.availableToLay[1]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                        <p style={{ backgroundColor: "#D16880" }}>
                          {teamOne?.ex?.availableToLay[2]?.price || "-"}{" "}
                          <span>
                            {teamOne?.ex?.availableToLay[2]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Country2 */}
              <div className="exchange_match_game">
                <div className="exchange_match_game_title">
                  <div className="exchange_match_game_name">
                    <p> {details?.marketName.split("v")[1]}</p>
                  </div>
                  <div className="exchange_match_game_name_odds_container">
                    <div className="exchange_match_game_name_odds">
                      {/* Back */}
                      <div className="exchange_match_game_odds_type1">
                        <p style={{ backgroundColor: "#57acd2" }}>
                          {teamTwo?.ex?.availableToBack[2]?.price || "-"}{" "}
                          <span>
                            {teamTwo?.ex?.availableToBack[2]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                        <p style={{ backgroundColor: "#57acd2" }}>
                          {teamTwo?.ex?.availableToBack[1]?.price || "-"}{" "}
                          <span>
                            {teamTwo?.ex?.availableToBack[1]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                      </div>
                      {/* Draw */}
                      <div className="exchange_match_game_odds_type2">
                        <p
                          style={{ backgroundColor: "#66D1FF" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: teamOne?.ex?.availableToBack[0]?.price,
                              betType: "back",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[0],
                              sport: details?.sportsName,
                              type: "Match_Odds",
                            })
                          }
                        >
                          {teamTwo?.ex?.availableToBack[0]?.price || "-"}
                          <span>
                            {teamTwo?.ex?.availableToBack[0]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                        <p
                          style={{ backgroundColor: "#FF7C99" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: teamOne?.ex?.availableToLay[0]?.price,
                              betType: "Lay",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[1],
                              sport: details?.sportsName,
                              type: "Match_Odds",
                            })
                          }
                        >
                          {teamTwo?.ex?.availableToLay[0]?.price || "-"}{" "}
                          <span>
                            {teamTwo?.ex?.availableToLay[0]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                      </div>
                      {/* Lay */}
                      <div className="exchange_match_game_odds_type3">
                        <p style={{ backgroundColor: "#D16880" }}>
                          {teamTwo?.ex?.availableToLay[1]?.price || "-"}{" "}
                          <span>
                            {teamTwo?.ex?.availableToLay[1]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                        <p style={{ backgroundColor: "#D16880" }}>
                          {teamTwo?.ex?.availableToLay[2]?.price || "-"}{" "}
                          <span>
                            {teamTwo?.ex?.availableToLay[2]?.size || "-"}{" "}
                          </span>
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Draw */}
              {matchOdds?.length > 2 ? (
                <>
                  <div className="exchange_match_game">
                    <div className="exchange_match_game_title">
                      <div className="exchange_match_game_name">
                        <p>Draw</p>
                      </div>
                      <div className="exchange_match_game_name_odds_container">
                        <div className="exchange_match_game_name_odds">
                          {/* Back */}
                          <div className="exchange_match_game_odds_type1">
                            <p style={{ backgroundColor: "#57acd2" }}>
                              {draw?.ex?.availableToBack[2]?.price || "-"}{" "}
                              <span>
                                {draw?.ex?.availableToBack[2]?.size || "-"}{" "}
                              </span>
                            </p>{" "}
                            <p style={{ backgroundColor: "#57acd2" }}>
                              {draw?.ex?.availableToBack[1]?.price || "-"}{" "}
                              <span>
                                {draw?.ex?.availableToBack[1]?.size || "-"}{" "}
                              </span>
                            </p>{" "}
                          </div>
                          {/* Draw */}
                          <div className="exchange_match_game_odds_type2">
                            <p
                              style={{ backgroundColor: "#66D1FF" }}
                              onClick={() =>
                                handleBetModalOpen({
                                  marketId: details?.marketId,
                                  eventId: details?.eventId,
                                  selectionId: teamOne?.selectionId,
                                  betOdd:
                                    teamOne?.ex?.availableToBack[0]?.price,
                                  betType: "back",
                                  matchName: details?.marketName,
                                  teamName: "draw",
                                  sport: details?.sportsName,
                                  type: "Match_Odds",
                                })
                              }
                            >
                              {draw?.ex?.availableToBack[0]?.price || "-"}
                              <span>
                                {draw?.ex?.availableToBack[0]?.size || "-"}{" "}
                              </span>
                            </p>{" "}
                            <p
                              style={{ backgroundColor: "#FF7C99" }}
                              onClick={() =>
                                handleBetModalOpen({
                                  marketId: details?.marketId,
                                  eventId: details?.eventId,
                                  selectionId: teamOne?.selectionId,
                                  betOdd: teamOne?.ex?.availableToLay[0]?.price,
                                  betType: "Lay",
                                  matchName: details?.marketName,
                                  teamName: "draw",
                                  sport: details?.sportsName,
                                  type: "Match_Odds",
                                })
                              }
                            >
                              {draw?.ex?.availableToLay[0]?.price || "-"}{" "}
                              <span>
                                {draw?.ex?.availableToLay[0]?.size || "-"}{" "}
                              </span>
                            </p>{" "}
                          </div>
                          {/* Lay */}
                          <div className="exchange_match_game_odds_type3">
                            <p style={{ backgroundColor: "#D16880" }}>
                              {draw?.ex?.availableToLay[1]?.price || "-"}{" "}
                              <span>
                                {draw?.ex?.availableToLay[1]?.size || "-"}{" "}
                              </span>
                            </p>{" "}
                            <p style={{ backgroundColor: "#D16880" }}>
                              {draw?.ex?.availableToLay[2]?.price || "-"}{" "}
                              <span>
                                {draw?.ex?.availableToLay[2]?.size || "-"}{" "}
                              </span>
                            </p>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* BOOKMAKER */}
          <div className="exchange_match_odds">
            <div className="exchange_match_title">BOOKMAKER</div>
            <div className="exchange_odds_consider">
              <div className="session-exchange_match_header">
                <p>Back</p>
                <p>Lay</p>
              </div>
              {/* Country1 */}
              <div className="exchange_match_game">
                <div className="exchange_match_game_title">
                  <div className="exchange_match_game_name">
                    <p className="truncate-text">
                      {bookMaker[0]?.selectionName}
                    </p>
                  </div>
                  <div className="exchange_match_game_name_odds_container">
                    <div className={`exchange_match_game_name_odds `}>
                      <div className="exchange_match_game_odds_type2">
                        <p
                          style={{ backgroundColor: "#66D1FF" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: bookMaker[0]?.backOdds,
                              betType: "Back",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[0],
                              sport: details?.sportsName,
                              type: "BOOKMAKER",
                            })
                          }
                        >
                          {bookMaker[0]?.backOdds || "-"}
                        </p>
                        <p
                          style={{ backgroundColor: "#FF7C99" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: bookMaker[0]?.layOdds,
                              betType: "LAY",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[0],
                              sport: details?.sportsName,
                              type: "BOOKMAKER",
                            })
                          }
                        >
                          {bookMaker[0]?.layOdds || "-"}
                        </p>
                        {["SUSPEND", "BALL RUN"].includes(
                          bookMaker[0]?.selectionStatus
                        ) || "-" ? (
                          <>
                            <div className="animation-blur">
                              <p>{bookMaker[0]?.selectionStatus}</p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Country2 */}
              <div className="exchange_match_game">
                <div className="exchange_match_game_title">
                  <div className="exchange_match_game_name">
                    <p>{bookMaker[1]?.selectionName}</p>
                  </div>
                  <div className="exchange_match_game_name_odds_container">
                    <div className="exchange_match_game_name_odds">
                      <div className="exchange_match_game_odds_type2">
                        <p
                          style={{ backgroundColor: "#66D1FF" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: bookMaker[0]?.backOdds,
                              betType: "Back",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[0],
                              sport: details?.sportsName,
                              type: "BOOKMAKER",
                            })
                          }
                        >
                          {" "}
                          {bookMaker[1]?.backOdds || "-"}
                        </p>{" "}
                        <p
                          style={{ backgroundColor: "#FF7C99" }}
                          onClick={() =>
                            handleBetModalOpen({
                              marketId: details?.marketId,
                              eventId: details?.eventId,
                              selectionId: teamOne?.selectionId,
                              betOdd: bookMaker[1]?.layOdds,
                              betType: "Back",
                              matchName: details?.marketName,
                              teamName: details?.marketName.split("v")[0],
                              sport: details?.sportsName,
                              type: "BOOKMAKER",
                            })
                          }
                        >
                          {" "}
                          {bookMaker[1]?.layOdds || "-"}
                        </p>
                        {["SUSPEND", "BALL RUN"].includes(
                          bookMaker[1]?.selectionStatus
                        ) || "-" ? (
                          <>
                            <div className="animation-blur">
                              <p>{bookMaker[1]?.selectionStatus}</p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Draw */}
              {bookMaker?.length > 2 ? (
                <>
                  <div className="exchange_match_game">
                    <div className="exchange_match_game_title">
                      <div className="exchange_match_game_name">
                        <p>{bookMaker[2]?.selectionName}</p>
                      </div>
                      <div className="exchange_match_game_name_odds_container">
                        <div className="exchange_match_game_name_odds">
                          <div className="exchange_match_game_odds_type2">
                            <p
                              style={{ backgroundColor: "#66D1FF" }}
                              onClick={() =>
                                handleBetModalOpen({
                                  marketId: details?.marketId,
                                  eventId: details?.eventId,
                                  selectionId: teamOne?.selectionId,
                                  betOdd: bookMaker[2]?.backOdds,
                                  betType: "Back",
                                  matchName: details?.marketName,
                                  teamName: details?.marketName.split("v")[0],
                                  sport: details?.sportsName,
                                  type: "BOOKMAKER",
                                })
                              }
                            >
                              {" "}
                              {bookMaker[2]?.backOdds || "-"}
                            </p>{" "}
                            <p
                              style={{ backgroundColor: "#FF7C99" }}
                              onClick={() =>
                                handleBetModalOpen({
                                  marketId: details?.marketId,
                                  eventId: details?.eventId,
                                  selectionId: teamOne?.selectionId,
                                  betOdd: bookMaker[2]?.layOdds,
                                  betType: "Back",
                                  matchName: details?.marketName,
                                  teamName: details?.marketName.split("v")[0],
                                  sport: details?.sportsName,
                                  type: "BOOKMAKER",
                                })
                              }
                            >
                              {" "}
                              {bookMaker[2]?.layOdds || "-"}
                            </p>
                            {["SUSPEND", "BALL RUN"].includes(
                              bookMaker[2]?.selectionStatus
                            ) || "-" ? (
                              <>
                                <div className="animation-blur">
                                  <p>{bookMaker[2]?.selectionStatus}</p>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* WPXTRA */}
          {wpXtra && wpXtra?.length > 0 ? (
            <>
              {" "}
              <div className="exchange_match_odds">
                <div className="exchange_match_title">W/P/XTRA</div>
                <div className="exchange_odds_consider">
                  <div className="session-exchange_match_header">
                    <p>Yes</p>
                    <p>No</p>
                  </div>
                  {/* Country1 */}
                  {wpXtra.map((item, index) => (
                    <div
                      className="exchange_match_game"
                      key={item?.id || index}
                    >
                      <div className="exchange_match_game_title">
                        <div className="exchange_match_game_name">
                          <p className="truncate-text">
                            {item?.marketName || "No Name"}
                          </p>
                        </div>
                        <div className="exchange_match_game_name_odds_container">
                          <div className="exchange_match_game_name_odds">
                            <div className="exchange_match_game_odds_type2">
                              <p
                                style={{ backgroundColor: "#66D1FF" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsNo,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "W/P/XTRA",
                                  })
                                }
                              >
                                {item?.oddsNo || "-"}
                              </p>
                              <p
                                style={{ backgroundColor: "#FF7C99" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsYes,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "W/P/XTRA",
                                  })
                                }
                              >
                                {item?.oddsYes || "-"}
                              </p>
                              {["SUSPEND", "BALL RUN"].includes(
                                item?.statusName
                              ) || "-" ? (
                                <>
                                  <div className="animation-blur">
                                    <p>{item?.statusName}</p>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* SESSION */}
          {sessions && sessions?.length > 0 ? (
            <>
              <div className="exchange_match_odds">
                <div className="exchange_match_title">SESSION</div>
                <div className="exchange_odds_consider">
                  <div className="session-exchange_match_header">
                    <p>Yes</p>
                    <p>No</p>
                  </div>
                  {/* Country1 */}
                  {sessions.map((item, index) => (
                    <div
                      className="exchange_match_game"
                      key={item?.id || index}
                    >
                      <div className="exchange_match_game_title">
                        <div className="exchange_match_game_name">
                          <p className="truncate-text">
                            {item?.marketName || "No Name"}
                          </p>
                        </div>
                        <div className="exchange_match_game_name_odds_container">
                          <div className="exchange_match_game_name_odds">
                            <div className="exchange_match_game_odds_type2">
                              <p
                                style={{ backgroundColor: "#66D1FF" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsNo,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "SESSION",
                                  })
                                }
                              >
                                {item?.oddsNo || "-"}
                              </p>
                              <p
                                style={{ backgroundColor: "#FF7C99" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsYes,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "SESSION",
                                  })
                                }
                              >
                                {item?.oddsYes || "-"}
                              </p>
                              {["SUSPEND", "BALL RUN"].includes(
                                item?.statusName
                              ) || "-" ? (
                                <>
                                  <div className="animation-blur">
                                    <p>{item?.statusName}</p>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* Fancy */}
          {fancydata && fancydata?.length > 0 ? (
            <>
              <div className="exchange_match_odds">
                <div className="exchange_match_title">FANCY</div>
                <div className="exchange_odds_consider">
                  <div className="session-exchange_match_header">
                    <p>Yes</p>
                    <p>No</p>
                  </div>
                  {/* Country1 */}
                  {fancydata.map((item, index) => (
                    <div
                      className="exchange_match_game"
                      key={item?.id || index}
                    >
                      <div className="exchange_match_game_title">
                        <div className="exchange_match_game_name">
                          <p className="truncate-text">
                            {item?.marketName || "No Name"}
                          </p>
                        </div>
                        <div className="exchange_match_game_name_odds_container">
                          <div className="exchange_match_game_name_odds">
                            <div className="exchange_match_game_odds_type2">
                              <p
                                style={{ backgroundColor: "#66D1FF" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsNo,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "fancy",
                                  })
                                }
                              >
                                {item?.oddsNo || "-"}
                              </p>
                              <p
                                style={{ backgroundColor: "#FF7C99" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsYes,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "fancy",
                                  })
                                }
                              >
                                {item?.oddsYes || "-"}
                              </p>
                              {["SUSPEND", "BALL RUN"].includes(
                                item?.statusName
                              ) || "-" ? (
                                <>
                                  <div className="animation-blur">
                                    <p>{item?.statusName}</p>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* ODD_EVEN */}
          {oddEven && oddEven?.length > 0 ? (
            <>
              <div className="exchange_match_odds">
                <div className="exchange_match_title">ODD_EVEN</div>
                <div className="exchange_odds_consider">
                  <div className="session-exchange_match_header">
                    <p>Yes</p>
                    <p>No</p>
                  </div>
                  {/* Country1 */}
                  {oddEven.map((item, index) => (
                    <div
                      className="exchange_match_game"
                      key={item?.id || index}
                    >
                      <div className="exchange_match_game_title">
                        <div className="exchange_match_game_name">
                          <p className="truncate-text">
                            {item?.marketName || "No Name"}
                          </p>
                        </div>
                        <div className="exchange_match_game_name_odds_container">
                          <div className="exchange_match_game_name_odds">
                            <div className="exchange_match_game_odds_type2">
                              <p
                                style={{ backgroundColor: "#66D1FF" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsNo,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "ODD_EVEN",
                                  })
                                }
                              >
                                {item?.oddsNo || "-"}
                              </p>
                              <p
                                style={{ backgroundColor: "#FF7C99" }}
                                onClick={() =>
                                  handleBetModalOpen({
                                    marketId: details?.marketId,
                                    eventId: details?.eventId,
                                    selectionId: teamOne?.selectionId,
                                    betOdd: item?.oddsYes,
                                    betType: "Back",
                                    matchName: details?.marketName,
                                    teamName: details?.marketName.split("v")[0],
                                    sport: details?.sportsName,
                                    type: "ODD_EVEN",
                                  })
                                }
                              >
                                {item?.oddsYes || "-"}
                              </p>
                              {["SUSPEND", "BALL RUN"].includes(
                                item?.statusName
                              ) || "-" ? (
                                <>
                                  <div className="animation-blur">
                                    <p>{item?.statusName}</p>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {betModalOpen && (
        <BetModel
          betModalOpen={betModalOpen}
          handleBetModalClose={handleBetModalClose}
          betModalData={betModalData}
        />
      )}
    </>
  );
};

export default ExchangeOddDetails;
