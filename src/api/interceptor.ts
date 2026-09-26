import { useAuthStore } from "@/store/auth.store";
import { logger } from "@/utils/logger";

import { http } from "./axios";

export function setupInterceptors() {
  http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status === 401) {
        useAuthStore.getState().logout();
      }
      logger.error("API error", status, error.message);
      return Promise.reject(error);
    },
  );
}
