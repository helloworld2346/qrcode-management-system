import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/types/api.types";

import { assetsApi } from "./assets.api";
import type {
  AssetFilter,
  CreateAssetRequest,
  UpdateAssetRequest,
  UpdateStatusRequest,
} from "./assets.types";

const keys = {
  all: ["assets"] as const,
  list: (f: AssetFilter) => ["assets", "list", f] as const,
  detail: (code: string) => ["assets", "code", code] as const,
  history: (id: string) => ["assets", "history", id] as const,
  qr: (id: string) => ["assets", "qr", id] as const,
};

function must<T>(res: ApiResponse<T>, fallback: string): T {
  if (!res.ok || res.data === undefined) throw new Error(res.error?.message || fallback);
  return res.data;
}

export function useAssets(filter: AssetFilter) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: async () => must(await assetsApi.list(filter), "Không tải được tài sản"),
  });
}

export function useAssetByCode(code: string) {
  return useQuery({
    queryKey: keys.detail(code),
    enabled: !!code,
    queryFn: async () => must(await assetsApi.lookup(code), "Không tìm thấy tài sản"),
  });
}

export function useAssetHistory(id?: string) {
  return useQuery({
    queryKey: keys.history(id ?? ""),
    enabled: !!id,
    queryFn: async () => must(await assetsApi.history(id!), "Không tải được lịch sử"),
  });
}

export function useAssetQR(id?: string) {
  return useQuery({
    queryKey: keys.qr(id ?? ""),
    enabled: !!id,
    staleTime: Infinity,
    queryFn: async () => URL.createObjectURL(await assetsApi.qrBlob(id!)),
  });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: CreateAssetRequest) =>
      must(await assetsApi.create(p), "Tạo tài sản thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateAssetRequest }) =>
      must(await assetsApi.update(id, payload), "Cập nhật thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateAssetStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateStatusRequest }) =>
      must(await assetsApi.updateStatus(id, payload), "Đổi trạng thái thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      must(await assetsApi.remove(id), "Xóa tài sản thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useMarkPrinted() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      must(await assetsApi.markPrinted(ids), "Đánh dấu đã in thất bại"),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
