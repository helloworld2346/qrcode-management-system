import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api.types";

import type { DashboardStats } from "./dashboard.types";

export const dashboardApi = {
  stats: async () => {
    const { data } = await http.get<ApiResponse<DashboardStats>>(
      endpoints.stats.dashboard,
    );
    return data;
  },
};
