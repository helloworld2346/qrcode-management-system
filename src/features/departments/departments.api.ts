import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse, ListResult } from "@/types/api.types";

export interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface DepartmentInput {
  name: string;
  code: string;
}

export const departmentsApi = {
  list: async (page = 1, size = 100, q?: string) => {
    const { data } = await http.get<ApiResponse<ListResult<Department>>>(
      endpoints.departments.list,
      { params: { page, size, q: q || undefined } },
    );
    return data;
  },
  create: async (payload: DepartmentInput) => {
    const { data } = await http.post<ApiResponse<Department>>(
      endpoints.departments.create,
      payload,
    );
    return data;
  },
  update: async (id: string, payload: DepartmentInput) => {
    const { data } = await http.put<ApiResponse<Department>>(
      endpoints.departments.update(id),
      payload,
    );
    return data;
  },
  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<{ message: string }>>(
      endpoints.departments.remove(id),
    );
    return data;
  },
};
