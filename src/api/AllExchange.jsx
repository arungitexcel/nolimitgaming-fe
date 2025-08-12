/** @format */

import useSWR from "swr";
import { PiBoxingGloveFill, PiCricketBold } from "react-icons/pi";
import { BiSolidCricketBall } from "react-icons/bi";
import { IoIosFootball } from "react-icons/io";
import { FaTableTennis } from "react-icons/fa";
import { MdOutlineOnlinePrediction, MdSportsKabaddi, MdSportsMartialArts } from "react-icons/md";
import { CiBasketball } from "react-icons/ci";
import { FaBaseball, FaPeopleGroup, FaConfluence } from "react-icons/fa6";
import { TbOlympics, TbPlayVolleyball } from "react-icons/tb";
import { FaCrown } from "react-icons/fa";
import { fetchData } from "./ClientFunction";
import { useLocation } from "react-router-dom";

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

// export const useMultipleExchSport = () => {
//   return games
//     .filter((game) => game.name)
//     .map((game) => ({
//       ...game,
//       ...useSWR(
//         `/sports/get-allmatch-by-sportname?sport=${game.name}`,
//         fetchData
//       ),
//     }));
// };
export const useAllSports = () => {
  const location = useLocation();
  const shouldFetch = location.pathname !== "/prediction";
  return {
    ...useSWR(shouldFetch ? "/sports/get-all-sports" : null, fetchData),
  };
};

//  export const useMultipleUpSports = () => {
//   return games
//     .filter((game) => game.name)
//     .map((game) => ({
//        ...game,
//       ...useSWR(
//         `/sports/book/upcoming-events?sportId=${game.name}&pageNo=1`,
//         fetchData,
//         {
//           refreshInterval: 1000,
//         }
//       ),
//     }));
// };
