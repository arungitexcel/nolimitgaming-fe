/** @format */

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { postData } from "../../api/ClientFunction";
import { toast } from "react-toastify";
import { mutate } from "swr";
import "./PredictionSlipModal.css";

// Modal to place Play Chips prediction. Shows amount input and Place button.
const PredictionSlipModal = ({ market, outcome, eventTitle, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  const polymarketMarketId = market?.polymarketMarketId ?? market?.id;
  const polymarketEventId = market?.polymarketEventId ?? market?.eventId;
  const title = eventTitle || market?.groupItemTitle || market?.question || "";

  const handlePlace = async () => {
    if (!polymarketMarketId || !outcome) {
      toast.error("Invalid market or outcome");
      return;
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 1) {
      toast.error("Enter a valid amount (min 1)");
      return;
    }

    setLoading(true);
    try {
      const res = await postData("/user/prediction/place", {
        polymarketMarketId,
        polymarketEventId,
        title,
        outcome,
        amount: amt,
      });
      if (res?.success) {
        toast.success(res.message || "Prediction placed!");
        mutate("/user/get-user-info");
        mutate("/user/prediction/my");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Failed to place prediction");
      }
    } catch (e) {
      toast.error("Failed to place prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-slip-overlay" onClick={onClose}>
      <div className="prediction-slip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prediction-slip-header">
          <span>Place prediction ({outcome})</span>
          <button className="prediction-slip-close" onClick={onClose} aria-label="Close">
            <RxCross2 />
          </button>
        </div>
        <div className="prediction-slip-body">
          <p className="prediction-slip-title" title={title}>
            {title || "—"}
          </p>
          <label className="prediction-slip-label">Amount (Play Chips)</label>
          <input
            type="number"
            min={1}
            max={100000}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="prediction-slip-input"
          />
          <div className="prediction-slip-quick">
            {[10, 50, 100, 500].map((n) => (
              <button key={n} type="button" onClick={() => setAmount(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="prediction-slip-footer">
          <button className="prediction-slip-place" onClick={handlePlace} disabled={loading}>
            {loading ? "Placing…" : "Place prediction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionSlipModal;
