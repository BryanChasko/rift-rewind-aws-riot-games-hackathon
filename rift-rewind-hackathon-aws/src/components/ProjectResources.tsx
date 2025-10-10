import React from 'react';
import { Container, Header, Box, SpaceBetween, ColumnLayout, Alert } from '@cloudscape-design/components';

interface ProjectResourcesProps {
  onNavigate: (page: string) => void;
}

const ProjectResources: React.FC<ProjectResourcesProps> = () => {
  return (
    <SpaceBetween direction="vertical" size="l">

      
      <Header
        variant="h1"
        description="Explore the complete source code and documentation. Access GitHub repositories, technical documentation, and additional resources for building your own REST API applications."
      >
        🔗 Project Resources
      </Header>
      
      <Alert
        statusIconAriaLabel="Info"
        header="📚 Open Source Project"
      >
        Frontend Repository → Backend Infrastructure → Complete Documentation | Full source code available on GitHub
      </Alert>
      
      <Container>
        <SpaceBetween direction="vertical" size="m">
          <Container variant="stacked">
            <Header variant="h3">💻 GitHub Repository</Header>
            <Box variant="p">
              <strong>Complete Source Code:</strong><br/>
              <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer" style={{color: '#0073bb', textDecoration: 'underline'}}>
                github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon
              </a>
            </Box>
          </Container>
          
          <ColumnLayout columns={3} variant="text-grid">
            <Container variant="stacked">
              <Header variant="h3">🏗️ Infrastructure Code</Header>
              <Box variant="p">
                <strong>riot-api-cdk/</strong><br/>
                • AWS CDK TypeScript stack<br/>
                • Lambda function definitions<br/>
                • IAM roles & permissions<br/>
                • SSM Parameter Store setup
              </Box>
            </Container>
            
            <Container variant="stacked">
              <Header variant="h3">⚙️ Lambda Functions</Header>
              <Box variant="p">
                <strong>lambda/</strong><br/>
                • riot-api-source/ (Python 3.11)<br/>
                • summoner-lookup-source/<br/>
                • X-Ray tracing integration<br/>
                • Error handling patterns
              </Box>
            </Container>
            
            <Container variant="stacked">
              <Header variant="h3">📱 Frontend Application</Header>
              <Box variant="p">
                <strong>rift-rewind-hackathon-aws/</strong><br/>
                • React 18 + TypeScript<br/>
                • Cloudscape Design System<br/>
                • Vite 5 build configuration<br/>
                • REST constraint demos
              </Box>
            </Container>
          </ColumnLayout>
          
          <Container variant="stacked">
            <Header variant="h3">🎮 AWS x Riot Games Partnership</Header>
            <Box variant="p">
              <strong>Real-World Impact:</strong> Riot Games migrated from data centers to AWS, saving $10M annually and supporting 180M+ monthly players with 90% faster infrastructure setup.
            </Box>
            <ColumnLayout columns={2} variant="text-grid">
              <Box variant="p">
                <strong>🏆 Production Scale:</strong><br/>
                • League of Legends: 160+ billion hours played annually<br/>
                • VALORANT: 35ms latency requirement globally<br/>
                • Remote esports broadcasting from AWS<br/>
                • 246 automated clusters worldwide
              </Box>
              <Box variant="p">
                <strong>🔗 Learn More:</strong><br/>
                • <a href="https://aws.amazon.com/sports/riot/" target="_blank" rel="noopener noreferrer">AWS Sports: Riot Games Partnership</a><br/>
                • <a href="https://developer.riotgames.com/" target="_blank" rel="noopener noreferrer">Riot Games Developer Portal</a><br/>
                • <a href="https://cloudscape.design/" target="_blank" rel="noopener noreferrer">Cloudscape Design System</a><br/>
                • <a href="https://restfulapi.net/" target="_blank" rel="noopener noreferrer">REST API Best Practices</a>
              </Box>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">📚 Documentation & Setup</Header>
            <ColumnLayout columns={2} variant="text-grid">
              <Box variant="p">
                <strong>📝 README.md:</strong><br/>
                • Complete setup instructions<br/>
                • Architecture diagrams<br/>
                • Cost optimization strategies<br/>
                • Deployment workflows
              </Box>
              <Box variant="p">
                <strong>🎯 Key Stats from AWS Partnership:</strong><br/>
                • $10M annual infrastructure savings<br/>
                • 12x faster game infrastructure deployment<br/>
                • 50% reduction in issue response time<br/>
                • Global reach with AWS Local Zones
              </Box>
            </ColumnLayout>
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🚀 Deployment Instructions</Header>
            <Box variant="p">
              Step-by-step guide to deploy your own version:
            </Box>
            <Box variant="code">
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{
`# 1. Clone repository
git clone https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon.git
cd rift-rewind-aws-riot-games-hackathon

# 2. Deploy AWS infrastructure
cd riot-api-cdk
npm install
npx cdk bootstrap
npx cdk deploy --profile your-aws-profile

# 3. Add Riot API key to AWS SSM
aws ssm put-parameter \
  --name "/rift-rewind/riot-api-key" \
  --value "RGAPI-your-key-here" \
  --type "SecureString" \
  --profile your-aws-profile

# 4. Build and deploy frontend
cd ../rift-rewind-hackathon-aws
yarn install
yarn build
aws s3 sync dist/ s3://your-bucket-name/ --profile your-aws-profile`
              }</pre>
            </Box>
          </Container>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default ProjectResources;