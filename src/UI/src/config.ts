
// App configuration
interface AppConfig {
  isModelEnabled: boolean;
  modelVersion: string;
  environment: 'development' | 'production' | 'test';
}

// API configuration
interface ApiConfig {
  backendUrl: string;
  websocketUrl: string;
  timeout: number;
}

// Full configuration
export interface Config {
  app: AppConfig;
  api: ApiConfig;
}

// Environment variables with fallbacks
export const config: Config = {
  app: {
    isModelEnabled: import.meta.env.VITE_MODEL_ENABLED === 'true' || true, // Enable model by default
    modelVersion: import.meta.env.VITE_MODEL_VERSION || '1.0.0',
    environment: (import.meta.env.MODE || 'development') as 'development' | 'production' | 'test'
  },
  api: {
    backendUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001', // Updated to match backend port
    websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
  }
};
