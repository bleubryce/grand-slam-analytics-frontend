
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@/config';

// API response types
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: User;
  }
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Auth Service
class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.backendUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    return this.api.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
  }

  async logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    const token = localStorage.getItem(config.auth.tokenKey);
    return this.api.post<ApiResponse<null>>(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  async getCurrentUser(): Promise<AxiosResponse<ApiResponse<User>>> {
    const token = localStorage.getItem(config.auth.tokenKey);
    return this.api.get<ApiResponse<User>>(
      '/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}

export const authService = new AuthService();
