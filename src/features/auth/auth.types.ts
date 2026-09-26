export interface LoginRequest {
  userName: string;
  password: string;
}

export interface TokenRequest {
  token: string;
}

export interface ChangePasswordRequest {
  matKhau: string;
}

export interface AuthResult {
  token: string;
  authenticated: boolean;
}

export interface IntrospectResult {
  valid: boolean;
}
