import React, { useEffect, useState } from "react";
import { PiBoxingGloveFill, PiCricketBold } from "react-icons/pi";
import { BiSolidCricketBall } from "react-icons/bi";
import { IoIosFootball } from "react-icons/io";
import { FaTableTennis } from "react-icons/fa";
import { MdSportsKabaddi, MdSportsMartialArts } from "react-icons/md";
import { CiBasketball } from "react-icons/ci";
import { GiTennisRacket } from "react-icons/gi";
import { FaBaseball, FaPeopleGroup, FaConfluence } from "react-icons/fa6";
import { TbOlympics, TbPlayVolleyball } from "react-icons/tb";
import { FaCrown } from "react-icons/fa";
import "./GamelistSlider.css";
import { useNavRoute } from "../../context/navRoute";
import { RiBoxingLine } from "react-icons/ri";
import { useTab } from "../../context/TabContext";
import { useNavigate } from "react-router-dom";
// import {
//   useMultipleSports,
//   useMultipleUpSports,
// } from "../../api/AllSportsData";

const GamenewListSlider = ({
  titles,
  getSingleSportsOdds,
  handlegameName,
  sportsStatusTab,
}) => {
  const { activeTab, setActiveTab, setActiveGameId } = useTab();
  const [activeGame, setActiveGame] = useState("cricket");

  const navigate = useNavigate();

  // const sports = useMultipleSports();
  // const upSports = useMultipleUpSports();

  // const filteredSports = sports
  //   .filter((game) => game?.data?.sports?.length > 0)
  //   .map((game) => game?.visibleName);

  // const filteredUpSports = upSports
  //   .filter((game) => game?.data?.sports?.length > 0)
  //   .map((game) => game?.visibleName);

  // const activeGameNames =
  //   sportsStatusTab === "live" ? filteredSports : filteredUpSports;
  const { activeNavRoute } = useNavRoute();

  const title = {
    heading: `${titles}`,
    heading1: "Live",
    icon: <FaCrown />,
    color: "goldenrod",
  };

  // List of games with respective icons
  const games = [
    {
      name: "American Football",
      visibleName: "NFL",
      sportId: "sr:sport:16",
      icon: <FaConfluence />,
    },
    {
      name: "Basketball",
      visibleName: "NBA",
      sportId: "sr:sport:2",
      icon: <CiBasketball />,
    },
    {
      name: "Baseball",
      visibleName: "Baseball",
      sportId: "sr:sport:3",
      icon: <CiBasketball />,
    },
    {
      name: "Volleyball",
      visibleName: "Volleyball",
      sportId: "sr:sport:23",
      icon: <CiBasketball />,
    },
    {
      name: "Ice Hockey",
      visibleName: "NHL",
      sportId: "sr:sport:4",
      icon: <FaPeopleGroup />,
    },
    {
      name: "Mixed Martial Arts",
      visibleName: "MMA",
      sportId: "sr:sport:117",
      icon: <MdSportsMartialArts />,
    },
    { name: "Boxing", visibleName: "Boxing", icon: <PiBoxingGloveFill /> },
    {
      name: "Table Tennis",
      visibleName: "Table Tennis",
      sportId: "sr:sport:20",
      icon: <FaTableTennis />,
    },
    {
      name: "Tennis",
      visibleName: "Tennis",
      sportId: "sr:sport:5",
      icon: <FaTableTennis />,
    },
    {
      name: "Cricket",
      visibleName: "Cricket",
      sportId: "sr:sport:21",
      icon: <PiCricketBold />,
      route: "/",
    },
    {
      name: "Soccer",
      visibleName: "Football",
      sportId: "sr:sport:1",
      icon: <CiBasketball />,
    },
    {
      name: "Kabaddi",
      visibleName: "Kabaddi",
      sportId: "sr:sport:138",
      icon: <RiBoxingLine />,
    },
    {
      name: "Rugby",
      visibleName: "Rugby",
      sportId: "sr:sport:12",
      icon: <RiBoxingLine />,
    },
    {
      name: "Badminton",
      visibleName: "Badminton",
      sportId: "sr:sport:31",
      icon: <GiTennisRacket />,
    },
    {
      name: "Darts",
      visibleName: "Darts",
      sportId: "sr:sport:22",
      icon: <FaBaseball />,
    },
    {
      name: "Snooker",
      visibleName: "Snooker",
      sportId: "sr:sport:19",
      icon: <FaTableTennis />,
    },
    {
      name: "Futsal",
      visibleName: "Futsal",
      sportId: "sr:sport:29",
      icon: <FaBaseball />,
    },
  ];

  // const handleClick = (game) => {
  //   setActiveGame(game);
  // };
  useEffect(() => {
    if (activeNavRoute) {
      setActiveTab(activeNavRoute);
      // setActiveGame(activeNavRoute);
      // handlegameName();
    }
  }, [activeNavRoute]);

  const handleClick = (game, index, id) => {
    if (location.pathname != "/home" && location.pathname != "/signin") {
      navigate("/home");
    }
    // setActiveGame(game);
    setActiveTab(game);
    setActiveGameId(id);

    // handlegameName(game, id);
    // getSingleSportsOdds(game);

    // Get the parent container and all list items
    const sliderContainer = document.querySelector(".gamelist-slider");
    const listItems = document.querySelectorAll(".gamelist-slider ul li");

    // Ensure the selected item is within bounds and calculate the scroll position
    if (sliderContainer && listItems[index]) {
      const itemWidth = listItems[index].offsetWidth;
      const itemOffsetLeft = listItems[index].offsetLeft;
      const sliderWidth = sliderContainer.offsetWidth;

      // Calculate the target position to ensure it starts with the second item
      let targetScroll = itemOffsetLeft - itemWidth;

      // Adjust to ensure it doesn’t scroll out of bounds
      if (targetScroll < 0) targetScroll = 0;
      if (targetScroll + sliderWidth > sliderContainer.scrollWidth) {
        targetScroll = sliderContainer.scrollWidth - sliderWidth;
      }

      // Scroll the container to the target position
      sliderContainer.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <h2
        style={{ padding: "5px 0px", fontWeight: "500", marginTop: ".4rem" }}
      ></h2>
      <div className="gamelist-slider">
        <ul>
          {/* {games
            .filter((game) => activeGameNames.includes(game.visibleName))
            .map((game, index) => (
              <li
                key={game.name}
                className={activeTab === game.name ? "active" : ""}
                onClick={() => handleClick(game.name, index, game.sportId)}
              >
                <span className="icons">{game.icon}</span> {game.visibleName}
              </li>
            ))} */}
        </ul>
      </div>
    </>
  );
};

export default GamenewListSlider;
