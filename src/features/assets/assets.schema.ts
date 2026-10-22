import { z } from "zod";

// Form tạo/sửa tài sản: mã + trạng thái do backend quản lý
export const assetSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên tài sản"),
  category_id: z.string().min(1, "Vui lòng chọn danh mục"),
  department_id: z.string().optional(),
  attributes: z.record(z.unknown()).default({}),
  note: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;
