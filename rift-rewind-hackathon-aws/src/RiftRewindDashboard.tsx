import React, { useState, useEffect } from 'react';
import { Table, Header, Container, Button } from '@cloudscape-design/components';

interface MatchSummary {
  matchId: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  champion: string;
}

const RIOT_API_PROXY_URL = 'https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/';

const RiftRewindDashboard: React.FC = () => {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMatchHistory = async () => {
    setLoading(true);
    try {
      if (RIOT_API_PROXY_URL.includes('PLACEHOLDER')) {
        // Mock API response - replace with actual fetch when Lambda is ready
        const mockMatches: MatchSummary[] = [
          { matchId: 'NA1_4567890123', kills: 12, deaths: 3, assists: 8, win: true, champion: 'Jinx' },
          { matchId: 'NA1_4567890124', kills: 5, deaths: 7, assists: 15, win: false, champion: 'Thresh' },
          { matchId: 'NA1_4567890125', kills: 18, deaths: 2, assists: 4, win: true, champion: 'Yasuo' }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMatches(mockMatches);
      } else {
        // Real API call
        const response = await fetch(`${RIOT_API_PROXY_URL}?summoner=Doublelift`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch match history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchHistory();
  }, []);

  const columnDefinitions = [
    {
      id: 'matchId',
      header: 'Match ID',
      cell: (item: MatchSummary) => item.matchId,
    },
    {
      id: 'champion',
      header: 'Champion',
      cell: (item: MatchSummary) => item.champion,
    },
    {
      id: 'kda',
      header: 'KDA',
      cell: (item: MatchSummary) => `${item.kills}/${item.deaths}/${item.assists}`,
    },
    {
      id: 'result',
      header: 'Result',
      cell: (item: MatchSummary) => item.win ? 'Victory' : 'Defeat',
    },
  ];

  return (
    <Container header={<Header variant="h2">Match History</Header>}>
      <Table
        columnDefinitions={columnDefinitions}
        items={matches}
        loading={loading}
        header={
          <Header
            counter={`(${matches.length})`}
            actions={
              <Button onClick={fetchMatchHistory} loading={loading}>
                Refresh
              </Button>
            }
          >
            Recent Matches
          </Header>
        }
        empty="No matches found"
      />
    </Container>
  );
};

export default RiftRewindDashboard;