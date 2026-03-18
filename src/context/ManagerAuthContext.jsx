import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchManagerData } from "../api/ManagerClient";

const ManagerAuthContext = createContext(null);

export function ManagerAuthProvider({ children }) {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("managerToken"))
  );
  const [isManagerLoggedIn, setIsManagerLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("managerToken"))
  );

  const logoutManager = () => {
    localStorage.removeItem("managerToken");
    setManager(null);
    setIsManagerLoggedIn(false);
  };

  const loadManager = async () => {
    const token = localStorage.getItem("managerToken");
    if (!token) {
      setManager(null);
      setIsManagerLoggedIn(false);
      return null;
    }

    setLoading(true);
    const res = await fetchManagerData("/manager/get-manager-info");
    const m = res?.data?.data ?? res?.data ?? null;
    if (!m) {
      logoutManager();
      setLoading(false);
      return null;
    }

    setManager(m);
    setIsManagerLoggedIn(true);
    setLoading(false);
    return m;
  };

  useEffect(() => {
    // Boot-time hydration for /admin deep links and refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (localStorage.getItem("managerToken")) {
      loadManager();
    } else {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      manager,
      setManager,
      loading,
      isManagerLoggedIn,
      setIsManagerLoggedIn,
      loadManager,
      logoutManager,
    }),
    [manager, loading, isManagerLoggedIn]
  );

  return (
    <ManagerAuthContext.Provider value={value}>
      {children}
    </ManagerAuthContext.Provider>
  );
}

export function useManagerAuth() {
  const ctx = useContext(ManagerAuthContext);
  if (!ctx) {
    throw new Error("useManagerAuth must be used within ManagerAuthProvider");
  }
  return ctx;
}

