import React, { useState, useEffect } from 'react';
import { Table, Header, Container, Button, Box, SpaceBetween, ColumnLayout, Alert } from '@cloudscape-design/components';

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
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [demoError, setDemoError] = useState(false);

  const simulateError = () => {
    setDemoError(true);
    setErrorMessage('Demo Error: Simulated API failure (using dummy data for demonstration) | 🔧 Riot API key may be expired - Contact @bryanChasko on GitHub or LinkedIn to refresh the developer key or get a production API key!');
    setApiResponse('❌ Demo: Simulated 403 Forbidden or network error - This is dummy data for testing error handling');
    setDataSource('mock');
    
    const mockMatches: MatchSummary[] = [
      { matchId: 'DEMO_ERROR_1', kills: 0, deaths: 0, assists: 0, win: false, champion: 'DUMMY DATA - Error Demo Simulation' },
      { matchId: 'DEMO_ERROR_2', kills: 0, deaths: 0, assists: 0, win: false, champion: 'DUMMY DATA - Contact @bryanChasko for real API fix' }
    ];
    setMatches(mockMatches);
  };
  
  const fetchMatchHistory = async () => {
    setLoading(true);
    setDemoError(false);
    setErrorMessage('');
    setApiResponse('');
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
        try {
          console.log('Fetching from:', RIOT_API_PROXY_URL);
          const response = await fetch(RIOT_API_PROXY_URL);
          
          setApiResponse(`Status: ${response.status} ${response.statusText}`);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const responseText = await response.text();
          console.log('Raw API response:', responseText);
          
          const data = JSON.parse(responseText);
          console.log('Parsed API data:', data);
          
          // Check if we got valid data
          if (data.error) {
            throw new Error(`API Error: ${data.error}`);
          }
          
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('API returned empty or invalid data');
          }
          
          setMatches(data);
          setDataSource('live');
          setErrorMessage('');
          setApiResponse(`✅ Success: Loaded ${data.length} champions from Riot API`);
          
        } catch (apiError) {
          const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
          console.error('API Error:', errorMsg);
          setErrorMessage(`API Error: ${errorMsg} | 🔧 Riot API key may be expired - Contact @bryanChasko on GitHub or LinkedIn to refresh the developer key or get a production API key!`);
          
          const mockMatches: MatchSummary[] = [
            { matchId: 'NA1_4567890123', kills: 12, deaths: 3, assists: 8, win: true, champion: 'Jinx' },
            { matchId: 'NA1_4567890124', kills: 5, deaths: 7, assists: 15, win: false, champion: 'Thresh' },
            { matchId: 'NA1_4567890125', kills: 18, deaths: 2, assists: 4, win: true, champion: 'Yasuo' }
          ];
          setMatches(mockMatches);
          setDataSource('mock');
        }
      }
    } catch (error) {
      console.error('Failed to fetch match history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load mock data immediately for demo
    const mockMatches: MatchSummary[] = [
      { matchId: 'NA1_4567890123', kills: 12, deaths: 3, assists: 8, win: true, champion: 'Jinx' },
      { matchId: 'NA1_4567890124', kills: 5, deaths: 7, assists: 15, win: false, champion: 'Thresh' },
      { matchId: 'NA1_4567890125', kills: 18, deaths: 2, assists: 4, win: true, champion: 'Yasuo' }
    ];
    setMatches(mockMatches);
    setDataSource('mock');
    
    // Then try to fetch real data only if not in demo error mode
    if (!demoError) {
      fetchMatchHistory();
    }
  }, [demoError]);

  const columnDefinitions = [
    {
      id: 'champion',
      header: 'Champion Name',
      cell: (item: MatchSummary) => item.champion,
    },
    {
      id: 'matchId',
      header: 'Data ID',
      cell: (item: MatchSummary) => item.matchId,
    },
    {
      id: 'kills',
      header: 'Attack Power',
      cell: (item: MatchSummary) => item.kills,
    },
    {
      id: 'deaths',
      header: 'Defense Rating',
      cell: (item: MatchSummary) => item.deaths,
    },
    {
      id: 'assists',
      header: 'Speed Rating',
      cell: (item: MatchSummary) => item.assists,
    },
    {
      id: 'result',
      header: 'Tier Status',
      cell: (item: MatchSummary) => item.win ? '⭐ S-Tier' : '🔸 A-Tier',
    },
  ];

  return (
    <SpaceBetween direction="vertical" size="l">
      {(errorMessage || apiResponse) && (
        <Alert 
          type={dataSource === 'live' ? 'success' : 'warning'}
          header="API Status"
          dismissible
          onDismiss={() => { setErrorMessage(''); setApiResponse(''); }}
        >
          {apiResponse && <div><strong>Response:</strong> {apiResponse}</div>}
          {errorMessage && (
            <div>
              <strong>Error:</strong> {errorMessage}<br/>
              {!demoError && (
                <small>
                  📧 <strong>Contact:</strong> 
                  <a href="https://github.com/BryanChasko" target="_blank" rel="noopener noreferrer">GitHub @bryanChasko</a> | 
                  <a href="https://linkedin.com/in/bryanchasko" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </small>
              )}
            </div>
          )}
          <div><strong>Endpoint:</strong> {RIOT_API_PROXY_URL}</div>
        </Alert>
      )}
      
      <Container header={
        <Header 
          variant="h2" 
          description={dataSource === 'live' ? '🟢 Live champion data from Riot Games Data Dragon API - Real stats updated from League of Legends servers' : '🟡 Demo data (Live Riot API attempted, showing sample match data)'}
        >
          Live Champion Performance Data
        </Header>
      }>
        <Table
          columnDefinitions={columnDefinitions}
          items={matches}
          loading={loading}
          header={
            <Header
              counter={`(${matches.length})`}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={fetchMatchHistory} loading={loading}>
                    Refresh Live Data
                  </Button>
                  <Button onClick={simulateError} variant="normal">
                    Error Handling Demo
                  </Button>
                </SpaceBetween>
              }
            >
              {dataSource === 'live' ? 'Live Riot API Data' : 'Demo Match Data'}
            </Header>
          }
          empty="No champion data available"
        />
      </Container>
      
      <Container header={<Header variant="h3">🌐 REST API Fundamentals + Live Champion Data</Header>}>
        <SpaceBetween direction="vertical" size="m">
          <Box variant="h4">🔗 The 6 REST Constraints in Our Implementation</Box>
          <Box variant="p">
            <strong>REST</strong> (REpresentational State Transfer) defines 6 architectural constraints. Our live Riot Games API integration demonstrates all of them:
          </Box>
          
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h4">1️⃣ Uniform Interface</Box>
              <Box variant="p">
                <strong>Endpoint:</strong> <code>ddragon.leagueoflegends.com/cdn/15.20.1/data/en_US/champion.json</code><br/>
                • Standard HTTP GET method<br/>
                • Consistent JSON format for all champions<br/>
                • Self-descriptive with name, title, stats, tags<br/>
                • Resource identification via unique champion keys
              </Box>
            </div>
            
            <div>
              <Box variant="h4">2️⃣ Client-Server</Box>
              <Box variant="p">
                <strong>Architecture:</strong> React → AWS Lambda → Riot API<br/>
                • <strong>Client:</strong> React frontend (UI concerns)<br/>
                • <strong>Server:</strong> AWS Lambda (data processing)<br/>
                • <strong>Data:</strong> Riot API (champion storage)<br/>
                • Each layer can evolve independently
              </Box>
            </div>
            
            <div>
              <Box variant="h4">3️⃣ Stateless</Box>
              <Box variant="p">
                <strong>Every Request Contains All Info:</strong><br/>
                • No server-side sessions or stored context<br/>
                • Each API call is completely independent<br/>
                • Complete champion data in single response<br/>
                • Client manages application state (React state)
              </Box>
            </div>
            
            <div>
              <Box variant="h4">4️⃣ Cacheable</Box>
              <Box variant="p">
                <strong>Multi-Layer Caching:</strong><br/>
                • <strong>CloudFront CDN:</strong> Edge location caching<br/>
                • <strong>Browser:</strong> Client-side HTTP caching<br/>
                • <strong>GET requests:</strong> Cacheable by default<br/>
                • Version-based cache invalidation (15.20.1)
              </Box>
            </div>
            
            <div>
              <Box variant="h4">5️⃣ Layered System</Box>
              <Box variant="p">
                <strong>Our Layers (Client Can't Tell):</strong><br/>
                • <strong>CDN Layer:</strong> CloudFront distribution<br/>
                • <strong>API Layer:</strong> AWS Lambda function<br/>
                • <strong>Data Layer:</strong> Riot Games servers<br/>
                • Transparent to React frontend
              </Box>
            </div>
            
            <div>
              <Box variant="h4">6️⃣ Code on Demand (Optional)</Box>
              <Box variant="p">
                <strong>Dynamic Code Loading:</strong><br/>
                • JavaScript bundles loaded as needed<br/>
                • React components rendered dynamically<br/>
                • Error handling executed on demand<br/>
                • <em>Note: Optional constraint, rarely implemented</em>
              </Box>
            </div>
          </ColumnLayout>
          
          <Box variant="h4">📋 Champion Resource Structure</Box>
          <Box variant="p">
            <strong>REST Resource:</strong> Champions are resources with unique identifiers and properties. Here's the actual API response:
          </Box>
          <Box variant="code">
            {`// Live Riot API Response (What Powers Our Dashboard):
{
  "type": "champion",           // Resource type identification
  "format": "standAloneComplex", // Processing format
  "version": "15.20.1",         // Cache invalidation key
  "data": {
    "Aatrox": {                 // Resource identifier
      "id": "Aatrox",
      "key": "266",             // Unique champion key
      "name": "Aatrox",         // Retrieved as champion name
      "title": "The Darkin Blade", // Retrieved as champion.title
      "tags": ["Fighter", "Tank"], // Retrieved as champion.tags
      "stats": {
        "hp": 650,              // → Defense Rating (hp/100 = 6)
        "attackdamage": 60,     // → Attack Power (attackdamage/10 = 6)
        "movespeed": 345        // → Speed Rating (movespeed/20 = 17)
      }
    }
  }
}

// How We Transform It:
// Input: champion.stats.attackdamage = 60
// Output: Attack Power = 6 (60/10)
// Display: "Aatrox - The Darkin Blade (Fighter/Tank)"`}
          </Box>
          
          <Box variant="h4">🛠️ REST Principles vs Common Mistakes</Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h4">✅ RESTful (What We Do)</Box>
              <Box variant="p">
                <strong>Resource-based URI:</strong><br/>
                <code>GET /champion.json</code><br/><br/>
                <strong>HTTP Methods as Verbs:</strong><br/>
                <code>GET</code> for retrieval<br/>
                <code>POST</code> for creation<br/>
                <code>PUT</code> for updates<br/><br/>
                <strong>Stateless Requests:</strong><br/>
                Each request independent<br/><br/>
                <strong>Standard Status Codes:</strong><br/>
                200 OK, 404 Not Found, 500 Error
              </Box>
            </div>
            
            <div>
              <Box variant="h4">❌ Non-RESTful (Avoid These)</Box>
              <Box variant="p">
                <strong>RPC-style URIs:</strong><br/>
                <code>POST /getChampions</code><br/>
                <code>POST /updateChampion</code><br/><br/>
                <strong>Verbs in URIs:</strong><br/>
                <code>/champions/create</code><br/>
                <code>/champions/delete</code><br/><br/>
                <strong>Server-side Sessions:</strong><br/>
                Storing user state on server<br/><br/>
                <strong>Custom Protocols:</strong><br/>
                Non-standard communication methods
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
      
      <Container header={<Header variant="h3">📊 Technical Implementation Details</Header>}>
        <SpaceBetween direction="vertical" size="m">
          <Box variant="h4">🎮 What is League of Legends?</Box>
          <Box variant="p">
            League of Legends is a multiplayer online battle arena (MOBA) game where two teams of 5 players compete. Each player controls a unique <strong>champion</strong> - a character with distinct abilities, strengths, and weaknesses. Think of champions like different character classes in an RPG game.
          </Box>
          
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h4">🎯 Champion Examples</Box>
              <Box variant="p">
                <strong>Aatrox</strong>: A demonic warrior (melee fighter)<br/>
                <strong>Ahri</strong>: A magical fox spirit (ranged mage)<br/>
                <strong>Akali</strong>: A ninja assassin (stealth fighter)<br/>
                <strong>Alistar</strong>: A minotaur tank (support/tank)
              </Box>
            </div>
            
            <div>
              <Box variant="h4">⚔️ Attack Power (API: attackdamage)</Box>
              <Box variant="p">
                <strong>Retrieved from:</strong> <code>champion.stats.attackdamage</code><br/>
                <strong>Calculation:</strong> <code>attackdamage / 10</code> (scaled for display)<br/>
                Base physical damage - like "strength" in RPGs.
              </Box>
            </div>
            
            <div>
              <Box variant="h4">🛡️ Defense Rating (API: hp)</Box>
              <Box variant="p">
                <strong>Retrieved from:</strong> <code>champion.stats.hp</code><br/>
                <strong>Calculation:</strong> <code>hp / 100</code> (scaled for display)<br/>
                Health points - how much damage they can take.
              </Box>
            </div>
            
            <div>
              <Box variant="h4">💨 Speed Rating (API: movespeed)</Box>
              <Box variant="p">
                <strong>Retrieved from:</strong> <code>champion.stats.movespeed</code><br/>
                <strong>Calculation:</strong> <code>movespeed / 20</code> (scaled for display)<br/>
                Movement speed - battlefield mobility.
              </Box>
            </div>
            
            <div>
              <Box variant="h4">🏷️ Champion Name (API: name)</Box>
              <Box variant="p">
                <strong>Retrieved from:</strong> <code>champion.name</code><br/>
                <strong>Example:</strong> "Aatrox", "Ahri", "Akali"<br/>
                Direct from Riot's champion database.
              </Box>
            </div>
            
            <div>
              <Box variant="h4">🆔 Data ID (API: key)</Box>
              <Box variant="p">
                <strong>Retrieved from:</strong> <code>champion.key</code><br/>
                <strong>Format:</strong> <code>RIOT_LIVE_[champion.key]</code><br/>
                Unique champion identifier (e.g., 266 = Aatrox).
              </Box>
            </div>
            
            <div>
              <Box variant="h4">⭐ Tier Rankings</Box>
              <Box variant="p">
                <strong>S-Tier</strong>: Strongest champions (&gt;55 attack)<br/>
                <strong>A-Tier</strong>: Strong but balanced (≤55 attack)<br/>
                Similar to "tier lists" in fighting games.
              </Box>
            </div>
            
            <div>
              <Box variant="h4">🔗 API Endpoints & Data Flow</Box>
              <Box variant="p">
                <strong>Primary:</strong> <code>ddragon.leagueoflegends.com/cdn/15.20.1/data/en_US/champion.json</code><br/>
                <strong>Backup:</strong> Featured Games, Champion Mastery, Challenger Rankings<br/>
                <strong>Architecture:</strong> React → AWS Lambda → Riot API → Live Data<br/>
                <strong>Updates:</strong> Every 2 weeks with game patches
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default RiftRewindDashboard;