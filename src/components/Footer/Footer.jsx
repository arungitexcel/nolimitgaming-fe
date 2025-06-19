import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTelegram, FaReddit, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import "./Footer.css";
import { useAuth } from "../../context/AuthContext";

const socialLinks = [
  { name: "Whatsapp", icon: <IoLogoWhatsapp />, color: "#25D366" },
  { name: "Facebook", icon: <FaFacebook />, color: "#4267B2" },
  { name: "Youtube", icon: <FaYoutube />, color: "#FF0000" },
  { name: "Telegram", icon: <FaTelegram />, color: "#0088cc" },
  { name: "Twitter", icon: <FaSquareXTwitter />, color: "#1DA1F2" },
  { name: "Reddit", icon: <FaReddit />, color: "#FF4500" },
];

const footerSections = [
  {
    title: "Sports Betting",
    links: [
      "Soccer Betting",
      "Football Betting",
      "Tennis Betting",
      "Esports Betting",
    ],
  },
  {
    title: "About NoLimit",
    links: ["B2B Business", "Corporate", "Affiliates", "Press"],
  },
  {
    title: "Policies",
    links: ["Terms & Conditions", "Privacy Policy"],
  },
  {
    title: "Help & Support",
    links: ["Contact Us"],
  },
];

const Footer = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, i) =>
                  typeof link === "object" ? (
                    <li key={i}>
                      <Link to={link.path}>{link.name}</Link>
                    </li>
                  ) : (
                    <li key={i}>{link}</li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        {/* <div className="footer-column social-column">
          <h3>Follow Us</h3>
          <ul className="social-icons">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a href="#" style={{ color: link.color }}>
                  {link.icon} {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Attention Section */}
        <div className="attention-section">
          <div className="attention-content">
            <div className="age-warning">18+</div>
            <span>
              Participation on this gaming site is strictly prohibited for
              players from the U.S.A. and other restricted countries. Software
              Developed by Greenlite Ventures, Inc
            </span>
          </div>
        </div>

        {/* Footer Note */}
      </div>
    </footer>
  );
};

export default Footer;
