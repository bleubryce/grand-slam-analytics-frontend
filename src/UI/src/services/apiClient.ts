
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

// Create a separate instance for ML model API requests
export const modelApi = axios.create({
  baseURL: config.api.modelUrl || config.api.backendUrl,
  timeout: config.api.timeout * 2, // Double timeout for model requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(config.auth?.tokenKey || 'jwt_token');
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

// Same interceptor for model API
modelApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(config.auth?.tokenKey || 'jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added auth token to model request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Model API request interceptor error:', error);
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
      localStorage.removeItem(config.auth?.tokenKey || 'jwt_token');
      localStorage.removeItem('user_data');
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Same error handling for model API
modelApi.interceptors.response.use(
  (response) => {
    console.log(`Model API response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Model API response error:', error);
    
    // Handle 401 Unauthorized responses by clearing auth state
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized response, clearing auth state');
      localStorage.removeItem(config.auth?.tokenKey || 'jwt_token');
      localStorage.removeItem('user_data');
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced Model API methods
modelApi.getModelInfo = async (modelType) => {
  console.log(`Fetching model info for: ${modelType}`);
  return await modelApi.get(`/api/models/${modelType}/info`);
};

modelApi.getModelMetrics = async (modelType) => {
  console.log(`Fetching model metrics for: ${modelType}`);
  return await modelApi.get(`/api/models/${modelType}/metrics`);
};

modelApi.predict = async (modelType, inputData) => {
  console.log(`Running prediction for model type: ${modelType}`, inputData);
  return await modelApi.post(`/api/models/${modelType}/predict`, inputData);
};

modelApi.train = async (modelType, trainingData) => {
  console.log(`Training model type: ${modelType} with data:`, trainingData);
  return await modelApi.post(`/api/models/${modelType}/train`, trainingData);
};

modelApi.checkHealth = async () => {
  console.log('Checking model health status');
  return await modelApi.get('/health');
};

// Export the API clients
export default apiClient;
