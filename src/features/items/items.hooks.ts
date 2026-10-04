import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { pickResult } from "@/types/api.types";
import { logger } from "@/utils/logger";

import { itemsApi } from "./items.api";
import type {
  CreateItemRequest,
  Item,
  UpdateItemRequest,
  UpdateItemStatusRequest,
} from "./items.types";

const itemKeys = {
  all: ["items"] as const,
  detail: (id: string) => ["items", id] as const,
};

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const mockItems: Item[] = [
  {
    idItem: "item-001",
    code: "IT-DEMO-001",
    itemName: "Bàn làm việc",
    description: "Bàn gỗ 1m2",
    status: "ACTIVE",
    printed: false,
    categoryId: "",
    attributeValues: {},
  },
];

export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: async () => {
      if (useMock) return mockItems;
      const res = await itemsApi.list();
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tải được danh sách đồ vật");
      }
      return result;
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await itemsApi.detail(id);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tải được đồ vật");
      }
      return result;
    },
  });
}

export function useResolveItem(code: string) {
  return useQuery({
    queryKey: ["items", "resolve", code] as const,
    enabled: !!code,
    retry: false,
    queryFn: async () => {
      const res = await itemsApi.resolve(code);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tìm thấy mã");
      }
      return result;
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateItemRequest) => {
      const res = await itemsApi.create(payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Tạo đồ vật thất bại");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
    onError: (err) => {
      logger.error("create item failed", err);
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; payload: UpdateItemRequest }) => {
      const res = await itemsApi.update(params.id, params.payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Cập nhật đồ vật thất bại");
      }
      return result;
    },
    onSuccess: (_item: Item, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({
        queryKey: itemKeys.detail(variables.id),
      });
    },
    onError: (err) => {
      logger.error("update item failed", err);
    },
  });
}

export function useUpdateItemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      payload: UpdateItemStatusRequest;
    }) => {
      const res = await itemsApi.updateStatus(params.id, params.payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Đổi trạng thái thất bại");
      }
      return result;
    },
    onSuccess: (_item: Item, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({
        queryKey: itemKeys.detail(variables.id),
      });
    },
    onError: (err) => {
      logger.error("update item status failed", err);
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await itemsApi.remove(id);
      if (!res.success) {
        throw new Error(res.message || "Xóa đồ vật thất bại");
      }
      return pickResult(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
    onError: (err) => {
      logger.error("delete item failed", err);
    },
  });
}

export function useItemQr() {
  return useMutation({
    mutationFn: async (params: { id: string; code: string }) => {
      const blob = await itemsApi.qr(params.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${params.code}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onError: (err) => {
      logger.error("download item qr failed", err);
    },
  });
}
