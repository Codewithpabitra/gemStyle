import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  role: "user" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  setAccessToken: (token: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) => set({ accessToken }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist accessToken — it's short-lived; refresh via cookie
      }),
    }
  )
);
