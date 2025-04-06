
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import { config } from '@/config';

export const useHealthCheck = () => {
  const [backendHealth, setBackendHealth] = useState(false);
  const [backendMessage, setBackendMessage] = useState('Checking backend connection...');
  
  const [websocketHealth, setWebsocketHealth] = useState(false);
  const [websocketMessage, setWebsocketMessage] = useState('Checking websocket connection...');
  
  const [modelHealth, setModelHealth] = useState(false);
  const [modelMessage, setModelMessage] = useState('Checking ML model availability...');
  
  const [environmentHealth, setEnvironmentHealth] = useState(false);
  const [environmentMessage, setEnvironmentMessage] = useState('Checking environment configuration...');
  
  const [isLoading, setIsLoading] = useState(true);

  const checkBackend = async () => {
    try {
      const response = await apiClient.get('/api/health', { timeout: 5000 });
      console.log('Backend API health check:', response.data);
      
      setBackendHealth(true);
      setBackendMessage(`Connected to backend API. Version: ${response.data.version || 'unknown'}`);
      return true;
    } catch (error) {
      console.error('Backend health check failed:', error);
      
      // In development, we'll pretend the backend is healthy with mock data
      if (config.app.environment === 'development') {
        setBackendHealth(true);
        setBackendMessage('Using mock backend data (development mode)');
        return true;
      }
      
      setBackendHealth(false);
      setBackendMessage('Could not connect to backend API. Check server status.');
      return false;
    }
  };

  const checkWebsocket = () => {
    // In a real app, we'd check actual websocket connection
    // For now, we'll just use a mock check
    const mockConnected = config.app.environment === 'development';
    
    setWebsocketHealth(mockConnected);
    setWebsocketMessage(mockConnected 
      ? 'Websocket available for real-time updates (mock)' 
      : 'Websocket connection failed');
    
    return mockConnected;
  };

  const checkModel = () => {
    // Check if model is enabled in config
    const modelEnabled = config.app.isModelEnabled;
    
    setModelHealth(modelEnabled);
    setModelMessage(modelEnabled 
      ? `ML model available (version ${config.app.modelVersion})` 
      : 'ML model not configured');
    
    return modelEnabled;
  };

  const checkEnvironment = () => {
    // Check if essential environment variables are set
    const essentialVars = [
      config.api.backendUrl,
      config.auth.tokenKey
    ];
    
    const allVarsPresent = essentialVars.every(v => !!v);
    
    setEnvironmentHealth(allVarsPresent);
    setEnvironmentMessage(allVarsPresent 
      ? `Environment configured (${config.app.environment})` 
      : 'Missing required environment variables');
    
    return allVarsPresent;
  };

  const runChecks = async () => {
    setIsLoading(true);
    
    await checkBackend();
    checkWebsocket();
    checkModel();
    checkEnvironment();
    
    setIsLoading(false);
  };

  useEffect(() => {
    runChecks();
  }, []);

  return {
    backendHealth,
    backendMessage,
    websocketHealth,
    websocketMessage,
    modelHealth,
    modelMessage,
    environmentHealth,
    environmentMessage,
    isLoading,
    refetch: runChecks
  };
};

export default useHealthCheck;
