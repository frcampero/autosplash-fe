import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/lib/api"; // ajustá según tu estructura

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    api
      .get("/api/auth/me", { withCredentials: true })
      .then(() => {
        setAuthenticated(true);
        setChecking(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setChecking(false);
      });
  }, []);

  if (checking) return <div className="p-6">Verificando sesión...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
