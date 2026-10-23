export interface Account {
  id: string;
  username: string;
  full_name: string;
  role: "admin" | "user";
  department_id?: string;
  department_name?: string;
  is_locked: boolean;
  created_at: string;
}

export interface CreateAccountRequest {
  username: string;
  password: string;
  full_name: string;
  role: "admin" | "user";
  department_id?: string;
}

export interface ResetPasswordRequest {
  new_password: string;
}
