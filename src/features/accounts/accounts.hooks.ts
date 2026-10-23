import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { pickData } from "@/types/api.types";

import { accountsApi } from "./accounts.api";
import type { CreateAccountRequest } from "./accounts.types";

export const accountKeys = {
  all: ["accounts"] as const,
};

function must<T>(res: { ok: boolean; data?: T; error?: { message?: string } }, fallback: string): T {
  const d = pickData(res as never);
  if (!res.ok || d === undefined) throw new Error(res.error?.message || fallback);
  return d;
}

export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.all,
    queryFn: async () => {
      const res = await accountsApi.list();
      const d = must(res, "Không tải được danh sách tài khoản");
      return d.items;
    },
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: CreateAccountRequest) =>
      must(await accountsApi.create(p), "Tạo tài khoản thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all }),
  });
}

export function useLockAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      must(await accountsApi.lock(id), "Khóa tài khoản thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all }),
  });
}

export function useUnlockAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      must(await accountsApi.unlock(id), "Mở khóa tài khoản thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all }),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ id, newPassword }: { id: string; newPassword: string }) => {
      const res = await accountsApi.resetPassword(id, { new_password: newPassword });
      if (!res.ok) throw new Error(res.error?.message || "Đặt lại mật khẩu thất bại");
    },
  });
}
