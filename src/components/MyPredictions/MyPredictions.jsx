/** @format */

import React from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../api/ClientFunction";
import Loader from "../ExchnageUtility/GameUtility/Loader";
import "./MyPredictions.css";

// Lists user's Polymarket predictions (PENDING/WON/LOST). Only fetches when logged in.
const MyPredictions = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { data, isLoading } = useSWR(
    token ? "/user/prediction/my?limit=20" : null,
    fetchData,
    { refreshInterval: 30000 }
  );

  const entries = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (!token) {
    return (
      <div className="my-predictions-section">
        <h4 className="my-predictions-title">My Predictions</h4>
        <p className="my-predictions-login">Sign in to view your predictions</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-predictions-section">
        <h4 className="my-predictions-title">My Predictions</h4>
        <div className="my-predictions-loading">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="my-predictions-section">
      <div className="my-predictions-header">
        <h4 className="my-predictions-title">My Predictions ({totalCount})</h4>
        <button className="my-predictions-statement-btn" onClick={() => navigate("/prediction/statement")}>
          Full Statement
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="my-predictions-empty">No predictions yet</p>
      ) : (
        <div className="my-predictions-list">
          {entries.map((e) => (
            <div key={e._id} className="my-predictions-row">
              <span className="my-predictions-market" title={e.titleSnapshot}>
                {e.titleSnapshot || "—"}
              </span>
              <span className={`my-predictions-outcome outcome-${e.outcome?.toLowerCase()}`}>
                {e.outcome}
              </span>
              <span className="my-predictions-amount">{e.amount} chips</span>
              <span className={`my-predictions-status status-${e.status?.toLowerCase()}`}>
                {e.status}
              </span>
              {e.status !== "PENDING" && (
                <span className="my-predictions-resolved">
                  Resolved: {e.resolvedOutcome}
                  {e.payout > 0 && ` (+${e.payout})`}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPredictions;
