import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse, ListResult } from "@/types/api.types";

import type {
  Asset,
  AssetFilter,
  AssetHistory,
  CreateAssetRequest,
  UpdateAssetRequest,
  UpdateStatusRequest,
} from "./assets.types";

export const assetsApi = {
  list: async (filter: AssetFilter = {}) => {
    const { data } = await http.get<ApiResponse<ListResult<Asset>>>(
      endpoints.assets.list,
      { params: filter },
    );
    return data;
  },

  detail: async (id: string) => {
    const { data } = await http.get<ApiResponse<Asset>>(
      endpoints.assets.detail(id),
    );
    return data;
  },

  lookup: async (code: string) => {
    const { data } = await http.get<ApiResponse<Asset>>(
      endpoints.assets.lookup(code),
    );
    return data;
  },

  create: async (payload: CreateAssetRequest) => {
    const { data } = await http.post<ApiResponse<Asset>>(
      endpoints.assets.create,
      payload,
    );
    return data;
  },

  update: async (id: string, payload: UpdateAssetRequest) => {
    const { data } = await http.put<ApiResponse<Asset>>(
      endpoints.assets.update(id),
      payload,
    );
    return data;
  },

  updateStatus: async (id: string, payload: UpdateStatusRequest) => {
    const { data } = await http.put<ApiResponse<Asset>>(
      endpoints.assets.updateStatus(id),
      payload,
    );
    return data;
  },

  history: async (id: string) => {
    const { data } = await http.get<ApiResponse<AssetHistory[]>>(
      endpoints.assets.history(id),
    );
    return data;
  },

  remove: async (id: string) => {
    const { data } = await http.delete<ApiResponse<{ message: string }>>(
      endpoints.assets.remove(id),
    );
    return data;
  },

  qrBlob: async (id: string) => {
    const { data } = await http.get<Blob>(endpoints.assets.qr(id), {
      responseType: "blob",
    });
    return data; // image/png
  },
};
