export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenRequest {
  token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface AuthResult {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number; // giây
}

export interface IntrospectResult {
  active: boolean;
}
