
import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';
import { ApiConfig } from './types';

// Create the base axios instance for API calls
export const createApiClient = (apiConfig?: ApiConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig?.baseUrl || config.api.backendUrl,
    timeout: apiConfig?.timeout || config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(apiConfig?.headers || {})
    }
  });
  
  // Add request interceptor for auth
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem(config.auth?.tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  return instance;
};

// Default API client instance
export const apiClient = createApiClient();
