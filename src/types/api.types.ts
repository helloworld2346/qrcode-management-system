export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: ApiError;
}

export interface ListResult<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export function pickData<T>(res: ApiResponse<T>): T | undefined {
  return res.ok ? res.data : undefined;
}

export function errorMessage(err: unknown, fallback = "Có lỗi xảy ra"): string {
  const e = err as {
    response?: { data?: ApiResponse<unknown> };
    message?: string;
  };
  const apiErr = e?.response?.data?.error;
  if (apiErr?.fields && Object.keys(apiErr.fields).length > 0) {
    const detail = Object.entries(apiErr.fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    return `${apiErr.message} (${detail})`;
  }
  if (apiErr?.message) return apiErr.message;
  return e?.message ?? fallback;
}
