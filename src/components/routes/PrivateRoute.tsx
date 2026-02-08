import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api, { clearStoredToken } from "@/lib/api";
import { PageLoader } from "@/components/LoadingSpinner";
import { toast } from "sonner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const AUTH_CHECK_TIMEOUT = 8000;

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const mountedRef = useRef(true);
  const fromLogin = (location.state as { fromLogin?: boolean } | null)?.fromLogin;

  useEffect(() => {
    mountedRef.current = true;

    api
      .get("/api/auth/me", { timeout: AUTH_CHECK_TIMEOUT })
      .then(() => {
        if (mountedRef.current) {
          setAuthenticated(true);
          setChecking(false);
        }
      })
      .catch(() => {
        if (mountedRef.current) {
          clearStoredToken();
          setAuthenticated(false);
          setChecking(false);
          if (fromLogin) {
            toast.error("No se pudo verificar la sesión. Revisá que el backend esté desplegado con soporte para token en el header.");
          }
        }
      });

    return () => {
      mountedRef.current = false;
    };
  }, [fromLogin]);

  if (checking) {
    return (
      <PageLoader
        message={fromLogin ? "Iniciando sesión…" : "Verificando sesión…"}
      />
    );
  }
  if (!authenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
