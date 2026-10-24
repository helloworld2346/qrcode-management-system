export type AuditEntity =
  | "asset"
  | "account"
  | "category"
  | "attribute"
  | "inventory_session"
  | "auth";

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity: AuditEntity;
  entity_id: string;
  detail: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLogFilter {
  page?: number;
  size?: number;
  actor_id?: string;
  entity?: AuditEntity;
  action?: string;
}

export const ENTITY_LABELS: Record<AuditEntity, string> = {
  asset: "Tài sản",
  account: "Tài khoản",
  category: "Danh mục",
  attribute: "Thuộc tính",
  inventory_session: "Phiên kiểm kê",
  auth: "Đăng nhập",
};

export const ENTITY_OPTIONS: { value: AuditEntity; label: string }[] = (
  Object.keys(ENTITY_LABELS) as AuditEntity[]
).map((e) => ({ value: e, label: ENTITY_LABELS[e] }));

export const ACTION_LABELS: Record<string, string> = {
  "account.create": "Tạo tài khoản",
  "account.lock": "Khóa tài khoản",
  "account.unlock": "Mở khóa tài khoản",
  "account.reset_password": "Đặt lại mật khẩu",
  "asset.create": "Tạo tài sản",
  "asset.update": "Sửa tài sản",
  "asset.status_change": "Đổi trạng thái",
  "asset.delete": "Xóa tài sản",
  "asset.mark_printed": "In tem QR",
  "attribute.create": "Tạo thuộc tính",
  "attribute.delete": "Xóa thuộc tính",
  "category.create": "Tạo danh mục",
  "category.update": "Sửa danh mục",
  "category.delete": "Xóa danh mục",
  "category.assign_attribute": "Gắn thuộc tính",
  "category.remove_attribute": "Gỡ thuộc tính",
  "inventory.create_session": "Tạo phiên kiểm kê",
  "inventory.close_session": "Đóng phiên kiểm kê",
  "auth.login_failed": "Đăng nhập thất bại",
};

export function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}
