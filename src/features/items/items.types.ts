export type ItemStatus = "ACTIVE" | "INACTIVE" | "LOST" | "DAMAGED";

export interface Item {
  idItem: string;
  code: string;
  itemName: string;
  description: string;
  status: ItemStatus | string;
  printed: boolean;
  categoryId: string;
  attributeValues: Record<string, string>;
}

export interface CreateItemRequest {
  itemName: string;
  description: string;
  categoryId: string;
  attributeValues: Record<string, string>;
}

export interface UpdateItemRequest {
  itemName: string;
  description: string;
  categoryId: string;
  attributeValues: Record<string, string>;
}

export interface UpdateItemStatusRequest {
  status: ItemStatus | string;
  note: string;
}

export interface ItemStatusMeta {
  value: string;
  label: string;
  color: string;
}

export const itemStatusMeta: ItemStatusMeta[] = [
  { value: "ACTIVE", label: "Hoạt động", color: "#16a34a" },
  { value: "INACTIVE", label: "Ngưng", color: "#64748b" },
  { value: "DAMAGED", label: "Hư hỏng", color: "#c62839" },
  { value: "LOST", label: "Thất lạc", color: "#d97706" },
];

export const itemStatusLabel = (value: string) =>
  itemStatusMeta.find((s) => s.value === value)?.label ?? value;

export const itemStatusColor = (value: string) =>
  itemStatusMeta.find((s) => s.value === value)?.color ?? "#64748b";
