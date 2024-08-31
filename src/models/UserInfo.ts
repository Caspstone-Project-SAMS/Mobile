export interface UserInfo {
  // Success
  token?: string;
  result?: UserDetail;
  // Error
  isSuccess?: boolean;
  title?: string;
  errors?: string[];
}

interface UserDetail {
  id: string;
  employeeID: string;
  email?: string;
  avatar?: string;
  gender: number;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: string;
  twoFactorEnabled: string;
  lockoutEnd?: string;
  lockoutEnabled: string;
  filePath?: string;
  displayName?: string;
  role: Role;
  createdBy?: string;
  createdAt: Date;
}

interface Role {
  id: string;
  name?: string;
  createdBy?: string;
  createdAt: Date;
}
