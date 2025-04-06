
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { config } from '@/config';
import { ApiResponse, LoginResponse, User } from './types';

class AuthService {
  constructor() {
    console.log('AuthService initialized - Using real API authentication');
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    try {
      console.log('Attempting to login with credentials:', { username: credentials.username, password: '********' });
      
      // Make the API call to the backend - use the correct endpoint from Security/routes.ts
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
      
      console.log('Login response received:', response.status, response.data);
      
      // If successful, store the token in localStorage
      if (response.data?.data?.token || response.data?.token) {
        const token = response.data?.data?.token || response.data?.token;
        localStorage.setItem(config.auth.tokenKey, token);
        console.log('Token stored in localStorage:', token.substring(0, 10) + '...');
        
        // Store user data if available
        const userData = response.data?.data?.user || response.data?.user;
        if (userData) {
          localStorage.setItem('user_data', JSON.stringify(userData));
          console.log('User data stored in localStorage');
        }
      } else {
        console.error('No token received in response:', response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  }

  async logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    console.log('Logging out user...');
    const token = localStorage.getItem(config.auth.tokenKey);
    
    try {
      const response = await apiClient.post<ApiResponse<null>>('/api/auth/logout');
      
      // Always clear local storage on logout
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem('user_data');
      console.log('Cleared auth data from localStorage');
      
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
    console.log('Getting current user data...');
    const token = localStorage.getItem(config.auth.tokenKey);
    
    if (!token) {
      console.log('No token found, user is not authenticated');
      return Promise.reject('No authentication token found');
    }
    
    return apiClient.get<ApiResponse<User>>('/api/auth/me');
  }
}

export const authService = new AuthService();
