
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { config } from '@/config';
import { ApiResponse, LoginResponse, User } from './types';

class AuthService {
  private useMockResponse: boolean;

  constructor() {
    // Use mock responses in development if the backend is not available
    // Set to true to use mock responses in development
    this.useMockResponse = config.app.environment === 'development';
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    try {
      // For development, allow only admin/password if mocks are enabled
      if (this.useMockResponse) {
        console.log('Using mock login response in development');
        
        // Check if credentials match expected values
        const validCredentials = 
          (credentials.username.toLowerCase() === 'admin' && credentials.password === 'password');
        
        // If not valid, return error
        if (!validCredentials) {
          console.warn('Invalid credentials in mock mode. Valid credentials are: username=admin, password=password');
          return Promise.reject({ 
            response: { 
              data: { 
                status: 'error',
                message: 'Invalid username or password. Please try again.',
                data: null
              } 
            } 
          });
        }
        
        return Promise.resolve(this.createMockLoginResponse(credentials));
      }
      
      // In production, call the real API
      return apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    console.log('Logging out user...');
    const token = localStorage.getItem(config.auth.tokenKey);
    
    if (this.useMockResponse) {
      console.log('Using mock logout response in development');
      // Always clear local storage regardless of mode
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem('user_data');
      
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
    
    if (this.useMockResponse) {
      console.log('Using mock getCurrentUser response in development');
      const storedUser = JSON.parse(localStorage.getItem('user_data') || 'null');
      
      // If no stored user, return a default admin user
      const user = storedUser || {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'  // Default role is admin in mock mode
      };
      
      const mockResponse: ApiResponse<User> = {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
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

  // Helper method to create mock login responses for development
  private createMockLoginResponse(credentials: { username: string; password: string }): AxiosResponse<ApiResponse<LoginResponse>> {
    const isAdmin = credentials.username.toLowerCase() === 'admin';
    
    const mockUser: User = {
      id: '1',
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      role: isAdmin ? 'admin' : 'user'
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

    // Store user data in localStorage
    localStorage.setItem(config.auth.tokenKey, 'mock-jwt-token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    return {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };
  }
}

export const authService = new AuthService();
