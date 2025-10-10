import React, { useState, useEffect } from 'react';
import { Header, SpaceBetween, Alert, Grid } from '@cloudscape-design/components';
import './rest-constraints.css';
import './accessibility.css';
import './responsive.css';

// Services
import { ApiService } from './services/ApiService';
import { StateManager } from './services/StateManager';

// Components
import RestOverview from './components/RestOverview';
import RiotApiCheatSheet from './components/RiotApiCheatSheet';
import HowItWorks from './components/HowItWorks';
import ProjectResources from './components/ProjectResources';

// REST Constraint Components
import { UniformInterface } from './components/RestConstraints/UniformInterface';
import { ClientServer } from './components/RestConstraints/ClientServer';
import { Stateless } from './components/RestConstraints/Stateless';
import { Cacheable } from './components/RestConstraints/Cacheable';
import { LayeredSystem } from './components/RestConstraints/LayeredSystem';
import { CodeOnDemand } from './components/RestConstraints/CodeOnDemand';

// Hooks
import { useChampionSelection } from './hooks/useChampionSelection';

import type { ConstraintSection } from './services/types';

const RiftRewindDashboardModular: React.FC = () => {
  // Services
  const [apiService] = useState(() => new ApiService());

  const [stateManager] = useState(() => new StateManager());

  // State
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [selectedYear, setSelectedYear] = useState({ label: '2024', value: '2024' });
  const [loading] = useState(false);
  const [activeDemo] = useState<ConstraintSection | null>(null);

  // Custom hooks
  const { selectedChampion, setSelectedChampion } = useChampionSelection();

  const handleNavigation = (page: string) => {
    // Check if page contains year parameter
    if (page.includes('?year=')) {
      const [pageName, yearParam] = page.split('?year=');
      setCurrentPage(pageName);
      setSelectedYear({ label: yearParam, value: yearParam });
      // Auto-trigger API call for uniform interface
      if (pageName === 'uniform-interface') {
        setTimeout(() => {
          // This would be handled by the UniformInterface component
        }, 500);
      }
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const handleNavigateEvent = (event: CustomEvent) => {
      setCurrentPage(event.detail);
    };
    
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setCurrentPage(hash);
      }
    };
    
    window.addEventListener('navigate', handleNavigateEvent as EventListener);
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial hash on load
    handleHashChange();
    
    return () => {
      window.removeEventListener('navigate', handleNavigateEvent as EventListener);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderCurrentPage = () => {
    const baseProps = {
      apiService,
      stateManager,
      onNavigate: handleNavigation,
      selectedYear,
      selectedChampion,
      loading,
      activeDemo,
      onYearChange: setSelectedYear,
      onChampionChange: setSelectedChampion
    };

    switch (currentPage) {
      case 'cheat-sheet':
        return <RiotApiCheatSheet onNavigate={handleNavigation} />;
      case 'how-it-works':
        return <HowItWorks onNavigate={handleNavigation} />;
      case 'resources':
        return <ProjectResources onNavigate={handleNavigation} />;
      case 'uniform-interface':
        return <UniformInterface {...baseProps} />;
      case 'client-server':
        return <ClientServer {...baseProps} />;
      case 'stateless':
        return <Stateless {...baseProps} />;
      case 'cacheable':
        return <Cacheable {...baseProps} />;
      case 'layered-system':
        return <LayeredSystem {...baseProps} />;
      case 'code-on-demand':
        return <CodeOnDemand {...baseProps} />;
      default:
        return <RestOverview onNavigate={handleNavigation} />;
    }
  };

  return (
    <main id="main-content" role="main" className="responsive-container">
      <SpaceBetween direction="vertical" size="l" className="responsive-stack">
      {currentPage === 'overview' && (
        <>
          <Header
            variant="h1"
            description="League of Legends is a multiplayer online battle arena (MOBA) game where two teams of 5 players compete. Each player controls a unique champion - a character with distinct abilities, strengths, and weaknesses. There are 160+ champions, each with their own lore, abilities, and gameplay role. This application demonstrates REST (REpresentational State Transfer) and API (Application Programming Interface) fundamentals using real Riot Games data."
          >
            Rift Rewind: REST API fundamentals with Riot Games Developer Portal
          </Header>
          
          <Alert
            statusIconAriaLabel="Info"
            header="🚀 Live REST API Integration"
          >
            <Grid gridDefinition={[{ colspan: { default: 12, xs: 12 } }]}>
              <div className="responsive-text">
                Cloudscape Design System → AWS Lambda → Riot Data Dragon API | Demonstrating REST principles with real League of Legends champion data
              </div>
            </Grid>
          </Alert>
        </>
      )}
      
        {renderCurrentPage()}
      </SpaceBetween>
    </main>
  );
};

export default RiftRewindDashboardModular;