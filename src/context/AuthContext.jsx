import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { fetchData } from "../api/ClientFunction";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Initialize from token so header doesn't flash "logged out" on refresh/deep links
  const [isLogin, setIsLogin] = useState(() => Boolean(localStorage.getItem("token")));

  const token = localStorage.getItem("token");
  const { data, error } = useSWR(token ? "/user/get-user-info" : null, fetchData);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
      setIsLogin(true);
      return;
    }
    if (error) {
      localStorage.removeItem("token");
      setUser(null);
      setIsLogin(false);
    }
  }, [data, error]);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
