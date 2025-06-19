import React, { useState } from "react";
import "./ChatboxModal.css";
import nfl from "../../assets/nfl.png";

export const ChatboxModal = ({ handleClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="chatbox-modal">
          <div className="chatbox-header">
            <div
              style={{ display: "flex", alignItems: "center", gap: ".4rem" }}
            >
              <img
                src={nfl}
                alt="asdf"
                style={{ height: "2rem", borderRadius: "1rem" }}
              />
              <h3>AI Sports Advisory</h3>
            </div>
            <button className="close-modal-btn" onClick={handleClose}>
              &times;
            </button>
          </div>

          <div className="chatbox-body">
            <div className="chat-messages">
              <p className="message user-message">Hello, how can I help you?</p>
              <p className="message provider-message">
                I have a query about your services.
              </p>
            </div>

            <div className="chat-input">
              <input type="text" placeholder="Type your message..." />
              <button className="send-btn">Send</button>
            </div>
          </div>

          <div className="chatbox-footer">
            <div className="provider-box">AI Engine 1</div>
            <div className="provider-box">AI Engine 2</div>
            <div className="provider-box">ARBITRAGE</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ResponsiveChatAI = () => {
  return (
    <>
      <div className="responsive-chat">
        <div className="chatbox-modal responsive-chat-modal">
          <div className="chatbox-header">
            <div
              style={{ display: "flex", alignItems: "center", gap: ".4rem" }}
            >
              <img
                src={nfl}
                alt="asdf"
                style={{ height: "2rem", borderRadius: "1rem" }}
              />
              <h3>AI Sports Advisory</h3>
            </div>
            <button className="close-modal-btn" style={{display:"none"}}>&times;</button>
          </div>

          <div className="chatbox-body">
            <div className="chat-messages resp-chat-messages">
              <p className="message user-message">Hello, how can I help you?</p>
              <p className="message provider-message">
                I have a query about your services.
              </p>
            </div>

            <div className="chat-input">
              <input type="text" placeholder="Type your message..." />
              <button className="send-btn">Send</button>
            </div>
          </div>

          <div className="chatbox-footer">
            <div className="provider-box">AI Engine 1</div>
            <div className="provider-box">AI Engine 2</div>
            <div className="provider-box">ARBITRAGE</div>
          </div>
        </div>
      </div>
    </>
  );
};
