import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Alert } from '@cloudscape-design/components';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = () => {
  return (
    <SpaceBetween direction="vertical" size="l">

      
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
          <Alert type="info" header="🏗️ Serverless Architecture">
            <Box variant="p">
              AWS Lambda functions process Riot Games API requests with encrypted key storage, X-Ray tracing, and cost-effective pay-per-request billing.
            </Box>
          </Alert>
          
          <Container variant="stacked">
            <Header variant="h3">🛠️ Technical Implementation</Header>
            <ColumnLayout columns={3} variant="text-grid">
              <Container variant="stacked">
                <Header variant="h3">📊 Data Sources</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p">
                    <strong>✅ Live Riot Data:</strong><br/>
                    • Challenger League rankings<br/>
                    • Challenge leaderboards<br/>
                    • Champion mastery points
                  </Box>
                  <Box variant="p">
                    <strong>🛠️ AWS Processing:</strong><br/>
                    • Lambda transforms API responses<br/>
                    • SSM stores encrypted API keys<br/>
                    • CloudWatch logs all requests
                  </Box>
                </SpaceBetween>
              </Container>
              
              <Container variant="stacked">
                <Header variant="h3">🏧 Architecture Stack</Header>
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
                <Header variant="h3">🔒 Security & Secrets</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="p">
                    <strong>🔑 API Key Storage</strong><br/>
                    AWS SSM Parameter Store (encrypted)
                  </Box>
                  <Box variant="p">
                    <strong>🛡️ IAM Permissions</strong><br/>
                    Least privilege access control
                  </Box>
                  <Box variant="p">
                    <strong>📊 Monitoring</strong><br/>
                    X-Ray tracing + CloudWatch logs
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
                <strong>📊 AWS Costs:</strong><br/>
                • Lambda: $0.0000002 per request<br/>
                • S3 hosting: $0.50/month<br/>
                • CloudFront CDN: $0.10/GB<br/>
                • SSM Parameter Store: No charge
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

// Example Challenge Processing:
// Raw Riot Data: { "challengeId": 101000, "percentile": 99.5, "level": "CHALLENGER" }
// Our Display: { "name": "Aram Legend", "participants": 15000, "winner": "T1 Faker" }

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