import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/auth.api";
import { useAuthStore, type Role } from "@/store/auth.store";
import { logger } from "@/utils/logger";

interface JwtPayload {
  sub: string;
  scope: string;
  userName: string;
  exp: number;
  iat: number;
  jti: string;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json) as JwtPayload;
  } catch (err) {
    logger.error("decode token failed", err);
    return null;
  }
}

function scopeToRole(scope?: string): Role {
  return scope && scope.toLowerCase().includes("admin") ? "admin" : "unit";
}

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export function useLogin() {
  const setLogin = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: { userName: string; password: string }) => {
      if (useMock) {
        return {
          token: "mock-token",
          authenticated: true,
        };
      }
      const res = await authApi.login(payload);
      if (!res.success || !res.result?.token) {
        throw new Error(res.message || "Đăng nhập thất bại");
      }
      return res.result;
    },
    onSuccess: (result) => {
      const token = result.token;

      if (useMock) {
        setLogin(
          { id: "1", username: "admin", unitId: "", role: "admin" },
          token,
        );
        return;
      }

      const claims = decodeToken(token);
      setLogin(
        {
          id: claims?.sub ?? "",
          username: claims?.userName ?? "",
          unitId: "",
          role: scopeToRole(claims?.scope),
        },
        token,
      );
    },
    onError: (err) => {
      logger.error("login failed", err);
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().token;
      if (useMock || !token) return;
      await authApi.logout({ token });
    },
    onError: (err) => {
      logger.error("logout failed", err);
    },
    onSettled: () => {
      clear();
    },
  });
}
