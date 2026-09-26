import { z } from "zod";

import { statusMeta } from "@/features/assets/data/mock";

const statusValues = statusMeta.map((s) => s.value) as [string, ...string[]];

export const assetSchema = z.object({
  code: z
    .string()
    .min(1, "Vui lòng nhập mã tài sản")
    .regex(/^[A-Za-z0-9-]+$/, "Mã chỉ gồm chữ, số và dấu gạch ngang"),
  name: z.string().min(1, "Vui lòng nhập tên tài sản"),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
  status: z.enum(statusValues, {
    errorMap: () => ({ message: "Vui lòng chọn trạng thái" }),
  }),
  issuedDate: z.string().min(1, "Vui lòng chọn ngày cấp"),
  note: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;
