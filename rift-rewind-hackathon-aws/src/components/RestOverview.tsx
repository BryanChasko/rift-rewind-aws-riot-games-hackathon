import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Button, Grid } from '@cloudscape-design/components';

interface RestOverviewProps {
  onNavigate: (page: string) => void;
}

const RestOverview: React.FC<RestOverviewProps> = ({ onNavigate }) => {
  return (
    <Container header={<Header variant="h2">🌐 REST Constraints Overview</Header>} variant="default">
      <SpaceBetween direction="vertical" size="m">
        <Box variant="p">
          <strong>API</strong> (Application Programming Interface): Rules for programs to exchange data. <strong>REST</strong> (REpresentational State Transfer): 6 specific rules for designing APIs with standard web requests. Learn using League of Legends data - including details of the 160+ game characters known as Champions and our gamers known as Summoners.
        </Box>
        
        <div style={{ minWidth: '370px' }}>
          <Grid gridDefinition={[{ colspan: { default: 12, s: 6, m: 4 } }, { colspan: { default: 12, s: 6, m: 4 } }, { colspan: { default: 12, s: 6, m: 4 } }, { colspan: { default: 12, s: 6, m: 4 } }, { colspan: { default: 12, s: 6, m: 4 } }, { colspan: { default: 12, s: 6, m: 4 } }]}>
            <div style={{ minWidth: '330px' }}>
              <Container variant="stacked">
                <Header variant="h3">1️⃣ Uniform Interface</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p"><strong>Same pattern for all data requests.</strong> Player info, match history, champion details use identical request methods.</Box>
                  <Box variant="small">• <strong>Endpoints</strong>: Unique web addresses per data type<br/>• <strong>HTTP GET</strong>: Standard "retrieve data" command<br/>• <strong>JSON</strong>: Text format for returned data<br/>• <strong>Status codes</strong>: Numbers indicating success/failure</Box>
                  <Box variant="small" color="text-body-secondary">Example:</Box>
                  <Box variant="code">
                    {`// Same GET pattern for different data types
GET /summoner/by-name/Faker        (player info)
GET /match/by-player/{id}          (match history) 
GET /champions/config              (character list)

// All return data in JSON format: {"data": [...]}`}
                  </Box>
                  <Button variant="primary" onClick={() => onNavigate('uniform-interface')}>
                    🎯 Try Challenges API
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
            <div style={{ minWidth: '330px' }}>
              <Container variant="stacked">
                <Header variant="h3">2️⃣ Client-Server</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p"><strong>Two separate systems working together.</strong> Chrome requests data from Riot Games API independently.</Box>
                  <Box variant="small">• <strong>Client</strong>: Chrome, Safari, mobile apps requesting data<br/>• <strong>Server</strong>: Riot Games API storing game data<br/>• <strong>Independent</strong>: Each updates separately<br/>• <strong>Contract</strong>: Agreed communication format</Box>
                  <Box variant="small" color="text-body-secondary">Example:</Box>
                  <Box variant="code">
                    {`// Chrome sends request
fetch('https://api.riotgames.com/summoner/by-name/Faker')

// Riot Games API responds with player data
// Chrome and Riot API update independently
// Request format stays consistent`}
                  </Box>
                  <Button variant="primary" onClick={() => onNavigate('client-server')}>
                    🏗️ See Architecture in Action
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
            <div style={{ minWidth: '330px' }}>
              <Container variant="stacked">
                <Header variant="h3">3️⃣ Stateless</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p"><strong>Each request stands alone.</strong> Riot Games API doesn't remember previous requests, every call includes complete information.</Box>
                  <Box variant="small">• <strong>No memory</strong>: Riot API forgets each request after responding<br/>• <strong>API Key</strong>: Unique identifier proving authorization<br/>• <strong>Headers</strong>: Metadata fields containing API key<br/>• <strong>Self-contained</strong>: Each request has everything needed</Box>
                  <Box variant="small" color="text-body-secondary">Example:</Box>
                  <Box variant="code">
                    {`// Every request must include API key
fetch('/summoner/by-name/Faker', {
  headers: {
    'X-Riot-Token': 'RGAPI-your-key-here'
  }
});

// Riot API processes request with no memory of previous ones`}
                  </Box>
                  <Button variant="primary" onClick={() => onNavigate('stateless')}>
                    🔑 Test Authentication Flow
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
            <div style={{ minWidth: '330px' }}>
              <Container variant="stacked">
                <Header variant="h3">4️⃣ Cacheable</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p"><strong>Save data locally for faster loading.</strong> Game data never changes, applications store copies instead of repeated requests.</Box>
                  <Box variant="small">• <strong>Caching</strong>: Storing local data copy<br/>• <strong>Versioned URLs</strong>: Web addresses including version numbers<br/>• <strong>Cache-Control</strong>: Riot instructions for data retention<br/>• <strong>CDN</strong>: Global network storing copies</Box>
                  <Box variant="small" color="text-body-secondary">Example:</Box>
                  <Box variant="code">
                    {`// Version numbers in URLs mean data never changes
/cdn/13.24.1/champion-list.json    (game version 13.24.1)
/cdn/13.24.1/champion-ahri.png     (character image)

// Applications can save this data permanently
// Cache-Control: max-age=31536000 (1 year)`}
                  </Box>
                  <Button variant="primary" onClick={() => onNavigate('cacheable')}>
                    🌍 Experience CDN Speed
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
            <div style={{ minWidth: '330px' }}>
              <Container variant="stacked">
                <Header variant="h3">5️⃣ Layered System</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p"><strong>Complex systems hidden behind simple requests.</strong> Simple API calls pass through multiple invisible computer systems.</Box>
                  <Box variant="small">• <strong>API Gateway</strong>: Entry point routing requests<br/>• <strong>Load Balancer</strong>: Distributes traffic across Riot computers<br/>• <strong>Rate Limiting</strong>: Controls requests per minute<br/>• <strong>Microservices</strong>: Small programs handling specific tasks</Box>
                  <Box variant="small" color="text-body-secondary">Example:</Box>
                  <Box variant="code">
                    {`// Chrome makes one simple request
fetch('/summoner/by-name/Faker')

// Hidden Riot infrastructure processes request:
// 1. API Gateway (routes request)
// 2. Rate Limiter (checks request limits) 
// 3. Load Balancer (picks available computer)
// 4. Database (retrieves player data)`}
                  </Box>
                  <Button variant="primary" onClick={() => onNavigate('layered-system')}>
                    🔍 Explore Hidden Layers
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
            <div style={{ minWidth: '330px' }}>
              <Container variant="stacked">
                <Header variant="h3">6️⃣ Code on Demand</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p"><strong>Optional: Send programs to run.</strong> Instead of data only, websites can send small programs adding new browser features.</Box>
                  <Box variant="small">• <strong>Optional</strong>: Not required for REST APIs<br/>• <strong>Executable code</strong>: Programs running in browser<br/>• <strong>JavaScript</strong>: Programming language for web browsers<br/>• <strong>Dynamic</strong>: New functionality delivered when needed</Box>
                  <Box variant="small" color="text-body-secondary">Example:</Box>
                  <Box variant="code">
                    {`// Website sends program file to Chrome
<script src="/player-stats-widget.js"></script>

// Program knows how to get and display player data
fetch('/summoner/by-name/Faker')
  .then(data => displayPlayerStats(data));`}
                  </Box>
                  <Button variant="primary" onClick={() => onNavigate('code-on-demand')}>
                    ⚡ Watch Dynamic Loading
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
          </Grid>
        </div>
        
        <Container variant="stacked">
          <Header variant="h3">Technical Resources</Header>
          <SpaceBetween direction="vertical" size="s">
            <Button variant="normal" onClick={() => onNavigate('cheat-sheet')} fullWidth>
              📋 LoL API Endpoints & Code Examples
            </Button>
            <Button variant="normal" onClick={() => onNavigate('how-it-works')} fullWidth>
              ⚙️ AWS Architecture & Implementation
            </Button>
            <Button variant="normal" onClick={() => onNavigate('resources')} fullWidth>
              🔗 GitHub Repository & Documentation
            </Button>
          </SpaceBetween>
        </Container>
        

      </SpaceBetween>
    </Container>
  );
};

export default RestOverview;