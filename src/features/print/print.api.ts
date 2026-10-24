import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";

export type LabelPreset = "A4-3x8" | "A4-2x5";

export interface PrintLabelsRequest {
  ids: string[];
  label_preset?: LabelPreset;
}

async function parseBlobError(err: unknown): Promise<never> {
  const e = err as { response?: { data?: Blob } };
  const blob = e?.response?.data;
  if (blob instanceof Blob) {
    try {
      const parsed = JSON.parse(await blob.text());
      throw new Error(parsed?.error?.message || "In tem thất bại");
    } catch {
      /* rơi xuống dưới */
    }
  }
  throw new Error("In tem thất bại");
}

export const printApi = {
  labels: async (payload: PrintLabelsRequest): Promise<Blob> => {
    try {
      const { data } = await http.post<Blob>(endpoints.print.labels, payload, {
        responseType: "blob",
      });
      return data;
    } catch (err) {
      return parseBlobError(err);
    }
  },
};
