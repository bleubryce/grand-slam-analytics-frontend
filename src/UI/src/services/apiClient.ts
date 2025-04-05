
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
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Use the error handler utility for other errors
    return handleApiError(error);
  }
);

// Model-specific API methods
export const modelApi = {
  // Run model prediction with provided data
  predict: async (modelType, inputData) => {
    return apiClient.post(`${config.api.endpoints.analysis}/${modelType}`, inputData);
  },
  
  // Get model metadata (version, parameters, etc)
  getModelInfo: async (modelType) => {
    return apiClient.get(`${config.api.endpoints.analysis}/model-info/${modelType}`);
  },
  
  // Get model performance metrics
  getModelMetrics: async (modelType) => {
    return apiClient.get(`${config.api.endpoints.analysis}/metrics/${modelType}`);
  }
};

export default apiClient;
