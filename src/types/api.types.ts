export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}
