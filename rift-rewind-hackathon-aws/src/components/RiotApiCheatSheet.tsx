import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Alert } from '@cloudscape-design/components';
import { CodeView } from '@cloudscape-design/code-view';

interface RiotApiCheatSheetProps {
  onNavigate: (page: string) => void;
}

const RiotApiCheatSheet: React.FC<RiotApiCheatSheetProps> = () => {
  return (
    <SpaceBetween direction="vertical" size="l">

      
      <Header
        variant="h1"
        description="Complete guide to League of Legends APIs with real endpoints, authentication, and code examples. Everything needed to build LoL applications."
      >
        📋 League of Legends API Reference
      </Header>
      
      <Alert
        statusIconAriaLabel="Info"
        header="🎯 Quick Start Guide"
      >
        Request developer access → Interactive documentation → Complete source code | Everything you need to build League of Legends applications
      </Alert>
      
      <Container>
        <SpaceBetween direction="vertical" size="m">
          <ColumnLayout columns={3} variant="text-grid">
            <Container variant="stacked">
              <Header variant="h3">1️⃣ Get Your API Key</Header>
              <Box variant="p">
                Developer access to Riot Games data<br/>
                <a href="https://developer.riotgames.com/" target="_blank" rel="noopener noreferrer">developer.riotgames.com</a>
              </Box>
            </Container>
            <Container variant="stacked">
              <Header variant="h3">2️⃣ Explore the Data</Header>
              <Box variant="p">
                Interactive API documentation and testing<br/>
                <a href="https://developer.riotgames.com/apis" target="_blank" rel="noopener noreferrer">developer.riotgames.com/apis</a>
              </Box>
            </Container>
            <Container variant="stacked">
              <Header variant="h3">3️⃣ View Source Code</Header>
              <Box variant="p">
                Complete implementation on GitHub<br/>
                <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              </Box>
            </Container>
          </ColumnLayout>
          
          <Container variant="stacked">
            <Header variant="h3">🎮 Core League of Legends APIs</Header>
            <ColumnLayout columns={2} variant="text-grid">
              <Container variant="stacked">
                <Header variant="h4">👤 Player & Account APIs</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="strong">ACCOUNT-V1: Riot ID Lookup</Box>
                  <CodeView content="GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}" lineNumbers={false} />
                  <Box variant="small">Convert Riot ID (Player#NA1) to encrypted account ID</Box>
                  
                  <Box variant="strong">SUMMONER-V4: Player Profile</Box>
                  <CodeView content="GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}" lineNumbers={false} />
                  <Box variant="small">Level, rank, profile icon, last activity</Box>
                  
                  <Box variant="strong">CHAMPION-MASTERY-V4: Expertise</Box>
                  <CodeView content="GET /lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}" lineNumbers={false} />
                  <Box variant="small">Champion mastery points, levels, chest earned</Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h4">🏆 Competitive & Match APIs</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="strong">LEAGUE-V4: Ranked Ladders</Box>
                  <CodeView content="GET /lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5" lineNumbers={false} />
                  <Box variant="small">Challenger, Grandmaster, Master tier players</Box>
                  
                  <Box variant="strong">MATCH-V5: Game History</Box>
                  <CodeView content="GET /lol/match/v5/matches/by-puuid/{puuid}/ids?count=20" lineNumbers={false} />
                  <Box variant="small">Match IDs for detailed game analysis</Box>
                  
                  <Box variant="strong">CHALLENGES-V1: Achievement System</Box>
                  <CodeView content="GET /lol/challenges/v1/challenges/config" lineNumbers={false} />
                  <Box variant="small">400+ challenges: combat, teamwork, collection</Box>
                </SpaceBetween>
              </Container>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">📊 Static Game Data (No API Key)</Header>
            <ColumnLayout columns={2} variant="text-grid">
              <Container variant="stacked">
                <Header variant="h4">🐉 Data Dragon CDN</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="strong">Champion Data</Box>
                  <CodeView content="https://ddragon.leagueoflegends.com/cdn/15.20.1/data/en_US/champion.json" lineNumbers={false} />
                  <Box variant="small">160+ champions: stats, abilities, lore</Box>
                  
                  <Box variant="strong">Champion Images</Box>
                  <CodeView content="https://ddragon.leagueoflegends.com/cdn/15.20.1/img/champion/Ahri.png" lineNumbers={false} />
                  <Box variant="small">Square portraits, loading screens, splash art</Box>
                  
                  <Box variant="strong">Items & Runes</Box>
                  <CodeView content="https://ddragon.leagueoflegends.com/cdn/15.20.1/data/en_US/item.json" lineNumbers={false} />
                  <Box variant="small">200+ items, rune trees, summoner spells</Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h4">🌍 Regional Endpoints</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="strong">Americas</Box>
                  <CodeView content="na1.api.riotgames.com (North America)\nbr1.api.riotgames.com (Brazil)\nla1.api.riotgames.com (Latin America)" lineNumbers={false} />
                  
                  <Box variant="strong">Europe</Box>
                  <CodeView content="euw1.api.riotgames.com (West)\neun1.api.riotgames.com (Nordic & East)\ntr1.api.riotgames.com (Turkey)" lineNumbers={false} />
                  
                  <Box variant="strong">Asia Pacific</Box>
                  <CodeView content="kr.api.riotgames.com (Korea)\njp1.api.riotgames.com (Japan)\noc1.api.riotgames.com (Oceania)" lineNumbers={false} />
                </SpaceBetween>
              </Container>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">⚙️ Rate Limits & Authentication</Header>
            <ColumnLayout columns={2} variant="text-grid">
              <Container variant="stacked">
                <Header variant="h4">🔑 Development Key</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="strong">Rate Limits</Box>
                  <CodeView content="100 requests per 2 minutes\n20 requests per 1 second" lineNumbers={false} />
                  
                  <Box variant="strong">Authentication</Box>
                  <CodeView content="headers: {\n  'X-Riot-Token': 'RGAPI-your-key-here'\n}" lineNumbers={false} />
                  
                  <Box variant="strong">Key Rotation</Box>
                  <Box variant="small">Development keys expire every 24 hours</Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h4">🏁 Production Key (Application)</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="strong">Higher Limits</Box>
                  <CodeView content="3,000 requests per 10 seconds\n180,000 requests per 2 minutes" lineNumbers={false} />
                  
                  <Box variant="strong">Commercial Use</Box>
                  <Box variant="small">Monetization allowed with approval</Box>
                  
                  <Box variant="strong">Application Process</Box>
                  <Box variant="small">Detailed project description required</Box>
                </SpaceBetween>
              </Container>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🚀 Complete Player Lookup Example</Header>
            <Box variant="p">
              Step-by-step process to get player data using multiple APIs:
            </Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="strong">Step 1: Convert Riot ID to Account</Box>
              <CodeView content={`// Convert "Faker#KR1" to encrypted account ID
fetch('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Faker/KR1', {
  headers: { 'X-Riot-Token': 'RGAPI-your-key' }
})
.then(res => res.json())
.then(account => {
  console.log('PUUID:', account.puuid);
  return account.puuid;
});`} lineNumbers={true} />
              
              <Box variant="strong">Step 2: Get Summoner Profile</Box>
              <CodeView content={`// Get summoner level, rank, profile icon
fetch('https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' + puuid, {
  headers: { 'X-Riot-Token': 'RGAPI-your-key' }
})
.then(res => res.json())
.then(summoner => {
  console.log('Level:', summoner.summonerLevel);
  console.log('Icon ID:', summoner.profileIconId);
});`} lineNumbers={true} />
              
              <Box variant="strong">Step 3: Get Champion Mastery</Box>
              <CodeView content={`// Get top 3 most played champions
fetch('https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/' + puuid + '/top?count=3', {
  headers: { 'X-Riot-Token': 'RGAPI-your-key' }
})
.then(res => res.json())
.then(masteries => {
  masteries.forEach(mastery => {
    console.log('Champion:', mastery.championId, 'Points:', mastery.championPoints);
  });
});`} lineNumbers={true} />
              
              <Box variant="strong">Step 4: Get Match History</Box>
              <CodeView content={`// Get last 5 ranked games
fetch('https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?type=ranked&count=5', {
  headers: { 'X-Riot-Token': 'RGAPI-your-key' }
})
.then(res => res.json())
.then(matchIds => {
  console.log('Recent matches:', matchIds);
});`} lineNumbers={true} />
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default RiotApiCheatSheet;