export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'customer' | 'seller' | 'admin';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}
