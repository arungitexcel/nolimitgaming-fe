/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BetSlipProvider } from "./context/BetSlipContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ManagerAuthProvider } from "./context/ManagerAuthContext.jsx";
import { ToastContainer, Flip } from "react-toastify";
import { NavChangeProvider } from "./context/navRoute.jsx";
import { TabProvider } from "./context/TabContext.jsx";
import { TagsProvider } from "./context/TagsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TagsProvider>
      <AuthProvider>
        <ManagerAuthProvider>
          <BetSlipProvider>
            <NavChangeProvider>
              <TabProvider>
                <App />
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar
                  newestOnTop={true}
                  closeOnClick
                  draggable
                  pauseOnHover
                  theme="colored"
                  transition={Flip}
                />
              </TabProvider>
            </NavChangeProvider>
          </BetSlipProvider>
        </ManagerAuthProvider>
      </AuthProvider>
    </TagsProvider>
  </StrictMode>
);
