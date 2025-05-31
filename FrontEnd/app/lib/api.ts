// API Client for F1 World Champions Backend

// Environment-based API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorData
      } as ApiError;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Unable to connect to API server at ${this.baseUrl}. Please ensure the backend is running.`);
      }
      
      // Re-throw the original error if it's already an ApiError
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      
      // Wrap unknown errors
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.get('/health');
  }

  // Championships endpoints
  async getAllChampionships(): Promise<any[]> {
    const response = await this.get<any[]>('/championships');
    
    // The backend returns a direct array, not wrapped in a value property
    if (!Array.isArray(response)) {
      console.warn('Expected array response from championships endpoint, got:', typeof response);
      return [];
    }
    
    // Transform the backend data to match frontend expectations
    return response
      .filter(championship => {
        // Filter out invalid entries
        return championship && 
               championship._id && 
               championship.season && 
               championship.driverId && 
               championship.constructorId;
      })
      .map(championship => ({
        id: championship._id,
        season: parseInt(championship.season) || 0,
        points: parseInt(championship.points) || 0,
        wins: parseInt(championship.wins) || 0,
        driver: {
          id: championship.driverId,
          code: championship.driverId.toUpperCase(),
          givenName: this.getDriverFirstName(championship.driverId),
          familyName: this.getDriverLastName(championship.driverId),
          dateOfBirth: "1990-01-01", // Placeholder
          nationality: this.getDriverNationality(championship.driverId),
        },
        constructor: {
          id: championship.constructorId,
          name: this.getConstructorName(championship.constructorId),
          nationality: this.getConstructorNationality(championship.constructorId),
        }
      }));
  }

  // Helper methods to transform driver/constructor IDs to full objects
  private getDriverFirstName(driverId: string): string {
    const driverNames: Record<string, string> = {
      'max_verstappen': 'Max',
      'hamilton': 'Lewis',
      'alonso': 'Fernando',
      'piastri': 'Oscar',
      'leclerc': 'Charles',
      'sainz': 'Carlos',
      'norris': 'Lando',
      'russell': 'George',
      'perez': 'Sergio',
      'bottas': 'Valtteri'
    };
    return driverNames[driverId] || driverId.split('_')[0];
  }

  private getDriverLastName(driverId: string): string {
    const driverNames: Record<string, string> = {
      'max_verstappen': 'Verstappen',
      'hamilton': 'Hamilton',
      'alonso': 'Alonso',
      'piastri': 'Piastri',
      'leclerc': 'Leclerc',
      'sainz': 'Sainz',
      'norris': 'Norris',
      'russell': 'Russell',
      'perez': 'Pérez',
      'bottas': 'Bottas'
    };
    return driverNames[driverId] || driverId.split('_')[1] || driverId;
  }

  private getDriverNationality(driverId: string): string {
    const driverNationalities: Record<string, string> = {
      'max_verstappen': 'Dutch',
      'hamilton': 'British',
      'alonso': 'Spanish',
      'piastri': 'Australian',
      'leclerc': 'Monégasque',
      'sainz': 'Spanish',
      'norris': 'British',
      'russell': 'British',
      'perez': 'Mexican',
      'bottas': 'Finnish'
    };
    return driverNationalities[driverId] || 'Unknown';
  }

  private getConstructorName(constructorId: string): string {
    const constructorNames: Record<string, string> = {
      'red_bull': 'Red Bull Racing',
      'mercedes': 'Mercedes',
      'ferrari': 'Ferrari',
      'mclaren': 'McLaren',
      'alpine': 'Alpine',
      'aston_martin': 'Aston Martin',
      'williams': 'Williams',
      'alphatauri': 'AlphaTauri',
      'alfa': 'Alfa Romeo',
      'haas': 'Haas',
      'renault': 'Renault'
    };
    return constructorNames[constructorId] || constructorId;
  }

  private getConstructorNationality(constructorId: string): string {
    const constructorNationalities: Record<string, string> = {
      'red_bull': 'Austrian',
      'mercedes': 'German',
      'ferrari': 'Italian',
      'mclaren': 'British',
      'alpine': 'French',
      'aston_martin': 'British',
      'williams': 'British',
      'alphatauri': 'Italian',
      'alfa': 'Swiss',
      'haas': 'American',
      'renault': 'French'
    };
    return constructorNationalities[constructorId] || 'Unknown';
  }

  async getChampionshipBySeason(year: number): Promise<any> {
    return this.get(`/championships/${year}`);
  }

  // Races endpoints
  async getAllRaces(): Promise<any[]> {
    const response = await this.get<any[]>('/races/all');
    
    // The backend returns a direct array, not wrapped in a value property
    if (!Array.isArray(response)) {
      console.warn('Expected array response from races endpoint, got:', typeof response);
      return [];
    }
    
    // Transform the backend data to match frontend expectations
    return response
      .filter(race => {
        // Filter out invalid entries
        return race && 
               race._id && 
               race.season && 
               race.round && 
               race.raceName;
      })
      .map(race => ({
        id: race._id,
        season: parseInt(race.season) || 0,
        round: parseInt(race.round) || 0,
        raceName: race.raceName || 'Unknown Race',
        date: race.date || '',
        time: race.time || '',
        circuitId: race.circuit?.circuitId || '',
        circuitName: race.circuit?.circuitName || 'Unknown Circuit',
        circuitUrl: race.circuit?.url || '',
        locality: race.circuit?.location?.locality || '',
        country: race.circuit?.location?.country || '',
        winner: race.results && race.results.length > 0 ? {
          id: race.results[0].driverId || '',
          code: (race.results[0].driverId || '').toUpperCase(),
          givenName: this.getDriverFirstName(race.results[0].driverId || ''),
          familyName: this.getDriverLastName(race.results[0].driverId || ''),
          dateOfBirth: "1990-01-01", // Placeholder
          nationality: this.getDriverNationality(race.results[0].driverId || ''),
        } : {
          id: '',
          code: '',
          givenName: 'Unknown',
          familyName: 'Driver',
          dateOfBirth: "1990-01-01",
          nationality: 'Unknown',
        },
        constructor: race.results && race.results.length > 0 ? {
          id: race.results[0].constructorId || '',
          name: this.getConstructorName(race.results[0].constructorId || ''),
          nationality: this.getConstructorNationality(race.results[0].constructorId || ''),
        } : {
          id: '',
          name: 'Unknown Constructor',
          nationality: 'Unknown',
        },
        grid: race.results && race.results.length > 0 ? parseInt(race.results[0].grid) || 0 : 0,
        laps: race.results && race.results.length > 0 ? parseInt(race.results[0].laps) || 0 : 0,
        status: race.results && race.results.length > 0 ? race.results[0].status || 'Finished' : 'Unknown'
      }));
  }

  async getRacesBySeason(year: number): Promise<any[]> {
    return this.get(`/races/season/${year}`);
  }

  async getRaceBySeasonAndRound(year: number, round: number): Promise<any> {
    return this.get(`/races/season/${year}/round/${round}`);
  }

  // Drivers endpoints
  async getAllDrivers(): Promise<any[]> {
    return this.get('/drivers');
  }

  async getDriverById(id: string): Promise<any> {
    return this.get(`/drivers/${id}`);
  }

  // Constructors endpoints
  async getAllConstructors(): Promise<any[]> {
    return this.get('/constructors');
  }

  async getConstructorById(id: string): Promise<any> {
    return this.get(`/constructors/${id}`);
  }

  // Lap Data endpoints
  async getLapData(year: number, round: number): Promise<any> {
    return this.get(`/races/season/${year}/round/${round}/laps`);
  }

  async getLapDataByLapNumber(year: number, round: number, lapNumber: number): Promise<any> {
    return this.get(`/races/season/${year}/round/${round}/laps/${lapNumber}`);
  }

  async updateLapData(year: number, round: number): Promise<any> {
    return this.post(`/races/season/${year}/round/${round}/laps/update`);
  }

  // PitStop Data endpoints
  async getPitStopData(year: number, round: number): Promise<any> {
    return this.get(`/races/season/${year}/round/${round}/pitstops`);
  }

  async getPitStopDataByDriver(year: number, round: number, driverId: string): Promise<any> {
    return this.get(`/races/season/${year}/round/${round}/pitstops/driver/${driverId}`);
  }

  async updatePitStopData(year: number, round: number): Promise<any> {
    return this.post(`/races/season/${year}/round/${round}/pitstops/update`);
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Legacy compatibility function for existing code
export const fetchFromAPI = async (endpoint: string, options = {}) => {
  return apiClient.get(endpoint, options);
};

// Export API base URL for reference
export { API_BASE_URL }; 