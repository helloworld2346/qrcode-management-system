export type AssetStatus =
  | "IN_STOCK"
  | "IN_USE"
  | "MAINTENANCE"
  | "BROKEN"
  | "PENDING_LIQUIDATION"
  | "LIQUIDATED";

export interface AssetAttributeDetail {
  code: string;
  name: string;
  data_type: string;
  value: unknown;
  sort_order: number;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category_id: string;
  category_name?: string;
  department_id: string;
  department_name?: string;
  attributes?: Record<string, unknown>;
  attributes_detail?: AssetAttributeDetail[];
  status: AssetStatus;
  is_printed: boolean;
  created_by: string;
  created_at: string;
}

export interface AssetHistory {
  id: string;
  old_status?: string;
  new_status: string;
  note?: string;
  changed_by: string;
  created_at: string;
}

export interface CreateAssetRequest {
  name: string;
  category_id: string;
  department_id?: string;
  attributes?: Record<string, unknown>;
}

export interface UpdateAssetRequest {
  name?: string;
  category_id?: string;
  attributes?: Record<string, unknown>;
}

export interface UpdateStatusRequest {
  status: AssetStatus;
  note?: string;
}

export interface AssetFilter {
  q?: string;
  status?: string;
  department_id?: string;
  category_id?: string;
  page?: number;
  size?: number;
}

export const statusMeta: { value: AssetStatus; label: string }[] = [
  { value: "IN_STOCK", label: "Trong kho" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "BROKEN", label: "Hư hỏng" },
  { value: "PENDING_LIQUIDATION", label: "Chờ thanh lý" },
  { value: "LIQUIDATED", label: "Đã thanh lý" },
];

export const statusColor: Record<AssetStatus, string> = {
  IN_STOCK: "#16a34a",
  IN_USE: "#0ea5e9",
  MAINTENANCE: "#d97706",
  BROKEN: "#c62839",
  PENDING_LIQUIDATION: "#7c3aed",
  LIQUIDATED: "#64748b",
};

export const statusLabel = (value: string) =>
  statusMeta.find((s) => s.value === value)?.label ?? value;
