import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSWR from "swr";
import { fetchData } from "../api/ClientFunction";
import Loader from "../components/Loader";
// import Loader from "./../components/Loader";
export default function Protected() {
  const { setUser, setIsLogin } = useAuth();

  const token = localStorage.getItem("token");

  const { data, error, isValidating } = useSWR(
    token ? "/user/get-user-info" : null,
    fetchData
  );

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
      setIsLogin(true);
    } else if (error) {
      localStorage.removeItem("token");
      setIsLogin(false);
    }
  }, [data, error, setUser, setIsLogin]);

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Show a loading spinner while validating
  // if (isValidating) {
  //   return <Loader />; 
  // }

  return <Outlet />;
}
