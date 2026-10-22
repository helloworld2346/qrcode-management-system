import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/auth.api";
import type { AuthResult } from "@/features/auth/auth.types";
import { useAuthStore, type Role } from "@/store/auth.store";
import { pickData } from "@/types/api.types";
import { logger } from "@/utils/logger";

// Claims do Go backend phát hành: sub/role/department_id/type/jti/exp/iat
interface JwtPayload {
  sub: string;
  role: string;
  department_id?: string;
  type: string;
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

function claimToRole(role?: string): Role {
  return role === "admin" ? "admin" : "user";
}

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export function useLogin() {
  const setLogin = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      if (useMock) {
        return {
          access_token: "mock-token",
          refresh_token: "mock-refresh",
          token_type: "Bearer",
          expires_in: 3600,
        } as AuthResult;
      }
      const res = await authApi.login(payload);
      const result = pickData(res);
      if (!res.ok || !result?.access_token) {
        throw new Error(res.error?.message || "Đăng nhập thất bại");
      }
      return result;
    },
    onSuccess: (result, payload) => {
      if (useMock) {
        setLogin(
          { id: "1", username: "admin", departmentId: "", role: "admin" },
          result.access_token,
          result.refresh_token,
        );
        return;
      }
      const claims = decodeToken(result.access_token);
      setLogin(
        {
          id: claims?.sub ?? "",
          username: payload.username, // JWT không chứa username — giữ cái user đã nhập
          departmentId: claims?.department_id ?? "",
          role: claimToRole(claims?.role),
        },
        result.access_token,
        result.refresh_token,
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

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: {
      old_password: string;
      new_password: string;
    }) => {
      const res = await authApi.changePassword(payload);
      if (!res.ok) {
        throw new Error(res.error?.message || "Đổi mật khẩu thất bại");
      }
    },
  });
}
