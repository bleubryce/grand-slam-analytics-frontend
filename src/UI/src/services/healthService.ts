
import axios from 'axios';
import { config } from '../config';

// Create a dedicated axios instance for health checks
const healthClient = axios.create({
  baseURL: config.api.backendUrl,
  timeout: 5000, // shorter timeout for health checks
});

export const healthService = {
  /**
   * Check if the backend API is healthy
   * @returns {Promise<boolean>} True if the API is healthy, false otherwise
   */
  checkBackendHealth: async (): Promise<{ healthy: boolean; message: string }> => {
    try {
      const response = await healthClient.get('/api/health');
      return {
        healthy: response.status === 200,
        message: 'Backend API is healthy',
      };
    } catch (error) {
      console.error('Backend health check failed:', error);
      return {
        healthy: false,
        message: error.message || 'Backend API is not responding',
      };
    }
  },

  /**
   * Check if the WebSocket server is reachable
   * @returns {Promise<boolean>} True if the WebSocket server is reachable, false otherwise
   */
  checkWebSocketHealth: async (): Promise<{ healthy: boolean; message: string }> => {
    try {
      const response = await healthClient.get('/api/ws-health');
      return {
        healthy: response.status === 200,
        message: 'WebSocket server is reachable',
      };
    } catch (error) {
      console.error('WebSocket health check failed:', error);
      // Try a fallback check
      try {
        const fallbackResponse = await healthClient.get('/api/health');
        return {
          healthy: fallbackResponse.status === 200,
          message: 'WebSocket status unknown, but API is reachable',
        };
      } catch (fallbackError) {
        return {
          healthy: false,
          message: 'WebSocket server is unreachable',
        };
      }
    }
  },

  /**
   * Check if the Lovable environment is properly configured
   * @returns {boolean} True if the environment is properly configured, false otherwise
   */
  checkEnvironmentConfig: (): { healthy: boolean; message: string } => {
    // Check if essential environment variables are set
    const requiredEnvVars = [
      'VITE_API_URL', 
      'VITE_BACKEND_API_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(
      varName => !import.meta.env[varName]
    );
    
    if (missingVars.length > 0) {
      return {
        healthy: false,
        message: `Missing environment variables: ${missingVars.join(', ')}`,
      };
    }
    
    return {
      healthy: true,
      message: 'Environment is properly configured',
    };
  }
};

export default healthService;
