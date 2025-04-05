
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
  token: string;
  user: User;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface PlayerStats {
  battingAverage?: string;
  homeRuns?: number;
  rbi?: number;
  onBasePercentage?: string;
  sluggingPercentage?: string;
  hits?: number;
  atBats?: number;
  strikeouts?: number;
  walks?: number;
}

export interface PitcherStats {
  era?: string;
  wins?: number;
  losses?: number;
  inningsPitched?: number;
  strikeouts?: number;
  walks?: number;
  whip?: string;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  teamId: number;
  number?: number;
  isPitcher?: boolean;
  battingAverage?: string;
  homeRuns?: number;
  rbi?: number;
  era?: string;
  wins?: number;
  losses?: number;
  strikeouts?: number;
  photoUrl?: string;
  stats?: any;
}

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
  private api: AxiosInstance;
  private useMockResponse: boolean;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.backendUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Use mock responses in development if the backend is not available
    this.useMockResponse = config.app.environment === 'development';
    
    // Add request interceptor for auth
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem(config.auth.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    try {
      // For development, allow any username/password
      if (this.useMockResponse) {
        console.log('Using mock login response in development');
        return Promise.resolve(createMockLoginResponse(credentials));
      }
      
      return this.api.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
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

// Rest of your API services would go here
// For example: PlayerService, TeamService, etc.

// Mock player service for development
class PlayerService {
  private api: AxiosInstance;
  private useMockResponse: boolean;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.backendUrl,
      timeout: config.api.timeout
    });
    
    // Use mock responses in development
    this.useMockResponse = config.app.environment === 'development';
    
    // Add request interceptor for auth
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem(config.auth.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  async getPlayers() {
    if (this.useMockResponse) {
      console.log('Using mock players response in development');
      const mockPlayers = [
        { id: 1, firstName: 'Mike', lastName: 'Trout', position: 'CF', teamId: 1, number: 27, battingAverage: '.312', homeRuns: 42, rbi: 99 },
        { id: 2, firstName: 'Aaron', lastName: 'Judge', position: 'RF', teamId: 2, number: 99, battingAverage: '.287', homeRuns: 51, rbi: 108 },
        { id: 3, firstName: 'Shohei', lastName: 'Ohtani', position: 'DH', teamId: 3, number: 17, battingAverage: '.304', homeRuns: 44, rbi: 95 },
        { id: 4, firstName: 'Jacob', lastName: 'deGrom', position: 'P', teamId: 4, number: 48, era: '2.38', wins: 14, losses: 5, strikeouts: 255 },
        { id: 5, firstName: 'Freddie', lastName: 'Freeman', position: '1B', teamId: 5, number: 5, battingAverage: '.325', homeRuns: 28, rbi: 102 },
        { id: 6, firstName: 'Mookie', lastName: 'Betts', position: 'RF', teamId: 5, number: 50, battingAverage: '.300', homeRuns: 35, rbi: 85 },
        { id: 7, firstName: 'Gerrit', lastName: 'Cole', position: 'SP', teamId: 2, number: 45, era: '3.22', wins: 15, losses: 7, strikeouts: 238 },
        { id: 8, firstName: 'Juan', lastName: 'Soto', position: 'LF', teamId: 6, number: 22, battingAverage: '.275', homeRuns: 32, rbi: 89 },
        { id: 9, firstName: 'Max', lastName: 'Scherzer', position: 'SP', teamId: 7, number: 31, era: '2.96', wins: 12, losses: 6, strikeouts: 210 }
      ];
      
      const mockResponse: ApiResponse<Player[]> = {
        status: 'success',
        message: 'Players retrieved successfully',
        data: mockPlayers,
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
    
    return this.api.get<ApiResponse<Player[]>>('/api/players');
  }

  async getPlayer(id: number) {
    return this.api.get<ApiResponse<Player>>(`/api/players/${id}`);
  }

  async createPlayer(player: Omit<Player, 'id'>) {
    return this.api.post<ApiResponse<Player>>('/api/players', player);
  }

  async updatePlayer(id: number, player: Partial<Player>) {
    return this.api.put<ApiResponse<Player>>(`/api/players/${id}`, player);
  }

  async deletePlayer(id: number) {
    return this.api.delete<ApiResponse<null>>(`/api/players/${id}`);
  }

  async getPlayerStats(id: number) {
    return this.api.get<ApiResponse<any>>(`/api/players/${id}/stats`);
  }
}

export const playerService = new PlayerService();
