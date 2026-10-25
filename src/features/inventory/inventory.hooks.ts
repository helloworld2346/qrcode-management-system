import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { inventoryApi } from "@/features/inventory/inventory.api";
import { pickData } from "@/types/api.types";

export interface InventorySessionFilter {
  q?: string;
  page?: number;
  size?: number;
}

export const keys = {
  all: ["inventory-sessions"] as const,
  sessions: (filter: InventorySessionFilter) =>
    ["inventory-sessions", "list", filter] as const,
  report: (id: string) => ["inventory-report", id] as const,
};

export function useInventorySessions(filter: InventorySessionFilter = {}) {
  return useQuery({
    queryKey: keys.sessions(filter),
    queryFn: async () =>
      pickData(
        await inventoryApi.sessions(
          filter.page,
          filter.size,
          filter.q || undefined,
        ),
      ),
  });
}

export function useInventoryReport(sessionId: string) {
  return useQuery({
    queryKey: keys.report(sessionId),
    enabled: !!sessionId,
    queryFn: async () => pickData(await inventoryApi.report(sessionId)),
  });
}

export function useCreateInventorySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      name: string;
      scope_type: string;
      scope_id: string;
    }) => {
      const res = await inventoryApi.create(p);
      const d = pickData(res);
      if (!res.ok || !d)
        throw new Error(res.error?.message || "Tạo phiên thất bại");
      return d;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useCloseInventorySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await inventoryApi.close(id);
      if (!res.ok) throw new Error(res.error?.message || "Đóng phiên thất bại");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useScanInventory(sessionId: string) {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await inventoryApi.scan(sessionId, code);
      const d = pickData(res);
      if (!res.ok || !d) throw new Error(res.error?.message || "Quét thất bại");
      return d;
    },
  });
}
