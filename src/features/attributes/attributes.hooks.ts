import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { attributesApi } from "@/features/attributes/attributes.api";
import type { CreateAttributeRequest } from "@/features/attributes/attributes.types";
import { pickData } from "@/types/api.types";

const keys = { all: ["attributes"] as const };

export function useAttributes() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await attributesApi.list();
      const d = pickData(res);
      if (!res.ok || !d) throw new Error(res.error?.message || "Không tải được thuộc tính");
      return d.items;
    },
  });
}

export function useCreateAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAttributeRequest) => {
      const res = await attributesApi.create(payload);
      const d = pickData(res);
      if (!res.ok || !d) throw new Error(res.error?.message || "Tạo thuộc tính thất bại");
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
      if (!res.ok) throw new Error(res.error?.message || "Xóa thuộc tính thất bại");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
