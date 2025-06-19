import React from "react";
import "./Cards.css";
import adv_bg from "../../assets/adv_bg.webp";
import authbg from "../../assets/authbgs.png";

const BannerCard = () => {
  return (
    <div className="banner_container">
      <div className="im_container">
        <div>
          <img className="im_3" src={adv_bg} alt="" />
        </div>

        <div className="im_2container">
          <img className="im_2" src={authbg} alt="" />
        </div>
      </div>
      <div className="banner_details">
        <h1>Stay Untamed</h1>
        <div>
          <p>Sign Up & Get</p>
          <h3>
            UP TO <span>&20,000.00</span>{" "}
          </h3>
          <p>In Casino or Sports</p>
        </div>
        <button className="banner_btn">Join Now</button>
      </div>
    </div>
  );
};

export default BannerCard;
