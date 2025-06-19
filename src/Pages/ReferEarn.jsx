import { useState } from "react";
import { Copy, Check } from "lucide-react";
import "../Style/ReferEarn.css";
import { useAuth } from "../context/AuthContext";

const ReferEarn = () => {
  const { user } = useAuth();
  const referralCode = user?.selfCode;
  const referralLink = `${user?.domain}${user?.inviteCode}/${user?.selfCode}`;
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container">
      <h3>Refer & Earn</h3>
      <div className="toprefer">
        <div className="refer-content">
          <h1>Refer & Earn</h1>
          <p className="subtitle">Invite friends & earn amazing rewards!</p>
        </div>

        <img
          src="https://www.shoppre.com/img/refer-and-earn/refer-and-earn-shoppre-shipping.png"
          alt="Refer & Earn"
          className="image"
        />
      </div>

      <div className="card">
        <p className="section-title">Your Referral Code</p>
        <div className="copy-box">
          <span className="code-text">{referralCode}</span>
          <button
            onClick={() => copyToClipboard(referralCode, "code")}
            className="copy-btn"
          >
            {copied === "code" ? (
              <Check className="icon" />
            ) : (
              <Copy className="icon" />
            )}
          </button>
        </div>

        <p className="section-title">Your Referral Link</p>
        <div className="copy-box">
          <span className="truncate code-text">{referralLink}</span>
          <button
            onClick={() => copyToClipboard(referralLink, "link")}
            className="copy-btn"
          >
            {copied === "link" ? (
              <Check className="icon" />
            ) : (
              <Copy className="icon" />
            )}
          </button>
        </div>

        <button className="share-button">Share & Earn</button>
      </div>
      <p className="referPara">
        "Invite your friends to join and unlock exciting rewards! Every referral
        brings you closer to exclusive perks. Start sharing now and enjoy the
        benefits!"
      </p>
    </div>
  );
};
export default ReferEarn;
