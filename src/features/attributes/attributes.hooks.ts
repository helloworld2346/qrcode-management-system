import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { attributesApi } from "@/features/attributes/attributes.api";
import type { CreateAttributeRequest } from "@/features/attributes/attributes.types";
import { pickResult } from "@/types/api.types";
import { logger } from "@/utils/logger";

const attributeKeys = {
  all: ["attributes"] as const,
};

export function useAttributes() {
  return useQuery({
    queryKey: attributeKeys.all,
    queryFn: async () => {
      const res = await attributesApi.list();
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tải được thuộc tính");
      }
      return result;
    },
  });
}

export function useCreateAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAttributeRequest) => {
      const res = await attributesApi.create(payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Tạo thuộc tính thất bại");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
    },
    onError: (err) => {
      logger.error("create attribute failed", err);
    },
  });
}

export function useDeleteAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await attributesApi.remove(id);
      if (!res.success) {
        throw new Error(res.message || "Xóa thuộc tính thất bại");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.all });
    },
    onError: (err) => {
      logger.error("delete attribute failed", err);
    },
  });
}
