import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoriesApi } from "@/features/categories/categories.api";
import type {
  AddCategoryAttributeRequest,
  Category,
  CreateCategoryRequest,
} from "@/features/categories/categories.types";
import { pickResult } from "@/types/api.types";
import { logger } from "@/utils/logger";

const categoryKeys = {
  all: ["categories"] as const,
  detail: (id: string) => ["categories", id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await categoriesApi.list();
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tải được danh mục");
      }
      return result;
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await categoriesApi.detail(id);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Không tìm thấy danh mục");
      }
      return result;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryRequest) => {
      const res = await categoriesApi.create(payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Tạo danh mục thất bại");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (err) => {
      logger.error("create category failed", err);
    },
  });
}

export function useAddCategoryAttribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      payload: AddCategoryAttributeRequest;
    }) => {
      const res = await categoriesApi.addAttribute(params.id, params.payload);
      const result = pickResult(res);
      if (!res.success || !result) {
        throw new Error(res.message || "Thêm thuộc tính thất bại");
      }
      return result;
    },
    onSuccess: (_category: Category, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
    onError: (err) => {
      logger.error("add category attribute failed", err);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await categoriesApi.remove(id);
      if (!res.success) {
        throw new Error(res.message || "Xóa danh mục thất bại");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (err) => {
      logger.error("delete category failed", err);
    },
  });
}
