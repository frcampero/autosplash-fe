import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import type { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 👇 Agregamos esto para ver exactamente lo que se envía
    console.log("Email enviado:", JSON.stringify(email));
    console.log("Password enviado:", JSON.stringify(password));

    try {
      await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("✅ Login exitoso, redireccionando...");
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      if (axiosError.response?.data?.error) {
        setError(axiosError.response.data.error);
      } else if (axiosError.message) {
        setError(axiosError.message);
      } else {
        setError("Error desconocido");
      }
    }
  };

  useEffect(() => {
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div className="p-6">Verificando sesión...</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-60 h-60 bg-white opacity-10 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-white opacity-10 rounded-full animate-pulse"></div>
        </div>
        <div className="relative z-10">
          <img
            src="/imagotipo-claro.png"
            alt="Autosplash Logo"
            className="max-w-xs w-full object-contain"
          />
        </div>
      </div>

      {/* Columna derecha */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Iniciar sesión
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
