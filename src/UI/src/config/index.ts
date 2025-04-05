
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    backendUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000',
    timeout: 5000,
    endpoints: {
      teams: import.meta.env.VITE_API_TEAMS_ENDPOINT || '/api/analysis/team',
      players: import.meta.env.VITE_API_PLAYERS_ENDPOINT || '/api/analysis/player',
      games: import.meta.env.VITE_API_GAMES_ENDPOINT || '/api/analysis/game',
      analysis: import.meta.env.VITE_API_ANALYSIS_ENDPOINT || '/analyze'
    }
  },
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'Baseball Analytics',
    version: '1.0.0',
    isModelEnabled: import.meta.env.VITE_MODEL_ENABLED === 'true',
    modelVersion: import.meta.env.VITE_MODEL_VERSION || '1.0',
    isAnalyticsEnabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    isAuthEnabled: import.meta.env.VITE_ENABLE_AUTH === 'true',
    environment: import.meta.env.MODE || 'development',
  },
  database: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: import.meta.env.VITE_DB_PORT || 5432,
    name: import.meta.env.VITE_DB_NAME || 'baseball_analytics',
    user: import.meta.env.VITE_DB_USER || 'postgres',
    password: import.meta.env.VITE_DB_PASSWORD || 'postgres',
  },
  redis: {
    url: import.meta.env.VITE_REDIS_URL || 'redis://localhost:6379',
    password: import.meta.env.VITE_REDIS_PASSWORD || '',
  },
  auth: {
    tokenKey: 'jwt_token',
    expirationTime: '24h',
  },
  features: {
    enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REALTIME === 'true' || true,
    enableExportFeature: import.meta.env.VITE_ENABLE_EXPORT === 'true' || true,
    enableAdvancedCharts: import.meta.env.VITE_ENABLE_ADVANCED_CHARTS === 'true' || true,
  }
};
