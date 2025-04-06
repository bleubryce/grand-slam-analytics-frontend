
import axios from 'axios';
import { config } from '@/config';
import { handleApiError } from '@/utils/errorHandler';

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
      console.log('Added auth token to request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error);
    
    // Handle 401 Unauthorized responses by clearing auth state
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized response, clearing auth state');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Use the error handler utility for other errors
    return handleApiError(error);
  }
);

// Export the API client
export default apiClient;
