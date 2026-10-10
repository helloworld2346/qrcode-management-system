import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api.types";

import type { Account, CreateAccountRequest } from "./accounts.types";

export const accountsApi = {
  list: async () => {
    const { data } = await http.get<ApiResponse<Account[]>>(
      endpoints.accounts.list,
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

  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<string>>(
      endpoints.accounts.remove(id),
    );
    return data;
  },
};
