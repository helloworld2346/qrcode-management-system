import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api.types";

import type {
  CreateItemRequest,
  Item,
  UpdateItemRequest,
  UpdateItemStatusRequest,
} from "./items.types";

export const itemsApi = {
  list: async () => {
    const { data } = await http.get<ApiResponse<Item[]>>(endpoints.items.list);
    return data;
  },

  detail: async (id: string) => {
    const { data } = await http.get<ApiResponse<Item>>(
      endpoints.items.detail(id),
    );
    return data;
  },

  resolve: async (code: string) => {
    const { data } = await http.get<ApiResponse<Item>>(
      endpoints.items.resolve(code),
    );
    return data;
  },

  create: async (payload: CreateItemRequest) => {
    const { data } = await http.post<ApiResponse<Item>>(
      endpoints.items.create,
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateItemRequest) => {
    const { data } = await http.put<ApiResponse<Item>>(
      endpoints.items.update(id),
      payload,
    );
    return data;
  },

  updateStatus: async (id: string, payload: UpdateItemStatusRequest) => {
    const { data } = await http.patch<ApiResponse<Item>>(
      endpoints.items.updateStatus(id),
      payload,
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<string>>(
      endpoints.items.remove(id),
    );
    return data;
  },

  qr: async (id: string) => {
    const { data } = await http.get<Blob>(endpoints.items.qr(id), {
      responseType: "blob",
    });
    return data;
  },
};
