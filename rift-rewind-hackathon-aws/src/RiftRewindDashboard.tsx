import React, { useState, useEffect } from 'react';
import { Header, SpaceBetween, Alert } from '@cloudscape-design/components';
import './rest-constraints.css';
import RestOverview from './components/RestOverview';
import RiotApiCheatSheet from './components/RiotApiCheatSheet';
import HowItWorks from './components/HowItWorks';
import ProjectResources from './components/ProjectResources';
import { UniformInterface } from './components/RestConstraints/UniformInterface';
import { ClientServer } from './components/RestConstraints/ClientServer';
import { Stateless } from './components/RestConstraints/Stateless';
import { Cacheable } from './components/RestConstraints/Cacheable';
import { LayeredSystem } from './components/RestConstraints/LayeredSystem';
import { CodeOnDemand } from './components/RestConstraints/CodeOnDemand';
import type { Contest } from './services/types';
import { StateManager } from './services/StateManager';

const RiftRewindDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [selectedYear, setSelectedYear] = useState({ label: '2024', value: '2024' });
  const [selectedChampion, setSelectedChampion] = useState<{ label: string; value: string } | null>(null);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [stateManager] = useState(() => new StateManager());

  const handleNavigation = (page: string) => {
    if (page.includes('?year=')) {
      const [pageName, yearParam] = page.split('?year=');
      setCurrentPage(pageName);
      setSelectedYear({ label: yearParam, value: yearParam });
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
    
    handleHashChange();
    
    return () => {
      window.removeEventListener('navigate', handleNavigateEvent as EventListener);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'cheat-sheet':
        return <RiotApiCheatSheet onNavigate={handleNavigation} />;
      case 'how-it-works':
        return <HowItWorks onNavigate={handleNavigation} />;
      case 'resources':
        return <ProjectResources onNavigate={handleNavigation} />;
      case 'uniform-interface':
        return (
          <UniformInterface
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onNavigate={handleNavigation}
            stateManager={stateManager}
            onContestChange={setSelectedContest}
          />
        );
      case 'client-server':
        return (
          <ClientServer
            selectedYear={selectedYear}
            selectedChampion={selectedChampion}
            selectedContest={selectedContest}
            onChampionChange={setSelectedChampion}
            onNavigate={handleNavigation}
            stateManager={stateManager}
          />
        );
      case 'stateless':
        return (
          <Stateless
            selectedYear={selectedYear}
            selectedChampion={selectedChampion}
            onNavigate={handleNavigation}
            stateManager={stateManager}
          />
        );
      case 'cacheable':
        return (
          <Cacheable
            selectedYear={selectedYear}
            selectedChampion={selectedChampion}
            onNavigate={handleNavigation}
            stateManager={stateManager}
          />
        );
      case 'layered-system':
        return (
          <LayeredSystem
            selectedYear={selectedYear}
            onNavigate={handleNavigation}
            stateManager={stateManager}
          />
        );
      case 'code-on-demand':
        return (
          <CodeOnDemand
            selectedYear={selectedYear}
            onNavigate={handleNavigation}
            stateManager={stateManager}
          />
        );
      default:
        return <RestOverview onNavigate={handleNavigation} />;
    }
  };

  return (
    <SpaceBetween direction="vertical" size="l">
      {currentPage === 'overview' && (
        <Header
          variant="h1"
          description="League of Legends is a multiplayer online battle arena (MOBA) game where two teams of 5 players compete. Each player controls a unique champion - a character with distinct abilities, strengths, and weaknesses. There are 160+ champions, each with their own lore, abilities, and gameplay role. This site demonstrates REST and API fundamentals using real Riot Games data."
        >
          Rift Rewind: REST API fundamentals with Riot Games Developer Portal
        </Header>
      )}
      
      {currentPage === 'overview' && (
        <Alert
          statusIconAriaLabel="Info"
          header="🚀 Live REST API Integration"
        >
          Web interface with Cloudscape buttons/tables built with Vite and hosted on S3 → Amazon Lambda cloud functions running Python code on Amazon Web Services → Multiple Riot APIs including Challenges, Summoner, Champion Expertise, and Data Dragon content delivery network | Interactive REST constraint examples - design rules demonstrated with real League of Legends data
        </Alert>
      )}
      
      {renderCurrentPage()}
    </SpaceBetween>
  );
};

export default RiftRewindDashboard;