import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type {
  Attribute,
  CreateAttributeRequest,
} from "@/features/attributes/attributes.types";
import type { ApiResponse } from "@/types/api.types";

export const attributesApi = {
  list: async () => {
    const { data } = await http.get<ApiResponse<Attribute[]>>(
      endpoints.attributes.list,
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
    const { data } = await http.delete<ApiResponse<string>>(
      endpoints.attributes.remove(id),
    );
    return data;
  },
};
