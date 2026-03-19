import { useMemo, useState } from "react";
import { postData, fetchData } from "../api/ClientFunction";
import { useAuth } from "../context/AuthContext";
import "../Style/BuyPlayChips.css";

const CHIP_PACKAGES = [500, 1000, 2500, 5000];

export default function BuyPlayChipsPage() {
  const { user, setUser } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState("");

  const currentChips = useMemo(
    () => Number(user?.playChips || 0).toFixed(2),
    [user?.playChips]
  );

  const refreshUser = async () => {
    const data = await fetchData("/user/get-user-info");
    if (data?.data) setUser(data.data);
  };

  const onRedeem = async (e) => {
    e.preventDefault();
    const code = String(promoCode || "").trim().toUpperCase();
    if (!code) {
      setMessage("Enter a promo code.");
      return;
    }
    setRedeeming(true);
    setMessage("");
    const res = await postData("/user/redeem-promo-code", { code });
    if (res?.success) {
      setMessage(
        `Promo applied. You received ${Number(res.rewardedChips || 0)} play chips.`
      );
      setPromoCode("");
      await refreshUser();
    } else {
      setMessage(res?.message || "Unable to redeem promo code.");
    }
    setRedeeming(false);
  };

  return (
    <main className="BuyChipsPage">
      <section className="BuyChipsCard">
        <h1>Buy Play Chips</h1>
        <p className="BuyChipsMuted">Current Balance: {currentChips}</p>

        <div className="BuyChipsPackages">
          {CHIP_PACKAGES.map((chips) => (
            <article key={chips} className="BuyChipsPackage">
              <h2>{chips.toLocaleString()} Chips</h2>
              <p>Package checkout integration can be connected here.</p>
              <button type="button" className="BuyChipsButton" aria-label={`Select ${chips} chips package`}>
                Choose Package
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="BuyChipsCard">
        <h2>Redeem Promo Code</h2>
        <p className="BuyChipsMuted">
          Enter your promo code to receive free play chips.
        </p>
        <form className="BuyChipsPromoForm" onSubmit={onRedeem}>
          <label htmlFor="promo-code-input">Promo Code</label>
          <input
            id="promo-code-input"
            name="promoCode"
            type="text"
            placeholder="WELCOME100…"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Promo Code"
          />
          <button
            type="submit"
            className="BuyChipsButton"
            disabled={redeeming}
            aria-label="Redeem Promo Code"
          >
            {redeeming ? "Redeeming…" : "Redeem"}
          </button>
        </form>
        <p className="BuyChipsMessage" aria-live="polite">
          {message}
        </p>
      </section>
    </main>
  );
}
