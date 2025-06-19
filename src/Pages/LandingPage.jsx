import React from "react";
import GamelistSlider from "../components/GamelistSlider/GamelistSlider";
import BannerCard from "../components/Cards/BannerCard";
import SportsCard from "../components/Cards/SportsCard";
import SportsGameCard from "../components/Cards/SportsGameCard";
import { LiveSportsCard } from "../components/Cards/LiveSportsCard";
import Slider from "../components/Slider/Slider";

const LandingPage = () => {
  return (
    <div className="homePage_Sportsbook">
      <Slider />
      {/* <BannerCard /> */}
      <GamelistSlider titles="Live" />
      <LiveSportsCard />
      {/* <GamelistSlider titles="Popular"/> */}
      {/* <SportsGameCard /> */}
      <SportsCard />
    </div>
  );
};

export default LandingPage;
