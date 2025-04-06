
import { modelApi } from '@/services/apiClient';
import { toast } from '@/components/ui/use-toast';
import { config } from '@/config';

/**
 * Utility functions for interacting with the ML model backend
 */
export const modelIntegration = {
  /**
   * Check if model backend is available and operational
   */
  checkModelAvailability: async () => {
    try {
      const response = await modelApi.checkHealth();
      return {
        available: true,
        status: response.data.status || 'OK',
        version: response.data.version || 'Unknown'
      };
    } catch (error) {
      console.error('Model backend is not available:', error);
      return {
        available: false,
        status: 'Unavailable',
        version: 'Unknown'
      };
    }
  },
  
  /**
   * Run a player performance prediction
   */
  predictPlayerPerformance: async (playerId: number, metrics: string[] = ['avg', 'hr', 'rbi']) => {
    try {
      const response = await modelApi.predict('player', { 
        player_id: playerId,
        metrics
      });
      
      return {
        success: true,
        predictions: response.data.predictions || {},
        confidence: response.data.confidence || {},
        timestamp: response.data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Player prediction failed:', error);
      toast({
        title: "Prediction Failed",
        description: "Could not generate player performance prediction. Please try again later.",
        variant: "destructive"
      });
      
      return {
        success: false,
        predictions: {},
        confidence: {},
        timestamp: new Date().toISOString()
      };
    }
  },
  
  /**
   * Run a team performance prediction
   */
  predictTeamPerformance: async (teamId: number, metrics: string[] = ['win_pct', 'runs_per_game']) => {
    try {
      const response = await modelApi.predict('team', { 
        team_id: teamId,
        metrics
      });
      
      return {
        success: true,
        predictions: response.data.predictions || {},
        confidence: response.data.confidence || {},
        timestamp: response.data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Team prediction failed:', error);
      toast({
        title: "Prediction Failed",
        description: "Could not generate team performance prediction. Please try again later.",
        variant: "destructive"
      });
      
      return {
        success: false,
        predictions: {},
        confidence: {},
        timestamp: new Date().toISOString()
      };
    }
  },
  
  /**
   * Run a game outcome prediction
   */
  predictGameOutcome: async (gameId: number) => {
    try {
      const response = await modelApi.predict('game', { 
        game_id: gameId
      });
      
      return {
        success: true,
        homeWinProbability: response.data.home_win_probability,
        predictedScore: response.data.predicted_score,
        keyFactors: response.data.key_factors,
        timestamp: response.data.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Game prediction failed:', error);
      toast({
        title: "Prediction Failed",
        description: "Could not generate game outcome prediction. Please try again later.",
        variant: "destructive"
      });
      
      return {
        success: false,
        homeWinProbability: 0.5,
        predictedScore: { home: 0, away: 0 },
        keyFactors: [],
        timestamp: new Date().toISOString()
      };
    }
  },
  
  /**
   * Get detailed model information
   */
  getModelDetails: async (modelType: string = 'ml') => {
    try {
      const infoResponse = await modelApi.getModelInfo(modelType);
      const metricsResponse = await modelApi.getModelMetrics(modelType);
      
      return {
        info: infoResponse.data,
        metrics: metricsResponse.data,
        version: infoResponse.data?.version || config.app.modelVersion || '1.0.0',
        lastUpdated: infoResponse.data?.last_updated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch model details:', error);
      return {
        info: {},
        metrics: {},
        version: config.app.modelVersion || '1.0.0',
        lastUpdated: new Date().toISOString()
      };
    }
  }
};

export default modelIntegration;
