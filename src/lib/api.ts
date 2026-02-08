import axios, { type AxiosError } from "axios";
import { toast } from "sonner";

const TOKEN_KEY = "autosplash_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    const isAuthFlow = url.includes("/api/auth/me") || url.includes("/api/auth/login");
    if (error.response?.status === 401) {
      if (!isAuthFlow) {
        clearStoredToken();
        toast.error("Sesión expirada. Volvé a iniciar sesión.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");
  } finally {
    clearStoredToken();
  }
};

export default api;