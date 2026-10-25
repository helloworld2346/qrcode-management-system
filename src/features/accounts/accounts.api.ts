import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse, ListResult } from "@/types/api.types";

import type {
  Account,
  CreateAccountRequest,
  ResetPasswordRequest,
  UpdateAccountRequest,
} from "./accounts.types";

export const accountsApi = {
  list: async (page = 1, size = 100, q?: string) => {
    const { data } = await http.get<ApiResponse<ListResult<Account>>>(
      endpoints.accounts.list,
      { params: { page, size, q: q || undefined } },
    );
    return data;
  },
  me: async () => {
    const { data } = await http.get<ApiResponse<Account>>(
      endpoints.accounts.me,
    );
    return data;
  },
  detail: async (id: string) => {
    const { data } = await http.get<ApiResponse<Account>>(
      endpoints.accounts.detail(id),
    );
    return data;
  },
  create: async (payload: CreateAccountRequest) => {
    const { data } = await http.post<ApiResponse<Account>>(
      endpoints.accounts.create,
      payload,
    );
    return data;
  },
  update: async (id: string, payload: UpdateAccountRequest) => {
    const { data } = await http.put<ApiResponse<Account>>(
      endpoints.accounts.update(id),
      payload,
    );
    return data;
  },
  lock: async (id: string) => {
    const { data } = await http.post<ApiResponse<Account>>(
      endpoints.accounts.lock(id),
    );
    return data;
  },
  unlock: async (id: string) => {
    const { data } = await http.post<ApiResponse<Account>>(
      endpoints.accounts.unlock(id),
    );
    return data;
  },
  resetPassword: async (id: string, payload: ResetPasswordRequest) => {
    const { data } = await http.post<ApiResponse<{ message: string }>>(
      endpoints.accounts.resetPassword(id),
      payload,
    );
    return data;
  },
  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<{ message: string }>>(
      endpoints.accounts.remove(id),
    );
    return data;
  },
};
