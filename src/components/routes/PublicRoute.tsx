import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "@/lib/api";
import { ReactNode } from "react";


interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get("/api/auth/me", { withCredentials: true })
      .then(() => {
        setIsLoggedIn(true);
        setChecking(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setChecking(false);
      });
  }, []);

  if (checking) return <div className="p-6">Verificando sesión...</div>;
  if (isLoggedIn) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PublicRoute;
