import React from "react";

const BettingTable = ({ sportsData }) => {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        color: "white",
        padding: "20px",
        fontFamily: "Arial",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            borderBottom: "1px solid #333",
            paddingBottom: "8px",
          }}
        >
          <div style={{ flex: 2 }}>Teams</div>
          <div style={{ flex: 1, textAlign: "center" }}>Details</div>
          {/* <div style={{ flex: 1, textAlign: "center" }}>Money Line</div>
          <div style={{ flex: 1, textAlign: "center" }}>Total</div> */}
        </div>

        {sportsData?.map((game, idx) => (
          <div
            key={idx}
            style={{ borderTop: "1px solid #333", padding: "10px 0" }}
          >
            <div style={{ display: "flex", marginBottom: "5px", justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#999", fontSize: "14px" }}>
                  {new Date(game.gameTime * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}{" "}
                  {new Date(game.gameTime * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div>{game.teamOneName}</div>
              </div>
              <button
                className="header-signup-btn"

              >
                AI Advisor
              </button>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center", // optional: centers horizontally
                  textAlign: "center",
                }}
              >

                <div>
                  {game.line}{" "}
                  <span style={{ color: "rgb(36, 238, 137)" }}>
                    {game.outcomeOneName}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ flex: 2 }}>
                <div>{game.teamTwoName}</div>
              </div>

              <div style={{ flex: 1, textAlign: "center" }}>
                <div>
                  {game.line}{" "}
                  <span style={{ color: "rgb(36, 238, 137)" }}>
                    {game.outcomeTwoName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BettingTable;
