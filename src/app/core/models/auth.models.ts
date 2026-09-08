export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  userId: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  permission?: string[];
  exp: number;
  iss: string;
  aud: string;
}

export interface Menu {
    id: number;
  name: string;
  route: string;
  icon: string;
  parentId: number | null;
  displayOrder: number;
  children: Menu[];
}
