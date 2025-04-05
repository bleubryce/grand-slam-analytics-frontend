
import { useState, useEffect, useCallback } from 'react';
import { websocketService, GameUpdate, StatsUpdate } from '../services/websocketService';
import { useAuth } from '@/contexts/AuthContext';

export const useWebSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  
  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        websocketService.connect(token);
        const checkConnectionStatus = () => {
          setIsConnected(websocketService.getConnectionStatus() === 'connected');
        };
        
        // Check initial connection status
        checkConnectionStatus();
        
        // Set up interval to check connection status
        const interval = setInterval(checkConnectionStatus, 5000);
        
        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [user]);
  
  // Subscribe to game updates
  const subscribeToGame = useCallback((gameId: number) => {
    try {
      websocketService.subscribeToGame(gameId);
    } catch (error) {
      console.error('Failed to subscribe to game:', error);
    }
  }, []);
  
  // Unsubscribe from game updates
  const unsubscribeFromGame = useCallback((gameId: number) => {
    try {
      websocketService.unsubscribeFromGame(gameId);
    } catch (error) {
      console.error('Failed to unsubscribe from game:', error);
    }
  }, []);
  
  // Subscribe to player updates
  const subscribeToPlayer = useCallback((playerId: number) => {
    try {
      websocketService.subscribeToPlayer(playerId);
    } catch (error) {
      console.error('Failed to subscribe to player:', error);
    }
  }, []);
  
  // Unsubscribe from player updates
  const unsubscribeFromPlayer = useCallback((playerId: number) => {
    try {
      websocketService.unsubscribeFromPlayer(playerId);
    } catch (error) {
      console.error('Failed to unsubscribe from player:', error);
    }
  }, []);
  
  // Register game update listener
  const onGameUpdate = useCallback((callback: (update: GameUpdate) => void) => {
    return websocketService.onGameUpdate(callback);
  }, []);
  
  // Register stats update listener
  const onStatsUpdate = useCallback((callback: (update: StatsUpdate) => void) => {
    return websocketService.onStatsUpdate(callback);
  }, []);
  
  return {
    isConnected,
    subscribeToGame,
    unsubscribeFromGame,
    subscribeToPlayer,
    unsubscribeFromPlayer,
    onGameUpdate,
    onStatsUpdate
  };
};

export default useWebSocket;
