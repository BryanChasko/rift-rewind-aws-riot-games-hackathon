import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Button, Alert, BreadcrumbGroup } from '@cloudscape-design/components';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <SpaceBetween direction="vertical" size="l">
      <BreadcrumbGroup
        items={[
          { text: 'Home', href: 'https://awsaerospace.org' },
          { text: 'API Training', href: '#', onClick: () => onNavigate('overview') },
          { text: 'REST Fundamentals', href: '#overview', onClick: () => onNavigate('overview') },
          { text: 'How It Works' }
        ]}
      />
      
      <Header
        variant="h1"
        description="Learn how this application works under the hood. Explore the technical implementation, architecture decisions, and cost-effective design patterns used in this production REST API demonstration."
      >
        ⚙️ How This App Works
      </Header>
      
      <Alert
        statusIconAriaLabel="Info"
        header="🏗️ Production Architecture"
      >
        React 18 + TypeScript → AWS Lambda + Python → Riot Games API | Real-world serverless implementation serving thousands of visitors
      </Alert>
      
      <Container>
        <SpaceBetween direction="vertical" size="l">
          <Alert type="success" header="🎯 Real-World Architecture">
            <Box variant="p">
              This isn't just a demo - it's a production application running on AWS, processing real Riot Games data, and serving thousands of visitors.
            </Box>
          </Alert>
          
          <Container variant="stacked">
            <Header variant="h3">🛠️ Technical Implementation</Header>
            <ColumnLayout columns={3} variant="text-grid">
              <Container variant="stacked">
                <Header variant="h4">📊 Data Sources</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p">
                    <strong>✅ From Riot API:</strong><br/>
                    • Champion names & lore titles<br/>
                    • Attack damage, health, speed stats<br/>
                    • Official game balance data
                  </Box>
                  <Box variant="p">
                    <strong>🛠️ Our Processing:</strong><br/>
                    • Tier rankings (S/A-Tier algorithm)<br/>
                    • Display scaling (÷10, ÷100, ÷20)<br/>
                    • Performance calculations
                  </Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h4">🏧 Architecture Stack</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p">
                    <strong>Frontend:</strong> React 18 + TypeScript<br/>
                    <strong>Build:</strong> Vite 5 → Static HTML/CSS/JS<br/>
                    <strong>Hosting:</strong> S3 + CloudFront CDN<br/>
                    <strong>API:</strong> AWS Lambda Function URL<br/>
                    <strong>Data:</strong> Riot Games API integration
                  </Box>
                  <Box variant="small" color="text-body-secondary">
                    Pay-per-request, auto-scaling
                  </Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h4">🎯 Champion Data Mapping</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p">
                    <strong>⚔️ Attack Power</strong><br/>
                    <code>stats.attackdamage ÷ 10</code>
                  </Box>
                  <Box variant="p">
                    <strong>🛡️ Defense Rating</strong><br/>
                    <code>stats.hp ÷ 100</code>
                  </Box>
                  <Box variant="p">
                    <strong>💨 Speed Rating</strong><br/>
                    <code>stats.movespeed ÷ 20</code>
                  </Box>
                </SpaceBetween>
              </Container>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">💰 Cost-Effective Design</Header>
            <ColumnLayout columns={2} variant="text-grid">
              <Box variant="p">
                <strong>🎯 Smart Defaults:</strong><br/>
                • Demo data loads first (no API calls)<br/>
                • User chooses when to fetch live data<br/>
                • Reduces Lambda invocations by 90%<br/>
                • Educational transparency about costs
              </Box>
              <Box variant="p">
                <strong>📊 Real Numbers:</strong><br/>
                • ~$0.0001 per API request<br/>
                • S3 hosting: ~$1/month<br/>
                • Lambda: Pay only when used<br/>
                • Total monthly cost: Under $5
              </Box>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🔄 Data Flow Example</Header>
            <Box variant="p">
              When you click "🚀 Send GET Request" in the demos, here's what happens:
            </Box>
            <Box variant="code">
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{
`1. 📱 React App → Sends fetch() to Lambda Function URL
2. ⚡ AWS Lambda → Retrieves encrypted API key from SSM Parameter Store  
3. 🔑 Lambda → Adds X-Riot-Token header for authenticated endpoints
4. 🎮 Riot API → Returns JSON data from two sources:
   • Data Dragon CDN (public, no auth)
   • Live API endpoints (requires X-Riot-Token)
5. 🔄 Lambda → Processes data using our champion mapping:
   • Attack Power = stats.attackdamage ÷ 10
   • Defense Rating = stats.hp ÷ 100  
   • Speed Rating = stats.movespeed ÷ 20
6. 📊 React App → Receives response, updates UI tables
7. ✅ You → See live League of Legends data in under 2 seconds!

// Example Champion Processing:
// Raw Riot Data: { "attackdamage": 640, "hp": 5800, "movespeed": 340 }
// Our Display: { "attack": 64, "defense": 58, "speed": 17 }

// Authentication Summary:
// ✅ Data Dragon CDN: No authentication needed
// 🔑 Live APIs: X-Riot-Token header required`
              }</pre>
            </Box>
          </Container>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default HowItWorks;