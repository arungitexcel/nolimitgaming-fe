import React, { useState, useEffect } from "react";
import { PiBoxingGloveFill, PiCricketBold } from "react-icons/pi";
import { BiSolidCricketBall } from "react-icons/bi";
import { IoIosFootball } from "react-icons/io";
import { FaTableTennis } from "react-icons/fa";
import {
  MdOutlineOnlinePrediction,
  MdSportsKabaddi,
  MdSportsMartialArts,
} from "react-icons/md";
import { CiBasketball } from "react-icons/ci";
import { FaBaseball, FaPeopleGroup, FaConfluence } from "react-icons/fa6";
import { TbOlympics, TbPlayVolleyball } from "react-icons/tb";
import { FaCrown } from "react-icons/fa";
import "./GamelistSlider.css";
import { useNavRoute } from "../../context/navRoute";
// import { useMultipleExchSport } from "../../api/AllExchange";

const GamelistSlider = ({ titles, handlegameName }) => {
  const { activeNavRoute } = useNavRoute();
  const [activeGame, setActiveGame] = useState("Tennis");

  const title = {
    heading: `${titles}`,
    heading1: "Live",
    icon: <FaCrown />,
    color: "goldenrod",
  };

  // const activeExchSport = useMultipleExchSport();
  // const filteredExchSport = activeExchSport
  //   .filter((game) => game?.data?.data?.length > 0)
  //   .map((game) => game?.visibleName);

  const games = [
    { name: "American Football", visibleName: "NFL", icon: <FaConfluence /> },
    { name: "Basketball", visibleName: "NBA", icon: <CiBasketball /> },
    { name: "Boxing", visibleName: "Boxing", icon: <PiBoxingGloveFill /> },
    { name: "Tennis", visibleName: "Tennis", icon: <FaTableTennis /> },
    { name: "Cricket", visibleName: "Cricket", icon: <PiCricketBold /> },
    { name: "Soccer", visibleName: "Football", icon: <CiBasketball /> },
    { name: "Darts", visibleName: "Darts", icon: <FaBaseball /> },
    { name: "Snooker", visibleName: "Snooker", icon: <FaTableTennis /> },
  ];

  // Sync activeGame with activeNavRoute whenever activeNavRoute changes
  useEffect(() => {
    if (activeNavRoute) {
      setActiveGame(activeNavRoute);
      handlegameName(activeNavRoute);
    }
  }, [activeNavRoute]);

  const handleClick = (game, index) => {
    setActiveGame(game);
    handlegameName(game);

    // Get the parent container and all list items
    const sliderContainer = document.querySelector(".gamelist-slider");
    const listItems = document.querySelectorAll(".gamelist-slider ul li");

    if (sliderContainer && listItems[index]) {
      const itemWidth = listItems[index].offsetWidth;
      const itemOffsetLeft = listItems[index].offsetLeft;
      const sliderWidth = sliderContainer.offsetWidth;

      let targetScroll = itemOffsetLeft - itemWidth;
      if (targetScroll < 0) targetScroll = 0;
      if (targetScroll + sliderWidth > sliderContainer.scrollWidth) {
        targetScroll = sliderContainer.scrollWidth - sliderWidth;
      }

      sliderContainer.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <h2
        style={{
          padding: "10px 0px",
          fontSize: "22px",
          fontWeight: "500",
          marginTop: ".4rem",
          color: "lightgreen",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>
          <MdOutlineOnlinePrediction />
        </span>
        {title.heading}
      </h2>
      <div className="gamelist-slider">
        <ul>
          {/* {games
            .filter((game) => filteredExchSport.includes(game.visibleName))
            .map((game, index) => (
              <li
                key={game.name}
                className={activeGame === game.name ? "active" : ""}
                onClick={() => handleClick(game.name, index)}
              >
                <span className="icons">{game.icon}</span> {game.visibleName}
              </li>
            ))} */}
        </ul>
      </div>
    </>
  );
};

export default GamelistSlider;
