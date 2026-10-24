import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { categoriesApi } from "@/features/categories/categories.api";
import type {
  AddCategoryAttributeRequest,
  CreateCategoryRequest,
} from "@/features/categories/categories.types";
import type { ApiResponse } from "@/types/api.types";

export interface CategoryListFilter {
  q?: string;
  page?: number;
  size?: number;
}

const keys = {
  all: ["categories"] as const,
  list: (filter: CategoryListFilter) => ["categories", "list", filter] as const,
  detail: (id: string) => ["categories", id] as const,
};

function must<T>(res: ApiResponse<T>, fallback: string): T {
  if (!res.ok || res.data === undefined)
    throw new Error(res.error?.message || fallback);
  return res.data;
}

export function useCategories(filter: CategoryListFilter = {}) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: async () =>
      must(
        await categoriesApi.list(filter.page, filter.size, filter.q),
        "Không tải được danh mục",
      ),
  });
}

export function useCategoryOptions() {
  return useQuery({
    queryKey: [...keys.all, "options"] as const,
    queryFn: async () =>
      must(await categoriesApi.list(1, 100), "Không tải được danh mục").items,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    enabled: !!id,
    queryFn: async () =>
      must(await categoriesApi.detail(id), "Không tải được danh mục"),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: CreateCategoryRequest) =>
      must(await categoriesApi.create(p), "Tạo danh mục thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await categoriesApi.remove(id);
      if (!res.ok)
        throw new Error(res.error?.message || "Xóa danh mục thất bại");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useAddCategoryAttribute(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: AddCategoryAttributeRequest) =>
      must(await categoriesApi.addAttribute(id, p), "Thêm thuộc tính thất bại"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.detail(id) });
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useRemoveCategoryAttribute(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (attrId: string) => {
      const res = await categoriesApi.removeAttribute(id, attrId);
      if (!res.ok)
        throw new Error(res.error?.message || "Gỡ thuộc tính thất bại");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.detail(id) });
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
