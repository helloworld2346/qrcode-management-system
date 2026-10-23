import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/features/dashboard/dashboard.api";
import type { DashboardStats } from "@/features/dashboard/dashboard.types";
import { pickData } from "@/types/api.types";

export function useDashboardStats() {
  return useQuery<DashboardStats | undefined>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => pickData(await dashboardApi.stats()),
    refetchInterval: 60_000,
  });
}
