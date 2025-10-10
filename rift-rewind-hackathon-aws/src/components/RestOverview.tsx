import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Button, Select } from '@cloudscape-design/components';

interface RestOverviewProps {
  onNavigate: (page: string) => void;
}

const RestOverview: React.FC<RestOverviewProps> = ({ onNavigate }) => {
  return (
    <Container header={<Header variant="h2">🌐 REST Constraints Overview</Header>} variant="default">
      <SpaceBetween direction="vertical" size="m">
        <Box variant="p">
          <strong>REST</strong> (REpresentational State Transfer) and <strong>API</strong> (Application Programming Interface - a way for programs to talk to each other) work together. The Riot Games API showcases all 6 REST constraints:
        </Box>
        
        <ColumnLayout columns={3} variant="text-grid">
          <Container variant="stacked">
            <Header variant="h3">1️⃣ Uniform Interface</Header>
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="p"><strong>One pattern for all data types.</strong> Consistent HTTP methods and JSON structure across all endpoints.</Box>
              <Box variant="small">• Resource identification via URIs<br/>• Standard HTTP GET/POST methods<br/>• Uniform JSON response format<br/>• Self-descriptive messages</Box>
              <Box variant="small" color="text-body-secondary">Riot Example: <code>/lol/tournament/v5/tournaments</code></Box>
              <Button variant="primary" onClick={() => onNavigate('uniform-interface')}>
                🎯 Try Tournament API Demo
              </Button>
            </SpaceBetween>
          </Container>
          <Container variant="stacked">
            <Header variant="h3">2️⃣ Client-Server</Header>
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="p"><strong>Frontend and backend develop separately.</strong> UI and data storage evolve independently through stable contracts.</Box>
              <Box variant="small">• Separation of concerns<br/>• Independent evolution<br/>• Portable user interfaces<br/>• Scalable server architecture</Box>
              <Box variant="small" color="text-body-secondary">React ↔ AWS Lambda ↔ Riot API</Box>
              <Button variant="primary" onClick={() => onNavigate('client-server')}>
                🏗️ See Architecture in Action
              </Button>
            </SpaceBetween>
          </Container>
          <Container variant="stacked">
            <Header variant="h3">3️⃣ Stateless</Header>
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="p"><strong>Self-contained requests.</strong> Every call includes complete authentication and context.</Box>
              <Box variant="small">• No session memory<br/>• Complete request context<br/>• Independent API calls<br/>• Scalable server design</Box>
              <Box variant="small" color="text-body-secondary">X-Riot-Token header required every time</Box>
              <Button variant="primary" onClick={() => onNavigate('stateless')}>
                🔑 Test Authentication Flow
              </Button>
            </SpaceBetween>
          </Container>
          <Container variant="stacked">
            <Header variant="h3">4️⃣ Cacheable</Header>
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="p"><strong>Version-based performance.</strong> Immutable URLs enable permanent caching for speed.</Box>
              <Box variant="small">• Cache-Control headers<br/>• Versioned resource URLs<br/>• CDN optimization<br/>• Performance improvement</Box>
              <Box variant="small" color="text-body-secondary">Data Dragon: <code>/cdn/15.20.1/</code></Box>
              <Button variant="primary" onClick={() => onNavigate('cacheable')}>
                🌍 Experience CDN Speed
              </Button>
            </SpaceBetween>
          </Container>
          <Container variant="stacked">
            <Header variant="h3">5️⃣ Layered System</Header>
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="p"><strong>Hidden complexity.</strong> Multiple infrastructure layers behind simple API calls.</Box>
              <Box variant="small">• Hierarchical architecture<br/>• Component behavior constraints<br/>• Layer visibility limits<br/>• Independent layer evolution</Box>
              <Box variant="small" color="text-body-secondary">CDN → Load Balancer → Auth → Game DB</Box>
              <Button variant="primary" onClick={() => onNavigate('layered-system')}>
                🔍 Explore Hidden Layers
              </Button>
            </SpaceBetween>
          </Container>
          <Container variant="stacked">
            <Header variant="h3">6️⃣ Code on Demand</Header>
            <SpaceBetween direction="vertical" size="xs">
              <Box variant="p"><strong>Runtime adaptation.</strong> Server sends instructions along with data for dynamic UI behavior.</Box>
              <Box variant="small">• Optional constraint<br/>• Client functionality extension<br/>• Dynamic code delivery<br/>• Simplified client architecture</Box>
              <Box variant="small" color="text-body-secondary">API metadata → UI component configuration</Box>
              <Button variant="primary" onClick={() => onNavigate('code-on-demand')}>
                ⚡ Watch Dynamic Loading
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>
        
        <Container variant="stacked">
          <Header variant="h3">Technical Resources</Header>
          <SpaceBetween direction="vertical" size="s">
            <Button variant="normal" onClick={() => onNavigate('cheat-sheet')} fullWidth>
              📋 API Cheat Sheet
              <Box variant="small" display="block" color="text-body-secondary">Quick start guide</Box>
            </Button>
            <Button variant="normal" onClick={() => onNavigate('how-it-works')} fullWidth>
              ⚙️ How This Works
              <Box variant="small" display="block" color="text-body-secondary">Technical deep dive</Box>
            </Button>
            <Button variant="normal" onClick={() => onNavigate('resources')} fullWidth>
              🔗 Project Resources
              <Box variant="small" display="block" color="text-body-secondary">GitHub & docs</Box>
            </Button>
          </SpaceBetween>
        </Container>
        
        <Container variant="stacked">
          <Header 
            variant="h3"
            description="Select a year to pull League of Legends tournaments from that year and view the uniform interface constraint in action"
          >
            Championship Year
          </Header>
          <Select
            selectedOption={{ label: '2024', value: '2024' }}
            onChange={({ detail }) => {
              const year = detail.selectedOption.value;
              onNavigate(`uniform-interface?year=${year}`);
            }}
            options={[
              { label: '2024', value: '2024' },
              { label: '2023', value: '2023' },
              { label: '2022', value: '2022' },
              { label: '2021', value: '2021' }
            ]}
            placeholder="Select championship year"
          />
        </Container>
      </SpaceBetween>
    </Container>
  );
};

export default RestOverview;