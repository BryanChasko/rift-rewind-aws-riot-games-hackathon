import type { Contest, TournamentWinner, MasteryData, LayerData, ConfigData } from './types';

export class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || '';
  
  constructor() {
    // Production: URL injected by GitHub Actions from CDK outputs
    // Development: Falls back to hardcoded URL
    if (import.meta.env.DEV) {
      console.log('Development mode - API URL:', this.baseUrl);
    }
  }

  async fetchContests(year: string): Promise<Contest[]> {
    try {
      console.log(`Fetching contests for year: ${year}`);
      const response = await fetch(`${this.baseUrl}?endpoint=contests&year=${year}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Contests API response:', data);
      
      // Lambda returns empty data for contests endpoint - this is expected
      // The API call succeeds but returns no data, demonstrating the uniform interface
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      throw error; // Let the component handle the error and fallback
    }
  }

  async fetchSummoners(year: string): Promise<TournamentWinner[]> {
    try {
      console.log(`Fetching summoners for year: ${year}`);
      const response = await fetch(`${this.baseUrl}?endpoint=challenger-league&year=${year}`);
      const data = await response.json();
      
      if (response.status === 403) {
        throw new Error(`API key expired or invalid. Response: ${JSON.stringify(data)}. 🔗 Check repo: https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon`);
      }
      if (response.status === 401) {
        throw new Error(`API key unauthorized. Response: ${JSON.stringify(data)}. 🔗 Check repo: https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon`);
      }
      if (!response.ok) {
        throw new Error(`API error: ${response.status}. Response: ${JSON.stringify(data)}. 🔗 Check repo: https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon`);
      }
      
      console.log('Summoners API response:', data);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch summoners:', error);
      throw error;
    }
  }

  async fetchChampionProficiency(champion: string, year?: string): Promise<MasteryData[]> {
    try {
      const url = year ? 
        `${this.baseUrl}?endpoint=champion-mastery&champion=${champion}&year=${year}` :
        `${this.baseUrl}?endpoint=champion-mastery&champion=${champion}`;
      
      console.log(`Fetching champion proficiency for: ${champion}${year ? ` (year: ${year})` : ''}`);
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.status === 403) {
        throw new Error(`API key expired or invalid. Response: ${JSON.stringify(data)}. 🔗 Check repo: https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon`);
      }
      if (response.status === 401) {
        throw new Error(`API key unauthorized. Response: ${JSON.stringify(data)}. 🔗 Check repo: https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon`);
      }
      if (!response.ok) {
        throw new Error(`API error: ${response.status}. Response: ${JSON.stringify(data)}. 🔗 Check repo: https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon`);
      }
      
      console.log('Champion proficiency API response:', data);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch champion proficiency:', error);
      throw error;
    }
  }

  async fetchDataDragon(champion: string): Promise<void> {
    try {
      await fetch(`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion}.png`);
    } catch (error) {
      console.error('Failed to fetch data dragon:', error);
    }
  }

  async fetchLayeredSystem(year?: string): Promise<LayerData[]> {
    try {
      const url = year ? 
        `${this.baseUrl}?endpoint=challenger&trace=layers&year=${year}` :
        `${this.baseUrl}?endpoint=challenger&trace=layers`;
      
      console.log(`Fetching layered system data${year ? ` for year: ${year}` : ''}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Layered system API response:', data);
      return data.data || [];
    } catch (error) {
      console.error('Failed to trace layers:', error);
      return [];
    }
  }

  async fetchDynamicConfig(year?: string): Promise<ConfigData[]> {
    try {
      const url = year ? 
        `${this.baseUrl}?endpoint=champion-rotations&config=dynamic&year=${year}` :
        `${this.baseUrl}?endpoint=champion-rotations&config=dynamic`;
      
      console.log(`Fetching dynamic config${year ? ` for year: ${year}` : ''}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Dynamic config API response:', data);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch dynamic config:', error);
      return [];
    }
  }
}