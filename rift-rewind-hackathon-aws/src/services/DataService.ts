import type { TournamentWinner, LayerData, ConfigData } from './types';

export class DataService {
  getTournamentWinners(year: string): TournamentWinner[] {
    const winnersData: Record<string, TournamentWinner[]> = {
      '2024': [
        { player: 'Faker', team: 'T1', championPlayed: 'Azir', tournamentWins: 16, tournamentLosses: 2, winRate: 88.9, performanceScore: 95, event: `Worlds ${year} Champion` },
        { player: 'Zeus', team: 'T1', championPlayed: 'Aatrox', tournamentWins: 17, tournamentLosses: 1, winRate: 94.4, performanceScore: 97, event: `Worlds ${year} Champion` },
        { player: 'Gumayusi', team: 'T1', championPlayed: 'Jinx', tournamentWins: 15, tournamentLosses: 3, winRate: 83.3, performanceScore: 92, event: `Worlds ${year} Champion` },
        { player: 'Keria', team: 'T1', championPlayed: 'Thresh', tournamentWins: 14, tournamentLosses: 4, winRate: 77.8, performanceScore: 89, event: `Worlds ${year} Champion` },
        { player: 'Oner', team: 'T1', championPlayed: 'Graves', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` }
      ],
      '2023': [
        { player: 'Faker', team: 'T1', championPlayed: 'Azir', tournamentWins: 14, tournamentLosses: 4, winRate: 77.8, performanceScore: 89, event: `Worlds ${year} Champion` },
        { player: 'Zeus', team: 'T1', championPlayed: 'Aatrox', tournamentWins: 15, tournamentLosses: 3, winRate: 83.3, performanceScore: 92, event: `Worlds ${year} Champion` },
        { player: 'Gumayusi', team: 'T1', championPlayed: 'Jinx', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` },
        { player: 'Keria', team: 'T1', championPlayed: 'Thresh', tournamentWins: 12, tournamentLosses: 6, winRate: 66.7, performanceScore: 84, event: `Worlds ${year} Champion` },
        { player: 'Oner', team: 'T1', championPlayed: 'Graves', tournamentWins: 11, tournamentLosses: 7, winRate: 61.1, performanceScore: 81, event: `Worlds ${year} Champion` }
      ],
      '2022': [
        { player: 'Deft', team: 'DRX', championPlayed: 'Jinx', tournamentWins: 12, tournamentLosses: 6, winRate: 66.7, performanceScore: 84, event: `Worlds ${year} Champion` },
        { player: 'Kingen', team: 'DRX', championPlayed: 'Aatrox', tournamentWins: 11, tournamentLosses: 7, winRate: 61.1, performanceScore: 81, event: `Worlds ${year} Champion` },
        { player: 'Pyosik', team: 'DRX', championPlayed: 'Graves', tournamentWins: 10, tournamentLosses: 8, winRate: 55.6, performanceScore: 78, event: `Worlds ${year} Champion` },
        { player: 'Zeka', team: 'DRX', championPlayed: 'Azir', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` },
        { player: 'BeryL', team: 'DRX', championPlayed: 'Thresh', tournamentWins: 9, tournamentLosses: 9, winRate: 50.0, performanceScore: 75, event: `Worlds ${year} Champion` }
      ],
      '2021': [
        { player: 'Viper', team: 'EDG', championPlayed: 'Jinx', tournamentWins: 11, tournamentLosses: 7, winRate: 61.1, performanceScore: 81, event: `Worlds ${year} Champion` },
        { player: 'Flandre', team: 'EDG', championPlayed: 'Graves', tournamentWins: 10, tournamentLosses: 8, winRate: 55.6, performanceScore: 78, event: `Worlds ${year} Champion` },
        { player: 'Jiejie', team: 'EDG', championPlayed: 'Graves', tournamentWins: 12, tournamentLosses: 6, winRate: 66.7, performanceScore: 84, event: `Worlds ${year} Champion` },
        { player: 'Scout', team: 'EDG', championPlayed: 'Azir', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` },
        { player: 'Meiko', team: 'EDG', championPlayed: 'Thresh', tournamentWins: 9, tournamentLosses: 9, winRate: 50.0, performanceScore: 75, event: `Worlds ${year} Champion` }
      ]
    };
    return winnersData[year] || winnersData['2024'];
  }

  getLayerData(): LayerData[] {
    return [
      { layer: 'CloudFront CDN', description: 'Global edge cache', purpose: 'Content delivery', latency: 5, visible: false },
      { layer: 'Application Load Balancer', description: 'Traffic distribution', purpose: 'Load balancing', latency: 2, visible: false },
      { layer: 'API Gateway', description: 'Request routing', purpose: 'API management', latency: 8, visible: false },
      { layer: 'Lambda Function', description: 'Serverless compute', purpose: 'Business logic', latency: 15, visible: false },
      { layer: 'RDS Database', description: 'Persistent storage', purpose: 'Data retrieval', latency: 12, visible: false },
      { layer: 'Response Aggregation', description: 'Data formatting', purpose: 'JSON response', latency: 3, visible: true }
    ];
  }

  getConfigData(): ConfigData[] {
    return [
      { config: 'Champion Rotation', description: 'Free-to-play champions', instruction: 'Enable rotation UI', behavior: 'Show free champions', adapted: true },
      { config: 'Action Buttons', description: 'Available operations', instruction: 'Configure actions', behavior: 'Dynamic button states', adapted: true },
      { config: 'Data Validation', description: 'Input constraints', instruction: 'Set validation rules', behavior: 'Runtime validation', adapted: true },
      { config: 'Error Handling', description: 'Fallback behavior', instruction: 'Define error states', behavior: 'Graceful degradation', adapted: true },
      { config: 'Navigation Flow', description: 'Page transitions', instruction: 'Configure routing', behavior: 'Dynamic navigation', adapted: true }
    ];
  }
}