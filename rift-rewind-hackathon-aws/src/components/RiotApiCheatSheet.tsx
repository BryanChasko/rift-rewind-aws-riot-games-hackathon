import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Button, BreadcrumbGroup, Alert } from '@cloudscape-design/components';

interface RiotApiCheatSheetProps {
  onNavigate: (page: string) => void;
}

const RiotApiCheatSheet: React.FC<RiotApiCheatSheetProps> = ({ onNavigate }) => {
  return (
    <SpaceBetween direction="vertical" size="l">
      <BreadcrumbGroup
        items={[
          { text: 'Home', href: 'https://awsaerospace.org' },
          { text: 'API Training', href: '#', onClick: () => onNavigate('overview') },
          { text: 'REST Fundamentals', href: '#overview', onClick: () => onNavigate('overview') },
          { text: 'API Cheat Sheet' }
        ]}
      />
      
      <Header
        variant="h1"
        description="Get your own API key and build similar applications using real Riot Games data. This cheat sheet provides everything you need to get started with the Riot Games Developer API."
      >
        📋 Riot API Cheat Sheet
      </Header>
      
      <Alert
        statusIconAriaLabel="Info"
        header="🎯 Quick Start Guide"
      >
        Free developer access → Interactive documentation → Complete source code | Everything you need to build League of Legends applications
      </Alert>
      
      <Container>
        <SpaceBetween direction="vertical" size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <Container variant="stacked">
              <Header variant="h4">1️⃣ Get Your API Key</Header>
              <Box variant="p">
                Free developer access to Riot Games data<br/>
                <a href="https://developer.riotgames.com/" target="_blank" rel="noopener noreferrer">developer.riotgames.com</a>
              </Box>
            </Container>
            <Container variant="stacked">
              <Header variant="h4">2️⃣ Explore the Data</Header>
              <Box variant="p">
                Interactive API documentation and testing<br/>
                <a href="https://developer.riotgames.com/apis" target="_blank" rel="noopener noreferrer">developer.riotgames.com/apis</a>
              </Box>
            </Container>
            <Container variant="stacked">
              <Header variant="h4">3️⃣ View Source Code</Header>
              <Box variant="p">
                Complete implementation on GitHub<br/>
                <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              </Box>
            </Container>
          </ColumnLayout>
          
          <Container variant="stacked">
            <Header variant="h3">📊 API Access & Data Structure</Header>
            <ColumnLayout columns={2} variant="text-grid">
              <Container variant="stacked">
                <Header variant="h4">✅ Available with Basic API Key (RGAPI-xxx)</Header>
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="p">
                    <strong>Data Dragon API:</strong> Champion stats, abilities<br/>
                    <strong>Challenger League:</strong> Top ranked players<br/>
                    <strong>Champion Mastery:</strong> Player expertise<br/>
                    <strong>Match History:</strong> Recent game results
                  </Box>
                  <Box variant="p">
                    <strong>Rate Limit:</strong> 100 requests per 2 minutes<br/>
                    <strong>Sign up:</strong> <a href="https://developer.riotgames.com/" target="_blank" rel="noopener noreferrer">developer.riotgames.com</a>
                  </Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h4">❌ Requires Special Access</Header>
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="p">
                    <strong>Tournament API:</strong> Official esports matches<br/>
                    <strong>Featured Games:</strong> Live high-level matches<br/>
                    <strong>Esports Data:</strong> Professional results<br/>
                    <strong>Production Keys:</strong> Higher rate limits
                  </Box>
                  <Box variant="p">
                    <strong>Access:</strong> Application required<br/>
                    <strong>Commercial:</strong> Usage rights included
                  </Box>
                </SpaceBetween>
              </Container>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🛠️ Quick Start Example</Header>
            <Box variant="p">
              Two types of API calls - public CDN data vs authenticated API data:
            </Box>
            <Box variant="code">
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{
`// 1. Public Data Dragon CDN (NO API KEY NEEDED)
fetch('https://ddragon.leagueoflegends.com/cdn/15.20.1/data/en_US/champion.json')
  .then(response => response.json())
  .then(data => {
    Object.values(data.data).forEach(champion => {
      const stats = champion.stats;
      console.log({
        name: champion.name,
        attack: Math.round(stats.attackdamage / 10),
        defense: Math.round(stats.hp / 100),
        speed: Math.round(stats.movespeed / 20)
      });
    });
  });

// 2. Live Game Data (REQUIRES API KEY)
const API_KEY = 'RGAPI-your-key-here';
fetch('https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', {
  headers: { 'X-Riot-Token': API_KEY }
})
  .then(response => response.json())
  .then(data => {
    console.log('Top players:', data.entries.slice(0, 5));
  });`
              }</pre>
            </Box>
          </Container>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default RiotApiCheatSheet;