import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getAuthHeaders = () => ({
  withCredentials: true,
});

export const logout = async () => {
  await api.post("/api/auth/logout", null, getAuthHeaders());
};

export default api;