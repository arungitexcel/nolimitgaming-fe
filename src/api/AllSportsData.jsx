import useSWR from "swr";
import { PiBoxingGloveFill, PiCricketBold } from "react-icons/pi";
import { FaTableTennis } from "react-icons/fa";
import { MdSportsMartialArts } from "react-icons/md";
import { CiBasketball } from "react-icons/ci";
import { GiTennisRacket } from "react-icons/gi";
import { FaBaseball, FaPeopleGroup, FaConfluence } from "react-icons/fa6";
import { RiBoxingLine } from "react-icons/ri"; // ✅ MISSING IMPORT FIXED
import { fetchData } from "./ClientFunction";

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

export const useMultipleSports = () => {
  return games
    .filter((game) => game.sportId)
    .map((game) => ({
      ...game,
      ...useSWR(
        `/sports/book/inplay-events?sportId=${game.sportId}&pageNo=1`,
        fetchData,
        {
          refreshInterval: 1000,
        }
      ),
    }));
};

export const useMultipleUpSports = () => {
  return games
    .filter((game) => game.sportId)
    .map((game) => ({
      ...game,
      ...useSWR(
        `/sports/book/upcoming-events?sportId=${game.sportId}&pageNo=1`,
        fetchData,
        {
          refreshInterval: 1000,
        }
      ),
    }));
};
