// This file is kept for backward compatibility
// The application now uses the custom backend API instead of Prisma
// See lib/api.ts for the API client implementation

// API base URL for our backend
export const API_BASE_URL = 'http://localhost:5000/api';

export const fetchFromAPI = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching from API:', error);
    throw error;
  }
};
