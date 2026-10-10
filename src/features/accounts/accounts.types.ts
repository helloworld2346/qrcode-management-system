export interface RoleEntity {
  idRole: string;
  roleName: string;
}

export interface Account {
  idAccount: string;
  accountName: string;
  password: string;
  userName: string;
  roleEntity: RoleEntity;
}

export interface CreateAccountRequest {
  accountName: string;
  password: string;
  userName: string;
  role: string;
}
