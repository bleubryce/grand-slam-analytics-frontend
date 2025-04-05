
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { config } from '@/config';
import { ApiResponse, LoginResponse, User } from './types';

// Create a mock API response for development
const createMockLoginResponse = (credentials: { username: string; password: string }): AxiosResponse<ApiResponse<LoginResponse>> => {
  const mockUser: User = {
    id: '1',
    username: credentials.username,
    email: `${credentials.username}@example.com`,
    role: 'user'
  };

  const mockResponse: ApiResponse<LoginResponse> = {
    status: 'success',
    message: 'Login successful',
    data: {
      token: 'mock-jwt-token',
      user: mockUser
    },
    timestamp: new Date().toISOString()
  };

  return {
    data: mockResponse,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  };
};

// Auth Service
class AuthService {
  private useMockResponse: boolean;

  constructor() {
    // Use mock responses in development if the backend is not available
    this.useMockResponse = config.app.environment === 'development';
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    try {
      // For development, allow any username/password
      if (this.useMockResponse) {
        console.log('Using mock login response in development');
        return Promise.resolve(createMockLoginResponse(credentials));
      }
      
      // In production, call the real API
      return apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    const token = localStorage.getItem(config.auth.tokenKey);
    
    if (this.useMockResponse) {
      console.log('Using mock logout response in development');
      const mockResponse: ApiResponse<null> = {
        status: 'success',
        message: 'Logout successful',
        data: null,
        timestamp: new Date().toISOString()
      };
      
      return Promise.resolve({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      });
    }
    
    return apiClient.post<ApiResponse<null>>(
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
    
    if (this.useMockResponse) {
      console.log('Using mock getCurrentUser response in development');
      const storedUser = JSON.parse(localStorage.getItem('user_data') || 'null');
      
      const mockResponse: ApiResponse<User> = {
        status: 'success',
        message: 'User retrieved successfully',
        data: storedUser || {
          id: '1',
          username: 'demouser',
          email: 'demo@example.com',
          role: 'user'
        },
        timestamp: new Date().toISOString()
      };
      
      return Promise.resolve({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      });
    }
    
    return apiClient.get<ApiResponse<User>>(
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
