import { statusLabel } from "@/features/assets/assets.types";
import type { ApiResponse } from "@/types/api.types";
import { logger } from "@/utils/logger";

export const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.",
  INVALID_CREDENTIALS: "Sai tên đăng nhập hoặc mật khẩu.",
  TOKEN_INVALID: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
  ACCOUNT_LOCKED: "Tài khoản đã bị khóa.",

  NOT_FOUND: "Không tìm thấy dữ liệu.",
  USER_NOT_FOUND: "Không tìm thấy tài khoản.",
  USER_EXISTS: "Tên đăng nhập đã tồn tại.",
  CONFLICT: "Dữ liệu bị xung đột.",
  ASSET_NOT_FOUND: "Không tìm thấy tài sản.",
  DEPARTMENT_REQUIRED: "Vui lòng chọn đơn vị cho tài khoản editor/viewer.",
  PASSWORD_TOO_SHORT: "Mật khẩu phải có ít nhất 8 ký tự.",

  BAD_REQUEST: "Yêu cầu không hợp lệ.",
  BAD_JSON: "Dữ liệu gửi lên không hợp lệ.",
  VALIDATION_FAILED: "Dữ liệu không hợp lệ.",
  INVALID_ATTRIBUTES: "Thuộc tính không hợp lệ.",

  NO_IDS: "Chưa chọn tài sản để in.",
  NO_PRINTABLE_ASSETS: "Không có tài sản nào có thể in trong phạm vi cho phép.",

  INTERNAL: "Có lỗi xảy ra phía máy chủ, vui lòng thử lại.",
};

interface ErrShape {
  response?: { data?: ApiResponse<unknown> };
  message?: string;
}

function transitionMessage(raw: string): string | undefined {
  const m = raw.match(/from:\s*([A-Z_]+);\s*to:\s*([A-Z_]+)/);
  if (!m) return undefined;
  return `Không thể chuyển trạng thái từ "${statusLabel(m[1])}" sang "${statusLabel(m[2])}".`;
}

export function errorMessage(err: unknown, fallback = "Có lỗi xảy ra"): string {
  const e = err as ErrShape;
  const apiErr = e?.response?.data?.error;

  if (apiErr) {
    const { code, message, fields } = apiErr;

    if (
      code === "INVALID_STATUS_TRANSITION" ||
      /status transition/i.test(message ?? "")
    ) {
      const from = fields?.from;
      const to = fields?.to;
      if (from && to) {
        return `Không thể chuyển trạng thái từ "${statusLabel(from)}" sang "${statusLabel(to)}".`;
      }
      const parsed = message ? transitionMessage(message) : undefined;
      if (parsed) return parsed;
    }

    if (
      code === "VALIDATION_FAILED" &&
      fields &&
      Object.keys(fields).length > 0
    ) {
      const detail = Object.entries(fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      const base = ERROR_MESSAGES[code] ?? message ?? fallback;
      return `${base} (${detail})`;
    }

    if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];

    if (code) {
      logger.warn(`[errorMessage] mã lỗi chưa dịch: ${code} — "${message}"`);
    }
    if (message) return message;
  }

  return e?.message ?? fallback;
}
