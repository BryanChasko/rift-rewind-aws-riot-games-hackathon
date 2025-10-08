import { AppLayout, Header, SideNavigation, Container, ContentLayout, Flashbar } from '@cloudscape-design/components';
import { useState } from 'react';
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
                    type: 'info', 
                    header: 'Integration Ready', 
                    content: 'Start building your Riot API components and logic here.', 
                    id: 'ready-info' 
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
