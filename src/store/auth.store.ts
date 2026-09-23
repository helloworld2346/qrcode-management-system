import { create } from "zustand";

export type Role = "admin" | "unit";

interface AuthUser {
  id: string;
  username: string;
  unitId: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
