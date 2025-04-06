
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { config } from '@/config';
import { ApiResponse, LoginResponse, User } from './types';

class AuthService {
  private useMockResponse: boolean;

  constructor() {
    // Always use real responses, set to false to disable mocks
    this.useMockResponse = false;
    console.log('AuthService initialized - Using real API responses');
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    try {
      console.log('Logging in with credentials:', { username: credentials.username, password: '********' });
      
      // Call the real API
      return apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    console.log('Logging out user...');
    const token = localStorage.getItem(config.auth.tokenKey);
    
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Always clear local storage on logout
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem('user_data');
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local storage
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem('user_data');
      
      throw error;
    }
  }

  async getCurrentUser(): Promise<AxiosResponse<ApiResponse<User>>> {
    const token = localStorage.getItem(config.auth.tokenKey);
    
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
