export type AccountRole = "admin" | "editor" | "viewer";

export interface Account {
  id: string;
  username: string;
  full_name: string;
  role: AccountRole;
  department_id?: string;
  department_name?: string;
  is_locked: boolean;
  created_at: string;
}

export interface CreateAccountRequest {
  username: string;
  password: string;
  full_name: string;
  role: AccountRole;
  department_id?: string;
}

export interface UpdateAccountRequest {
  full_name: string;
  role: AccountRole;
  department_id?: string;
}

export interface ResetPasswordRequest {
  new_password: string;
}
