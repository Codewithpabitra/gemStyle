import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken: string = data.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  me: () => api.get("/auth/me"),
};

// ── Generations ───────────────────────────────────────────────────
export const generationsApi = {
  getStyles: () => api.get("/generations/styles"),
  generate: (formData: FormData) =>
    api.post("/generations/generate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyGenerations: (page = 1, limit = 12) =>
    api.get(`/generations?page=${page}&limit=${limit}`),
  delete: (id: string) => api.delete(`/generations/${id}`),
};

// ── Users ─────────────────────────────────────────────────────────
export const usersApi = {
  getDashboard: () => api.get("/users/dashboard"),
  updateProfile: (data: { name?: string; geminiApiKey?: string }) =>
    api.patch("/users/profile", data),
};