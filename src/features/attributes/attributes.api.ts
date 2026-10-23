import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type {
  Attribute,
  CreateAttributeRequest,
} from "@/features/attributes/attributes.types";
import type { ApiResponse, ListResult } from "@/types/api.types";

export const attributesApi = {
  list: async (page = 1, size = 200) => {
    const { data } = await http.get<ApiResponse<ListResult<Attribute>>>(
      endpoints.attributes.list,
      { params: { page, size } },
    );
    return data;
  },
  create: async (payload: CreateAttributeRequest) => {
    const { data } = await http.post<ApiResponse<Attribute>>(
      endpoints.attributes.create,
      payload,
    );
    return data;
  },
  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<{ message: string }>>(
      endpoints.attributes.remove(id),
    );
    return data;
  },
};
