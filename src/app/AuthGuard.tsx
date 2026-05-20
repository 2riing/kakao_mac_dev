import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "@entities/auth";

function AuthGuard() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export default AuthGuard;
