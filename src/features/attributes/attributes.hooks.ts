import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { attributesApi } from "@/features/attributes/attributes.api";
import type { CreateAttributeRequest } from "@/features/attributes/attributes.types";
import { pickData } from "@/types/api.types";

export interface AttributeListFilter {
  q?: string;
  page?: number;
  size?: number;
}

const keys = {
  all: ["attributes"] as const,
  list: (filter: AttributeListFilter) =>
    ["attributes", "list", filter] as const,
};

// Giữ nguyên cho dropdown (CategoryDetailPage) — trả về mảng, lấy hết
export function useAttributes() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await attributesApi.list();
      const d = pickData(res);
      if (!res.ok || !d)
        throw new Error(res.error?.message || "Không tải được thuộc tính");
      return d.items;
    },
  });
}

// Dùng cho bảng có phân trang + tìm kiếm
export function useAttributesList(filter: AttributeListFilter = {}) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: async () => {
      const res = await attributesApi.list(filter.page, filter.size, filter.q);
      const d = pickData(res);
      if (!res.ok || !d)
        throw new Error(res.error?.message || "Không tải được thuộc tính");
      return d;
    },
  });
}

export function useCreateAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAttributeRequest) => {
      const res = await attributesApi.create(payload);
      const d = pickData(res);
      if (!res.ok || !d)
        throw new Error(res.error?.message || "Tạo thuộc tính thất bại");
      return d;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await attributesApi.remove(id);
      if (!res.ok)
        throw new Error(res.error?.message || "Xóa thuộc tính thất bại");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
