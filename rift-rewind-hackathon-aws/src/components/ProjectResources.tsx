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
          <ColumnLayout columns={2} variant="text-grid">
            <Container variant="stacked">
              <Header variant="h3">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}} />
                Backend & Infrastructure
              </Header>
              <Box variant="p">
                <strong>Full Project Repository:</strong><br/>
                <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer" style={{color: '#0073bb', textDecoration: 'underline'}}>
                  github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon
                </a><br/>
                <Box variant="small" color="text-body-secondary">
                  AWS CDK, Lambda functions, Riot API integration
                </Box>
              </Box>
            </Container>
            
            <Container variant="stacked">
              <Header variant="h3">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}} />
                Frontend & UI
              </Header>
              <Box variant="p">
                <strong>Cloudscape Design System:</strong><br/>
                <a href="https://github.com/BryanChasko/rgc3-CloudscapeDesignSystem-website" target="_blank" rel="noopener noreferrer" style={{color: '#0073bb', textDecoration: 'underline'}}>
                  github.com/BryanChasko/rgc3-CloudscapeDesignSystem-website
                </a><br/>
                <Box variant="small" color="text-body-secondary">
                  React 18, TypeScript, Vite 5, REST examples
                </Box>
              </Box>
            </Container>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default ProjectResources;