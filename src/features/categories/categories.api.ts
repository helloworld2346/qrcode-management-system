import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type {
  AddCategoryAttributeRequest,
  Category,
  CreateCategoryRequest,
} from "@/features/categories/categories.types";
import type { ApiResponse, ListResult } from "@/types/api.types";

export const categoriesApi = {
  list: async (page = 1, size = 100, q?: string) => {
    const { data } = await http.get<ApiResponse<ListResult<Category>>>(
      endpoints.categories.list,
      { params: { page, size, q: q || undefined } },
    );
    return data;
  },
  detail: async (id: string) => {
    const { data } = await http.get<ApiResponse<Category>>(
      endpoints.categories.detail(id),
    );
    return data;
  },
  create: async (payload: CreateCategoryRequest) => {
    const { data } = await http.post<ApiResponse<Category>>(
      endpoints.categories.create,
      payload,
    );
    return data;
  },
  update: async (id: string, payload: CreateCategoryRequest) => {
    const { data } = await http.put<ApiResponse<Category>>(
      endpoints.categories.update(id),
      payload,
    );
    return data;
  },
  addAttribute: async (id: string, payload: AddCategoryAttributeRequest) => {
    const { data } = await http.post<ApiResponse<Category>>(
      endpoints.categories.addAttribute(id),
      payload,
    );
    return data;
  },
  removeAttribute: async (id: string, attrId: string) => {
    const { data } = await http.delete<ApiResponse<Category>>(
      endpoints.categories.removeAttribute(id, attrId),
    );
    return data;
  },
  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<{ message: string }>>(
      endpoints.categories.remove(id),
    );
    return data;
  },
};
