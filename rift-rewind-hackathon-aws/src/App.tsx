import { AppLayout, Header, SideNavigation, Container, ContentLayout, Flashbar } from '@cloudscape-design/components';
import { useState, useEffect } from 'react';
import RiftRewindDashboard from './RiftRewindDashboard';

// Navigation structure consistent with core awsaerospace.org site
const handleNavigation = (page: string) => {
  window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
};

const navItems = [
  { type: 'link', text: 'User Group Home', href: 'https://awsaerospace.org' },
  { type: 'link', text: 'Meetings', href: 'https://awsaerospace.org/meetings' },
  { type: 'section', text: 'Learning', items: [
    { type: 'section', text: 'API', items: [
      { type: 'link', text: 'REST Overview', href: '#overview' },
      { type: 'section', text: 'RESTful API Constraints', items: [
        { type: 'link', text: '1️⃣ Uniform Interface', href: '#uniform-interface' },
        { type: 'link', text: '2️⃣ Client-Server', href: '#client-server' },
        { type: 'link', text: '3️⃣ Stateless', href: '#stateless' },
        { type: 'link', text: '4️⃣ Cacheable', href: '#cacheable' },
        { type: 'link', text: '5️⃣ Layered System', href: '#layered-system' },
        { type: 'link', text: '6️⃣ Code on Demand', href: '#code-on-demand' },
      ]},
      { type: 'section', text: 'API Resources', items: [
        { type: 'link', text: '📋 API Cheat Sheet', href: '#cheat-sheet' },
        { type: 'link', text: '⚙️ How It Works', href: '#how-it-works' },
        { type: 'link', text: '🔗 Project Resources', href: '#resources' },
      ]},
    ]},
  ]},
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
        header={{ href: 'https://awsaerospace.org', text: 'Rio Grande Corridor Cloud Community' }}
        items={navItems}
        onFollow={(event) => {
          if (event.detail.href.startsWith('#')) {
            event.preventDefault();
            const page = event.detail.href.substring(1);
            window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
          }
        }}
    />
  );

  const content = (
    <ContentLayout>
      <RiftRewindDashboard />
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
