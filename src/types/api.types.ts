export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export function pickResult<T>(res: ApiResponse<T>): T | undefined {
  return res.result ?? (res as { Result?: T }).Result;
}
