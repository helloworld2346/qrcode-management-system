import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type {
  AddCategoryAttributeRequest,
  Category,
  CreateCategoryRequest,
} from "@/features/categories/categories.types";
import type { ApiResponse } from "@/types/api.types";

export const categoriesApi = {
  list: async () => {
    const { data } = await http.get<ApiResponse<Category[]>>(
      endpoints.categories.list,
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

  addAttribute: async (id: string, payload: AddCategoryAttributeRequest) => {
    const { data } = await http.post<ApiResponse<Category>>(
      endpoints.categories.addAttribute(id),
      payload,
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<string>>(
      endpoints.categories.remove(id),
    );
    return data;
  },
};
