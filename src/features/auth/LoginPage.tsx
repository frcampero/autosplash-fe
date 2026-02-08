import api, { setStoredToken } from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import type { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageLoader, LoadingSpinner } from "@/components/LoadingSpinner";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    api
      .get("/api/auth/me", { signal: controller.signal })
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch(() => {
        setCheckingAuth(false);
      })
      .finally(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await api.post<{ success?: boolean; token?: string }>(
        "/api/auth/login",
        { email, password }
      );
      if (res.data.token) {
        setStoredToken(res.data.token);
      }
      navigate("/", { replace: true, state: { fromLogin: true } });
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      if (axiosError.response?.data?.error) {
        setError(axiosError.response.data.error);
      } else if (axiosError.message) {
        setError(axiosError.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <PageLoader message="Verificando sesión…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda (desktop) - gradiente según logo Autosplash */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-[hsl(206,58%,87%)] via-[hsl(207,28%,65%)] to-[hsl(213,21%,45%)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-60 h-60 bg-white/10 rounded-full animate-ping" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-white/10 rounded-full animate-pulse" />
        </div>
        <div className="relative z-10 animate-in fade-in-0 duration-500">
          <img
            src="/imagotipo-claro.png"
            alt="Autosplash"
            className="max-w-xs w-full object-contain"
          />
        </div>
      </div>

      {/* Columna derecha: formulario */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 md:p-8">
        {/* Logo en móvil */}
        <div className="md:hidden mb-8 animate-in fade-in-0 duration-300">
          <img
            src="/imagotipo-claro.png"
            alt="Autosplash"
            className="h-10 w-auto object-contain dark:invert"
          />
        </div>

        <div className="max-w-md w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            Iniciar sesión
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Ingresá con tu cuenta para acceder al panel
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-background"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm animate-in fade-in-0 duration-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Ingresando…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
