export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  organization_id: number | null;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface AuthState {
  token: Token | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} 