import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/types/api.types";

import { accountsApi } from "./accounts.api";
import type {
  CreateAccountRequest,
  UpdateAccountRequest,
} from "./accounts.types";

export interface AccountListFilter {
  q?: string;
  page?: number;
  size?: number;
}

export const accountKeys = {
  all: ["accounts"] as const,
  list: (filter: AccountListFilter) => ["accounts", "list", filter] as const,
};

function must<T>(res: ApiResponse<T>, fallback: string): T {
  if (!res.ok || res.data === undefined)
    throw new Error(res.error?.message || fallback);
  return res.data;
}

export function useAccounts(filter: AccountListFilter = {}) {
  return useQuery({
    queryKey: accountKeys.list(filter),
    queryFn: async () =>
      must(
        await accountsApi.list(filter.page, filter.size, filter.q),
        "Không tải được danh sách tài khoản",
      ),
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

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAccountRequest;
    }) =>
      must(
        await accountsApi.update(id, payload),
        "Cập nhật tài khoản thất bại",
      ),
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
    mutationFn: async ({
      id,
      newPassword,
    }: {
      id: string;
      newPassword: string;
    }) => {
      const res = await accountsApi.resetPassword(id, {
        new_password: newPassword,
      });
      if (!res.ok)
        throw new Error(res.error?.message || "Đặt lại mật khẩu thất bại");
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      must(await accountsApi.remove(id), "Xóa tài khoản thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.all }),
  });
}

export function useMe() {
  return useQuery({
    queryKey: [...accountKeys.all, "me"] as const,
    queryFn: async () =>
      must(await accountsApi.me(), "Không tải được thông tin tài khoản"),
    staleTime: 5 * 60 * 1000,
  });
}