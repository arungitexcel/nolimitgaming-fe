import { Navigate, Outlet } from "react-router-dom";
import { useManagerAuth } from "../context/ManagerAuthContext";

export default function ManagerProtectedRoute() {
  const { isManagerLoggedIn, manager, loading } = useManagerAuth();

  if (!localStorage.getItem("managerToken")) {
    return <Navigate to="/admin" replace />;
  }

  if (loading) return null;

  if (!isManagerLoggedIn || !manager) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

