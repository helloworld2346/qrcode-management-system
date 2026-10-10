import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateAccountRequest,
} from "@/features/accounts/accounts.types";
import { pickResult } from "@/types/api.types";
import { logger } from "@/utils/logger";

import { accountsApi } from "./accounts.api";

export const accountKeys = {
  all: ["accounts"] as const,
  detail: (id: string) => ["accounts", id] as const,
};

export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.all,
    queryFn: async () => {
      const res = await accountsApi.list();
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tải được danh sách tài khoản");
      }
      return result;
    },
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await accountsApi.detail(id);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tải được tài khoản");
      }
      return result;
    },
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAccountRequest) => {
      const res = await accountsApi.create(payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Tạo tài khoản thất bại");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
    onError: (err) => {
      logger.error("create account failed", err);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await accountsApi.remove(id);
      if (!res.success) {
        throw new Error(res.message || "Xóa tài khoản thất bại");
      }
      return pickResult(res);
    },
    onSuccess: (_data: string | undefined, id: string) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
    },
    onError: (err) => {
      logger.error("delete account failed", err);
    },
  });
}
