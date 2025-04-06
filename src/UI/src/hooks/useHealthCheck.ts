
import { useState, useEffect } from 'react';
import { healthService } from '../services/healthService';
import { config } from '../config';

export const useHealthCheck = () => {
  const [backendHealth, setBackendHealth] = useState(false);
  const [backendMessage, setBackendMessage] = useState('Checking backend connection...');
  
  const [websocketHealth, setWebsocketHealth] = useState(false);
  const [websocketMessage, setWebsocketMessage] = useState('Checking websocket connection...');
  
  const [modelHealth, setModelHealth] = useState(false);
  const [modelMessage, setModelMessage] = useState('Checking ML model availability...');
  const [modelDetails, setModelDetails] = useState(null);
  
  const [environmentHealth, setEnvironmentHealth] = useState(false);
  const [environmentMessage, setEnvironmentMessage] = useState('Checking environment configuration...');
  
  const [isLoading, setIsLoading] = useState(true);

  const checkBackend = async () => {
    try {
      console.log('Checking backend health at:', config.api.backendUrl);
      const result = await healthService.checkBackendHealth();
      
      console.log('Backend API health check result:', result);
      
      setBackendHealth(result.healthy);
      setBackendMessage(result.message);
      return result.healthy;
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

  const checkWebsocket = async () => {
    try {
      const result = await healthService.checkWebSocketHealth();
      setWebsocketHealth(result.healthy);
      setWebsocketMessage(result.message);
      return result.healthy;
    } catch (error) {
      setWebsocketHealth(false);
      setWebsocketMessage('Error checking websocket connection');
      return false;
    }
  };

  const checkModel = async () => {
    // If model is not enabled in config, don't check it
    if (!config.app?.isModelEnabled) {
      setModelHealth(false);
      setModelMessage('ML model integration is disabled in configuration');
      return false;
    }

    try {
      const result = await healthService.checkModelHealth();
      setModelHealth(result.healthy);
      setModelMessage(result.message);
      
      // Get detailed model info if basic check passes
      if (result.healthy) {
        try {
          const detailedResult = await healthService.checkDetailedModelHealth();
          setModelDetails(detailedResult.details);
        } catch (detailsError) {
          console.error('Failed to fetch detailed model info:', detailsError);
        }
      }
      
      return result.healthy;
    } catch (error) {
      setModelHealth(false);
      setModelMessage('Error checking ML model status');
      return false;
    }
  };

  const checkEnvironment = () => {
    // Check if essential environment variables are set
    const result = healthService.checkEnvironmentConfig();
    setEnvironmentHealth(result.healthy);
    setEnvironmentMessage(result.message);
    return result.healthy;
  };

  const runChecks = async () => {
    setIsLoading(true);
    console.log('Running health checks...');
    
    await checkBackend();
    await checkWebsocket();
    await checkModel();
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
    modelDetails,
    environmentHealth,
    environmentMessage,
    isLoading,
    refetch: runChecks
  };
};

export default useHealthCheck;
