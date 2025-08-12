import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ResponsiveSidebar, Sidebar } from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import IconBar from "./components/Sidebar/IconBar";
import BottomTabBar from "./components/BottomTabBar/BottomTabBar";
import Footer from "./components/Footer/Footer";
import { BetSlip } from "./components/BetSlip/BetSlip";
import SignIn from "./components/Registration/SignIn";
import SignUp from "./components/Registration/SignUp";
import { ChatboxModal } from "./components/ChatboxModal/ChatboxModal";
import OTPVerification from "./components/Registration/OTPVerification";
import { useAuth } from "./context/AuthContext";
import { useNavRoute } from "./context/navRoute";
import ScrollToTopController from "./components/ScrollToTop/ScrollToTopController";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const {
    handleClose,
    handleOpenLogin,
    handleOpenSignup,
    openLogin,
    openSignUp,
  } = useNavRoute();
  const location = useLocation();
  const hideOnPrediction = location.pathname === "/prediction";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [popupStates, setPopupStates] = useState({
    signIn: false,
    signUp: false,
    chatbox: false,
    responsive: false,
    otpVerify: false,
  });
  const { isLogin } = useAuth();

  // useEffect(() => {
  //   setPopupStates((prevStates) => ({
  //     ...prevStates,
  //     signIn: location.pathname === "/signin",
  //   }));
  // }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handlePopup = (popupName, isOpen) => {
    setPopupStates((prev) => ({
      ...prev,
      [popupName]: isOpen,
    }));
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header-container">
        <Header toggleBar={toggleSidebar} handlePopup={handlePopup} />
      </header>

      <div className="layout-body">
        {/* Sidebar or IconBar */}
        <div
          className={`sidebar-container ${isSidebarOpen ? "open" : "collapsed"
            }`}
        >
          {isSidebarOpen ? <Sidebar handlePopup={handlePopup} /> : <IconBar />}
        </div>

        {/* Shared Scrollable Content */}
        <div
          className={`content-container ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
            }`}
        >
          <div className="main-content">
            <ScrollToTopController />
            <Outlet />
            {!hideOnPrediction && (
              <Footer />)}
          </div>
          {/* <div className="bet-slip">
            <BetSlip />
          </div> */}
        </div>
      </div>
      {
        isLogin &&
        <BetSlip />
      }

      {/* Bottom Tab Bar */}
      <BottomTabBar handlePopup={handlePopup} />

      {/* Modals */}
      {popupStates.signIn && (
        <SignIn
          handleClose={() => handlePopup("signIn", false)}
          handlePopup={handlePopup}
        />
      )}
      {popupStates.signUp && (
        <SignUp
          handleClose={() => handlePopup("signUp", false)}
          handlePopup={handlePopup}
        />
      )}
      {popupStates.chatbox && (
        <ChatboxModal handleClose={() => handlePopup("chatbox", false)} />
      )}
      {popupStates.responsive && (
        <div className="responsive-sidebar-wrapper">
          <ResponsiveSidebar
            handleClose={() => handlePopup("responsive", false)}
          />
        </div>
      )}
      {popupStates.otpVerify && (
        <div className="responsive-sidebar-wrapper">
          <OTPVerification
            handleClose={() => handlePopup("otpVerify", false)}
          />
        </div>
      )}

      {openLogin && (
        <SignIn
          handleOpenSignup={handleOpenSignup}
          handlePopClose={handleClose}
        />
      )}
      {openSignUp && (
        <SignUp
          handleOpenLogin={handleOpenLogin}
          handlePopClose={handleClose}
        />
      )}
    </div>
  );
};

export default Layout;
