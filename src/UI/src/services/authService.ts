
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { config } from '@/config';
import { ApiResponse, LoginResponse, User } from './types';

class AuthService {
  private useMockResponse: boolean;

  constructor() {
    // Use mock responses in development if the backend is not available
    // Set to false by default to use the real API endpoints
    this.useMockResponse = config.app.environment === 'development' && import.meta.env.VITE_USE_MOCK_API === 'true';
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    try {
      // For development, allow any username/password if mocks are enabled
      if (this.useMockResponse) {
        console.log('Using mock login response in development');
        
        // Try to match against known admin accounts for better simulation
        const isKnownAdmin = 
          (credentials.username.toLowerCase() === 'admin' && credentials.password === 'admin123') ||
          (credentials.username.toLowerCase() === 'admin' && credentials.password === 'baseball_admin_2025');
        
        if (!isKnownAdmin) {
          console.warn('Invalid credentials in mock mode. Valid credentials are: username=admin, password=admin123 or password=baseball_admin_2025');
          // Still allow login in mock/dev mode, but log a warning
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
    const token = localStorage.getItem(config.auth.tokenKey);
    
    if (this.useMockResponse) {
      console.log('Using mock logout response in development');
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
      role: isAdmin ? 'admin' : 'user'  // Assign admin role if username is admin
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
