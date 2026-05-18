import { Navigate, Outlet } from "react-router";
import { useIsAuthenticated } from "@entities/auth";

function AuthGuard() {
  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default AuthGuard;
