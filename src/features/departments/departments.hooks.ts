import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  departmentsApi,
  type DepartmentInput,
} from "@/features/departments/departments.api";
import { pickData } from "@/types/api.types";

export interface DepartmentListFilter {
  q?: string;
  page?: number;
  size?: number;
}

const keys = {
  all: ["departments"] as const,
  list: (filter: DepartmentListFilter) =>
    ["departments", "list", filter] as const,
  options: ["departments", "options"] as const,
};

export function useDepartments(filter: DepartmentListFilter = {}) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: async () =>
      pickData(
        await departmentsApi.list(
          filter.page,
          filter.size,
          filter.q || undefined,
        ),
      ),
  });
}

export function useDepartmentOptions() {
  return useQuery({
    queryKey: keys.options,
    queryFn: async () =>
      pickData(await departmentsApi.list(1, 100))?.items ?? [],
  });
}

export function useSaveDepartment(editingId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: DepartmentInput) => {
      const res = editingId
        ? await departmentsApi.update(editingId, p)
        : await departmentsApi.create(p);
      const d = pickData(res);
      if (!res.ok || !d)
        throw new Error(res.error?.message || "Lưu đơn vị thất bại");
      return d;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await departmentsApi.remove(id);
      if (!res.ok) throw new Error(res.error?.message || "Xóa đơn vị thất bại");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
