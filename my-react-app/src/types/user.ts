export type Role = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}