import { AppLayout, Header, SideNavigation, Container, ContentLayout, Flashbar } from '@cloudscape-design/components';
import { useState, useEffect } from 'react';
import RiftRewindDashboard from './RiftRewindDashboard';

// Define the navigation items based on a simple interpretation of the core site
const navItems = [
  { type: 'link', text: 'Core Dashboard', href: 'https://awsaerospace.org' },
  { type: 'divider' },
  { type: 'link', text: 'Riot API Feature (Current)', href: '/apitraining/' },
  { type: 'link', text: 'Upcoming Meetups', href: '#' },
] as const;

function App() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  
  // Handle subdomain redirect
  useEffect(() => {
    if (window.location.hostname === 'apitraining.awsaerospace.org' && window.location.pathname === '/') {
      window.location.href = 'https://awsaerospace.org/apitraining/';
    }
  }, []);

  const nav = (
    <SideNavigation
        header={{ href: '/', text: 'RGC3 Cloud Community' }}
        items={navItems}
    />
  );

  const content = (
    <ContentLayout 
        header={
            <Header variant="h1" description="Riot Games Hackathon Feature Deployment">
                Rift Rewind: Riot API Training Dashboard
            </Header>
        }
    >
        <Container 
            header={<Header variant="h2">Feature Development Area</Header>}
        >
            <Flashbar 
                items={[{ 
                    type: 'success', 
                    header: '🚀 Live Riot Games API Integration Active', 
                    content: 'AWS Lambda → Riot Data Dragon API → React Frontend | Real-time champion data from League of Legends servers | Auto-refreshes with game patches', 
                    id: 'live-integration' 
                }]} 
            />
            <RiftRewindDashboard />
        </Container>
    </ContentLayout>
  );

  return (
    <AppLayout
      navigation={nav}
      content={content}
      navigationOpen={navigationOpen}
      onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
      toolsHide={true}
      ariaLabels={{
        navigation: 'Navigation drawer',
        navigationClose: 'Close navigation drawer',
        navigationToggle: 'Open navigation drawer',
      }}
    />
  );
}

export default App;
