import React from "react";
import "../Style/Bonus.css";
const BonusPage = () => {
  return (
    <div>
      <div class="bonus-welcome-root">
        <header class="bonus-welcome-header">
          <div class="bonus-welcome-overlay"></div>
          <img
            class="bonus-welcome-banner"
            src="https://bc.co/modules/bonus2/assets/bonus-welcome-banner-b583493b.png"
          />

          <div class="bonus-welcome-content">
            <h1 class="bonus-title">
              Unlock <span class="text-brand">endless</span> benefits
            </h1>
            <p class="bonus-description">
              Join now and embark on an exhilarating journey of luck and reward
            </p>
            <div class="bonus-button-container">
              <a href="/login/regist" class="inactive">
                <button class="bonus-signup-button" type="button">
                  Sign up
                </button>
              </a>
            </div>
          </div>
        </header>

        <div class="bonus-steps">
          <span class="step">
            <span class="step-number">01</span>
            Sign up &amp; make a deposit
          </span>
          <span class="step-divider"></span>
          <span class="step">
            <span class="step-number">02</span>
            Play your fav games
          </span>
          <span class="step-divider"></span>
          <span class="step">
            <span class="step-number">03</span>
            Increase your VIP levels
          </span>
        </div>

        <div class="bonus-container">
          <div class="bonus-card green-gradient">
            <div class="bonus-image">
              <img src="https://bc.co/modules/bonus2/assets/banner-casino-87e5d3e8.png" />
            </div>
            <div class="bonus-text">
              <p class="bonus-title">Up to 100% bonus +</p>
              <p class="bonus-subtitle">400 Free Spin in Casino</p>
              <button class="bonus-details">
                Bonus Details
               
              </button>
              <button class="deposit-button">Deposit Now</button>
            </div>
          </div>

          <div class="bonus-card yellow-gradient">
            <div class="bonus-text">
              <p class="bonus-title">Up to 100% bonus +</p>
              <p class="bonus-subtitle">20 Free Bet in Sports</p>
              <button class="bonus-details">
                Bonus Details
                
              </button>
              <button class="deposit-button">Deposit Now</button>
            </div>
            <div class="bonus-image">
              <img src="	https://bc.co/modules/bonus2/assets/banner-sport-383774b2.png" />
            </div>
          </div>
        </div>

        <div class="bonus-section">
          <div class="bonus-content right-aligned">
            <h1 class="bonus-heading">
              Reach new heights with our Level Up bonus
            </h1>
            <p class="bonus-description">
              Level up to earn substantial <span class="highlight">cash</span>{" "}
              rewards and <span class="highlight">free lucky spins</span>! The
              higher your level, the bigger the rewards.
            </p>
            <button class="details-button">Level up bonus details</button>
            <a href="/login/regist" class="inactive">
              <button class="claim-button">Unlock Level-up Bonus</button>
            </a>
          </div>
          <div class="bonus-image-container">
            <img src="	https://bc.co/modules/bonus2/assets/welcome-levelup-27d8d02f.png" />
          </div>
        </div>

        <div class="bonus-section">
          <div class="bonus-image-container">
            <img src="	https://bc.co/modules/bonus2/assets/welcome-rakeback-f58da82f.png" />
          </div>
          <div class="bonus-content">
            <h1 class="bonus-heading">
              Maximize the Potential of BCD/fiat Rakeback
            </h1>
            <p class="bonus-description">
              Unlock your potential with our Rakeback program! Earn bonuses with
              every wager and watch your balance grow continuously.
            </p>
            <button class="details-button">Rakeback Details</button>
            <a href="/login/regist" class="inactive">
              <button class="claim-button">Unlock Rakeback</button>
            </a>
          </div>
        </div>

        <h1 className="custom-title">
          Get a lot of <span className="custom-highlight">free</span> perks
        </h1>
        <div className="custom-container">
          <div className="custom-perks-wrapper">
            <div
              className="custom-perk-card"
              style={{
                background:
                  "radial-gradient(circle, rgba(118,54,255,0.6) 0%, rgba(118,54,255,0) 100%)",
              }}
            >
              <div className="custom-perk-header">Every Day & Week</div>
              <div className="custom-perk-content">
                <h2 className="custom-perk-title">Quest Hub</h2>
                <img
                  className="custom-perk-image"
                  src="		https://bc.co/modules/bonus2/assets/perk-quest-1a1c42f9.png"
                  alt="Quest Hub"
                />
              </div>
              <p className="custom-perk-text">
                Conquer daily and weekly quests while amassing and snowballing
                your earnings!
              </p>
            </div>
          </div>
          <div className="custom-perks-wrapper">
            <div
              className="custom-perk-card"
              style={{
                background:
                  "radial-gradient(circle, rgba(118,54,255,0.6) 0%, rgba(118,54,255,0) 100%)",
              }}
            >
              <div className="custom-perk-header">Every Day & Week</div>
              <div className="custom-perk-content">
                <h2 className="custom-perk-title">Quest Hub</h2>
                <img
                  className="custom-perk-image"
                  src="		https://bc.co/modules/bonus2/assets/perk-spin-1f25566d.png
"
                  alt="Quest Hub"
                />
              </div>
              <p className="custom-perk-text">
                Conquer daily and weekly quests while amassing and snowballing
                your earnings!
              </p>
            </div>
          </div>
          <div className="custom-perks-wrapper">
            <div
              className="custom-perk-card"
              style={{
                background:
                  "radial-gradient(circle, rgba(118,54,255,0.6) 0%, rgba(118,54,255,0) 100%)",
              }}
            >
              <div className="custom-perk-header">Every Day & Week</div>
              <div className="custom-perk-content">
                <h2 className="custom-perk-title">Quest Hub</h2>
                <img
                  className="custom-perk-image"
                  src="https://bc.co/modules/bonus2/assets/perk-rakeback-842a91d2.png
"
                  alt="Quest Hub"
                />
              </div>
              <p className="custom-perk-text">
                Conquer daily and weekly quests while amassing and snowballing
                your earnings!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusPage;
