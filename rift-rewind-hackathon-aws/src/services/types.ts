export interface Contest {
  id: string;
  name: string;
  status: string;
  winner: string;
  points: number;
  participants: number;
  difficulty: string;
  category: string;
  year: string;
}

export interface TournamentWinner {
  player: string;
  team: string;
  championPlayed: string;
  tournamentWins: number;
  tournamentLosses: number;
  winRate: number;
  performanceScore: number;
  event: string;
}

export interface Champion {
  id: string;
  name: string;
  title: string;
}

export interface MasteryData {
  championId: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
}

export interface LayerData {
  layer: string;
  description: string;
  purpose: string;
  latency: number;
  visible: boolean;
}

export interface ConfigData {
  config: string;
  description: string;
  instruction: string;
  behavior: string;
  adapted: boolean;
}

export type DataMode = 'demo' | 'live';
export type ConstraintSection = 'contests' | 'champions' | 'champion-details' | 'data-dragon' | 'challenger' | 'dynamic';