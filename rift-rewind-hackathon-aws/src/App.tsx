import { AppLayout, Header, SideNavigation, Container, ContentLayout, Flashbar } from '@cloudscape-design/components';
import { useState, useEffect } from 'react';
import RiftRewindDashboard from './RiftRewindDashboard';

// Define the navigation items based on a simple interpretation of the core site
const navItems = [
  { type: 'link', text: 'User Group Home', href: 'https://awsaerospace.org' },
  { type: 'divider' },
  { type: 'link', text: 'REST Overview', href: '#overview', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'overview' })) },
  { type: 'divider' },
  { type: 'section', text: 'REST Constraints', items: [
    { type: 'link', text: '1️⃣ Uniform Interface', href: '#uniform-interface', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'uniform-interface' })) },
    { type: 'link', text: '2️⃣ Client-Server', href: '#client-server', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'client-server' })) },
    { type: 'link', text: '3️⃣ Stateless', href: '#stateless', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'stateless' })) },
    { type: 'link', text: '4️⃣ Cacheable', href: '#cacheable', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'cacheable' })) },
    { type: 'link', text: '5️⃣ Layered System', href: '#layered-system', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'layered-system' })) },
    { type: 'link', text: '6️⃣ Code on Demand', href: '#code-on-demand', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'code-on-demand' })) },
  ]},
  { type: 'divider' },
  { type: 'section', text: 'Resources', items: [
    { type: 'link', text: '📋 API Cheat Sheet', href: '#cheat-sheet', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'cheat-sheet' })) },
    { type: 'link', text: '⚙️ How It Works', href: '#how-it-works', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'how-it-works' })) },
    { type: 'link', text: '🔗 Project Resources', href: '#resources', onClick: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'resources' })) },
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
        header={{ href: '/', text: 'RGC3 Cloud Community' }}
        items={navItems}
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
