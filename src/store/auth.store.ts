import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "editor" | "viewer";

interface AuthUser {
  id: string;
  username: string;
  departmentId: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  login: (user: AuthUser, token: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      login: (user, token, refreshToken) =>
        set({ user, token, refreshToken: refreshToken ?? null }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    { name: "qr-auth" },
  ),
);
