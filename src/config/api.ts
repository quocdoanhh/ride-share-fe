// API Configuration
export const API_CONFIG = {
  // Base URL for API calls - using relative URL with Vite proxy
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',

  // CORS settings - not needed with proxy
  CORS: {
    mode: 'cors' as RequestMode,
    credentials: 'include' as RequestCredentials,
  },

  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  // Timeout settings (in milliseconds)
  TIMEOUT: 10000,
}
