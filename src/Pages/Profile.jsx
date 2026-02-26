import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Profile.css";
import { Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchKycStatus } from "../api/ClientFunction";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState("");
  const [kycData, setKycData] = useState(null);
  const [kycLoading, setKycLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) {
      setKycLoading(false);
      return;
    }
    let cancelled = false;
    fetchKycStatus(user._id).then((data) => {
      if (!cancelled) {
        setKycData(data);
        setKycLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  const kycStatus =
    !kycData || kycLoading
      ? "pending"
      : kycData.status === "approved"
        ? "approve"
        : kycData.status === "rejected"
          ? "reject"
          : kycData.status === "submitted" || kycData.status === "pending_review"
            ? "reviewing"
            : "pending";

  const showVerifyButton =
    kycStatus !== "approve" && kycStatus !== "reviewing";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 5000);
  };
  const referralLink = `${user?.domain}${user?.inviteCode}/${user?.selfCode}`;
  const selfLink = `${user?.selfCode}`;
  return (
    <div className="profile-container">
      <h3>Profile Page</h3>

      <div className="card profile-card">
        <div className="edit-section">
          <Pencil className="edit-icon" />
        </div>
        <div className="profile-info">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
            alt="Avatar"
            className="avatar"
          />
          <div className="personal-info">
            <span>
              <p>Name </p> <p>{user?.firstname}</p>
            </span>
            <span>
              <p>UserName </p> <p>{user?.username}</p>
            </span>
            <span>
              <p>DOB </p> <p>{user?.dob}</p>
            </span>
            <span>
              <p>Phone </p> <p>{user?.phone}</p>
            </span>
            <span>
              <p>Email </p> <p>{user?.email}</p>
            </span>

            <span>
              <p>User ID</p> <p>{user?._id}</p>
            </span>
            <span>
              <p>Refer Code</p>
              <p>
                <a
                  href={referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {referralLink}
                </a>
                <button
                  onClick={() => copyToClipboard(referralLink)}
                  style={{ marginLeft: "10px" }}
                >
                  📋
                </button>
              </p>
            </span>
            <span>
              <p>Self Code</p>
              <p>
                <a
                  href={selfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {selfLink}
                </a>
                <button
                  onClick={() => copyToClipboard(selfLink)}
                  style={{ marginLeft: "10px" }}
                >
                  📋
                </button>
              </p>
            </span>
          </div>
        </div>
      </div>

      <div className="card kyc-card">
        <h3>KYC Verification</h3>
        <div className="kyc-status-section">
          {kycLoading ? (
            <p className="kyc-loading">Loading...</p>
          ) : (
            <>
              <div
                className={`kyc-status-badge kyc-status-${kycStatus}`}
                title={kycData?.rejectionReason}
              >
                {kycStatus === "approve" && "Verified"}
                {kycStatus === "reject" && "Rejected"}
                {kycStatus === "reviewing" && "Under Review"}
                {(kycStatus === "pending" || !kycData) &&
                  "Verification Pending"}
              </div>
              {kycStatus === "reject" && kycData?.rejectionReason && (
                <p className="kyc-rejection-reason">{kycData.rejectionReason}</p>
              )}
              {kycStatus === "reviewing" && (
                <p className="kyc-reviewing-note">
                  We are reviewing your document. We will let you know once the
                  verification is complete.
                </p>
              )}
              {showVerifyButton && (
                <button
                  className="kyc-verify-btn"
                  onClick={() => navigate("/kyc-verify")}
                >
                  {kycStatus === "reject" ? "Resubmit KYC" : "Verify KYC"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* <div className="card stats-card">
        <h3>📊 Statistics</h3>
        <div className="stats-container">
          <div className="stat-item">
            <p>🏆 Total Wins</p>
            <p>0</p>
          </div>
          <div className="stat-item">
            <p>🎲 Total Bets</p>
            <p>0</p>
          </div>
        </div>
        <div className="wagered-section">
          <p>💰 Total Wagered</p>
          <p>₹0.00</p>
        </div>
      </div>
      <div className="card medals-card">
        <h3>🏅 Medals 0</h3>
        <div className="medals-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="medal"></div>
          ))}
        </div>
      </div>
      <div className="card medals-card">
        <h3>🏅Games</h3>
        <div className="medals-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="medal"></div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Profile;
