import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type {
  AuthResult,
  ChangePasswordRequest,
  IntrospectResult,
  LoginRequest,
  TokenRequest,
} from "@/features/auth/auth.types";
import type { ApiResponse } from "@/types/api.types";

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await http.post<ApiResponse<AuthResult>>(
      endpoints.auth.login,
      payload,
    );
    return data;
  },

  logout: async (payload: TokenRequest) => {
    const { data } = await http.post<ApiResponse<string>>(
      endpoints.auth.logout,
      payload,
    );
    return data;
  },

  refresh: async (payload: TokenRequest) => {
    const { data } = await http.post<ApiResponse<AuthResult>>(
      endpoints.auth.refresh,
      payload,
    );
    return data;
  },

  introspect: async (payload: TokenRequest) => {
    const { data } = await http.post<ApiResponse<IntrospectResult>>(
      endpoints.auth.introspect,
      payload,
    );
    return data;
  },

  changePassword: async (payload: ChangePasswordRequest) => {
    const { data } = await http.put<ApiResponse<Record<string, never>>>(
      endpoints.auth.changePassword,
      payload,
    );
    return data;
  },
};
