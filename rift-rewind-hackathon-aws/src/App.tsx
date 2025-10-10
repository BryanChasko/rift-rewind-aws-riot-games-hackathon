
import { useEffect } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Navigation from './components/navigation';
import Breadcrumbs from './components/breadcrumbs';
import Shell from './layouts/shell';
import RiftRewindDashboardModular from './RiftRewindDashboardModular';

function App() {
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      const page = event.detail;
      window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    };
    
    // Handle main site navigation redirects
    const handleMainSiteRedirect = () => {
      const path = window.location.pathname;
      if (path === '/home/index.html' || path === '/meetings/index.html') {
        window.location.href = 'https://awsaerospace.org' + path;
      }
    };
    
    window.addEventListener('navigate', handleNavigation as EventListener);
    handleMainSiteRedirect();
    
    return () => window.removeEventListener('navigate', handleNavigation as EventListener);
  }, []);

  return (
    <Shell
      breadcrumbs={
        <Breadcrumbs 
          active={{ text: 'API Training', href: '/learning/api/' }} 
        />
      }
      navigation={
        <Navigation 
          onFollow={(event) => {
            if (event.detail.href.startsWith('#')) {
              const page = event.detail.href.substring(1);
              window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
            }
          }}
        />
      }
    >
      <ContentLayout>
        <RiftRewindDashboardModular />
      </ContentLayout>
    </Shell>
  );
}

export default App;
