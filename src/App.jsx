import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import "./App.css";
import SignUp from "./components/Registration/SignUp";
import SignIn from "./components/Registration/SignIn";
import GameOddsDetails from "./Pages/GameOddsDetails";
import Exchange from "./Pages/Exchange";
import ExchangeOddDetails from "./Pages/ExchangeOddDetails";
import { ResponsiveChatAI } from "./components/ChatboxModal/ChatboxModal";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./Pages/LandingPage";
import Profile from "./Pages/Profile";
import KycVerify from "./Pages/KycVerify";
import BonusHistory from "./Pages/BonusHistory";
import BetHistory from "./Pages/BetHistory";
import CoinHistory from "./Pages/CoinHistory";
import SportbookHistory from "./Pages/SportbookHistory";
import ExchangeHistory from "./Pages/ExchangeHistory";
import ReferEarn from "./Pages/ReferEarn";
import BonusPage from "./Pages/BonusPage";
import AdminEntry from "./admin/pages/AdminEntry";
import AdminLayout from "./admin/AdminLayout";
import UsersPage from "./admin/pages/UsersPage";
import KycReviewPage from "./admin/pages/KycReviewPage";
import ManagerProtectedRoute from "./routes/ManagerProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/signin" element={<Home />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/prediction" element={<Home />} />
          <Route path="/prediction/my" element={<Home />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        {/* Manager Admin (only role === "manager") */}
        <Route path="/admin">
          <Route index element={<AdminEntry />} />
          <Route element={<ManagerProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="kyc" element={<KycReviewPage />} />
            </Route>
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/gamedetails_odds" element={<GameOddsDetails />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/exchange_details" element={<ExchangeOddDetails />} />
            <Route path="/resChatAI" element={<ResponsiveChatAI />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/kyc-verify" element={<KycVerify />} />
            <Route path="/bonushistory" element={<BonusHistory />} />
            <Route path="/bethistory" element={<BetHistory />} />{" "}
            <Route path="/coinhistory" element={<CoinHistory />} />{" "}
            <Route path="/sporthistory" element={<SportbookHistory />} />{" "}
            <Route path="/exchangehistory" element={<ExchangeHistory />} />
            <Route path="/referearn" element={<ReferEarn />} />
            <Route path="/bonus" element={<BonusPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
