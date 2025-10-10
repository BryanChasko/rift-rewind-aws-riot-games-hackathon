import type { Contest } from './types';

export class ApiService {
  private baseUrl = 'https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/';

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

  async fetchSummoners(year: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}?endpoint=summoners&year=${year}`);
    } catch (error) {
      console.error('Failed to fetch summoners:', error);
    }
  }

  async fetchChampionMastery(champion: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}?endpoint=champion-mastery&champion=${champion}`);
    } catch (error) {
      console.error('Failed to fetch champion mastery:', error);
    }
  }

  async fetchDataDragon(champion: string): Promise<void> {
    try {
      await fetch(`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion}.png`);
    } catch (error) {
      console.error('Failed to fetch data dragon:', error);
    }
  }

  async fetchLayeredSystem(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}?endpoint=challenger&trace=layers`);
    } catch (error) {
      console.error('Failed to trace layers:', error);
    }
  }

  async fetchDynamicConfig(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}?endpoint=champion-rotations&config=dynamic`);
    } catch (error) {
      console.error('Failed to fetch dynamic config:', error);
    }
  }
}