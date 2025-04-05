
import axios from 'axios';
import { config } from '@/config';

// Create an axios instance with default configuration
export const apiClient = axios.create({
  baseURL: config.api.backendUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses by clearing auth state
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
