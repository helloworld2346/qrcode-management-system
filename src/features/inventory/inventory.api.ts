import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse, ListResult } from "@/types/api.types";

export interface InventorySession {
  id: string;
  name: string;
  scope_type: "DEPARTMENT" | "CATEGORY";
  scope_id: string;
  status: "OPEN" | "CLOSED";
  started_by: string;
  created_at: string;
  ended_at?: string;
}

export interface InventoryScan {
  id: string;
  asset_id: string;
  asset_code: string;
  asset_name: string;
  is_unexpected: boolean;
  scanned_by: string;
  created_at: string;
}

export interface InventoryReport {
  session: InventorySession;
  missing: InventoryScan[] | null;
  scanned_ok: InventoryScan[] | null;
  unexpected: InventoryScan[] | null;
  total_expected: number;
}

export const inventoryApi = {
  sessions: async (page = 1, size = 50) => {
    const { data } = await http.get<ApiResponse<ListResult<InventorySession>>>(
      endpoints.inventory.sessions,
      { params: { page, size } },
    );
    return data;
  },
  create: async (p: { name: string; scope_type: string; scope_id: string }) => {
    const { data } = await http.post<ApiResponse<InventorySession>>(
      endpoints.inventory.sessions,
      p,
    );
    return data;
  },
  close: async (id: string) => {
    const { data } = await http.post<ApiResponse<InventorySession>>(
      endpoints.inventory.close(id),
    );
    return data;
  },
  scan: async (id: string, code: string) => {
    const { data } = await http.post<ApiResponse<InventoryScan>>(
      endpoints.inventory.scan(id),
      { code },
    );
    return data;
  },
  scans: async (id: string) => {
    const { data } = await http.get<ApiResponse<InventoryScan[]>>(
      endpoints.inventory.scans(id),
    );
    return data;
  },
  report: async (id: string) => {
    const { data } = await http.get<ApiResponse<InventoryReport>>(
      endpoints.inventory.report(id),
    );
    return data;
  },
};
