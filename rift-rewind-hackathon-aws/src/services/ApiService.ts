import type { Contest, TournamentWinner, MasteryData, LayerData, ConfigData } from './types';

export class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || 'https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/';
  
  constructor() {
    // Production: URL injected by GitHub Actions from CDK outputs
    // Development: Falls back to hardcoded URL
    if (import.meta.env.DEV) {
      console.log('Development mode - API URL:', this.baseUrl);
    }
  }

  async fetchContests(year: string): Promise<Contest[]> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=contests&year=${year}`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      return [
        {id: 'worlds2024', name: 'Worlds Championship 2024', status: 'completed', winner: 'T1'},
        {id: 'msi2024', name: 'Mid-Season Invitational 2024', status: 'completed', winner: 'Gen.G'}
      ];
    }
  }

  async fetchSummoners(year: string): Promise<TournamentWinner[]> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=summoners&year=${year}`);
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
      
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch summoners:', error);
      throw error;
    }
  }

  async fetchChampionProficiency(champion: string): Promise<MasteryData[]> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=champion-mastery&champion=${champion}`);
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

  async fetchLayeredSystem(): Promise<LayerData[]> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=challenger&trace=layers`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to trace layers:', error);
      return [];
    }
  }

  async fetchDynamicConfig(): Promise<ConfigData[]> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=champion-rotations&config=dynamic`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch dynamic config:', error);
      return [];
    }
  }
}