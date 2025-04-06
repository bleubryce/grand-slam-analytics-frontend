
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
      console.log('Checking backend health at:', config.api.backendUrl);
      const response = await apiClient.get('/api/health', { timeout: 8000 });
      console.log('Backend API health check result:', response.data);
      
      if (response.data && response.status === 200) {
        setBackendHealth(true);
        setBackendMessage(`Connected to backend API. Version: ${response.data.version || response.data.data?.version || 'unknown'}`);
        return true;
      } else {
        throw new Error('Backend returned unexpected response');
      }
    } catch (error: any) {
      console.error('Backend health check failed:', error);
      
      let errorMessage = 'Could not connect to backend API. Check server status.';
      if (error?.response?.status) {
        errorMessage += ` Status: ${error.response.status}`;
      } else if (error?.message) {
        errorMessage += ` Error: ${error.message}`;
      }
      
      setBackendHealth(false);
      setBackendMessage(errorMessage);
      return false;
    }
  };

  const checkWebsocket = () => {
    // In a real app, we'd check actual websocket connection
    // This is a placeholder for real websocket connection check
    setWebsocketHealth(false);
    setWebsocketMessage('Websocket connection not implemented yet');
    
    return false;
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
    console.log('Running health checks...');
    
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
