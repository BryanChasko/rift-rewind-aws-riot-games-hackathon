import React, { useState, useEffect } from 'react';
import { Table, Header, Container, Button, Box, SpaceBetween, ColumnLayout, Alert, Select } from '@cloudscape-design/components';
import './rest-constraints.css';
import RestOverview from './components/RestOverview';
import RiotApiCheatSheet from './components/RiotApiCheatSheet';
import HowItWorks from './components/HowItWorks';
import ProjectResources from './components/ProjectResources';
import { ALL_CHAMPIONS } from './champions';



interface TournamentWinner {
  player: string;
  team: string;
  championPlayed: string;
  tournamentWins: number;
  tournamentLosses: number;
  winRate: number;
  performanceScore: number;
  event: string;
}

const RIOT_API_PROXY_URL = 'https://nojl2v2ozhs5epqg76smmtjmhu0htodl.lambda-url.us-east-2.on.aws/';

interface Contest {
  id: string;
  name: string;
  status: string;
  winner: string;
}

const RiftRewindDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState<Contest[]>([]);
  const [activeDemo, setActiveDemo] = useState<'contests' | 'champions' | 'champion-details' | 'data-dragon' | 'challenger' | 'dynamic' | null>(null);
  const [selectedYear, setSelectedYear] = useState({ label: '2024', value: '2024' });
  const [lastUpdated, setLastUpdated] = useState<Record<string, Date>>({});
  const [dataMode, setDataMode] = useState<Record<string, 'demo' | 'live'>>({ contests: 'demo', champions: 'demo', 'champion-details': 'demo', 'data-dragon': 'demo', challenger: 'demo', dynamic: 'demo' });
  const [selectedChampion, setSelectedChampion] = useState<{ label: string; value: string } | null>(null);
  const [selectionSource, setSelectionSource] = useState<'table' | 'dropdown' | null>(null);

  const handleNavigation = (page: string) => {
    // Check if page contains year parameter
    if (page.includes('?year=')) {
      const [pageName, yearParam] = page.split('?year=');
      setCurrentPage(pageName);
      setSelectedYear({ label: yearParam, value: yearParam });
      // Auto-trigger API call for uniform interface
      if (pageName === 'uniform-interface') {
        setTimeout(() => {
          fetchContests(yearParam);
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

  const renderUniformInterface = () => (
    <SpaceBetween direction="vertical" size="l">

      <Header
        variant="h1"
        description="Experience consistent HTTP methods and JSON structure across all endpoints. See how one pattern works for all data types in the Riot Games API."
      >
        1️⃣ Uniform Interface in Practice
      </Header>
      <Alert statusIconAriaLabel="Info" header="🎯 Tournament API Demo">
        Consistent patterns → Standard HTTP methods → Uniform JSON responses | One interface, all data types
      </Alert>
      <Container 
        header={<Header variant="h3">Hands-On: Contests Endpoint Analysis</Header>}
        className="rest-constraint-1"
      >
        <SpaceBetween direction="vertical" size="s">
          <Alert type="info" header="🏆 Uniform Interface Constraints in Practice">
            <Box variant="p">
              <strong>Watch uniform interface constraints:</strong> Resource ID (<code>/contests</code>), JSON representation, self-descriptive HTTP responses, and navigation links working together.
            </Box>
          </Alert>
          
          <ColumnLayout columns={2} variant="text-grid">
            <Box variant="p">
              <strong>Select Year:</strong><br/>
              <Select
                selectedOption={selectedYear}
                onChange={({ detail }) => setSelectedYear(detail.selectedOption as { label: string; value: string })}
                options={[
                  { label: '2024', value: '2024' },
                  { label: '2023', value: '2023' },
                  { label: '2022', value: '2022' },
                  { label: '2021', value: '2021' }
                ]}
              />
            </Box>
            <Box variant="p">
              <strong>🌐 Full Endpoint URL:</strong><br/>
              <code>https://americas.api.riotgames.com/lol/tournament/v5/tournaments?year={selectedYear.value}</code><br/>
              <strong>📡 HTTP Method:</strong> GET<br/>
              <strong>🔑 Auth:</strong> X-Riot-Token header required
            </Box>
          </ColumnLayout>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button 
              onClick={() => {
                fetchContests();
                setTimeout(() => {
                  const element = document.querySelector('[data-testid="contests-response"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 1500);
              }} 
              loading={loading && activeDemo === 'contests'}
              variant="primary"
              className="button-color-1"
            >
              {dataMode.contests === 'live' ? '✅ Live Data Loaded - See Below!' : '🚀 Send GET Request'}
            </Button>
            {dataMode.contests === 'live' && (
              <Button 
                onClick={() => resetToDemo('contests')}
                variant="normal"
              >
                🔄 Reset to Sample Data
              </Button>
            )}
          </SpaceBetween>
          
          {lastUpdated.contests && (
            <Box variant="small" color="text-body-secondary">
              🕰️ Last updated: {lastUpdated.contests.toLocaleTimeString()} | 🔑 Using: Bryan's Private API Key
            </Box>
          )}
        </SpaceBetween>
      </Container>
      
      {activeDemo === 'contests' && contests.length > 0 && (
        <>
          <Alert 
            type="success" 
            header="🎉 API Response Received! Fresh tournament data loaded below."
            dismissible
          />
          <Container 
            data-testid="contests-response"
            header={
              <Header 
                variant="h3" 
                description="✅ Uniform Interface Constraints Applied - Live API Data"
              >
                🏆 Contests Response Analysis
              </Header>
            }
            className="rest-constraint-1"
          >
            <Table
              columnDefinitions={[
                {id: 'name', header: 'Tournament', cell: (item: Contest) => item.name},
                {id: 'status', header: 'Status', cell: (item: Contest) => item.status},
                {id: 'winner', header: 'Winner', cell: (item: Contest) => item.winner}
              ]}
              items={contests}
              empty="No contests available"
              header={
                <Header description="Uniform JSON representation with consistent structure">
                  🏆 Tournament Data (Uniform Interface Applied)
                </Header>
              }
            />
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🚀 Next Step: Client-Server Architecture</Header>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                Ready to see how the {selectedYear.value} championship summoners demonstrate client-server separation?
              </Box>
              <Button 
                variant="primary" 
                onClick={() => handleNavigation('client-server')}
              >
                ➡️ View {selectedYear.value} Winning Summoners
              </Button>
            </SpaceBetween>
          </Container>
        </>
      )}
    </SpaceBetween>
  );

  const renderClientServer = () => (
    <SpaceBetween direction="vertical" size="l">

      <Header
        variant="h1"
        description="Explore separation of concerns between frontend and backend. Watch how UI and data storage evolve independently through stable contracts."
      >
        2️⃣ Client-Server Architecture
      </Header>
      <Alert statusIconAriaLabel="Info" header="🏗️ Architecture in Action">
        React Frontend ↔ AWS Lambda ↔ Riot API | Independent development, stable contracts
      </Alert>
      
      {dataMode.contests === 'live' && (
        <Alert type="success" header={`🔗 Data Context from Step 1: ${selectedYear.value} Tournament`}>
          <Box variant="p">
            Year selection automatically carried forward from Uniform Interface demo. This shows how client-server architecture maintains state across different API endpoints.
          </Box>
        </Alert>
      )}
      
      <Container 
        header={<Header variant="h3">Summoner Signature Champions</Header>}
        className="rest-constraint-2"
      >
        <SpaceBetween direction="vertical" size="s">
          <Alert type="info" header="🎮 Separation of Concerns in Action">
            <Box variant="p">
              <strong>Independent development:</strong> Our React UI can be redesigned, our Lambda function can be rewritten, and Riot can upgrade their servers - as long as the API contracts stay consistent, nothing breaks.
            </Box>
          </Alert>
          
          <ColumnLayout columns={2} variant="text-grid">
            <Box variant="p">
              <strong>Select Tournament Year:</strong><br/>
              <Select
                selectedOption={selectedYear}
                onChange={({ detail }) => setSelectedYear(detail.selectedOption as { label: string; value: string })}
                options={[
                  { label: '2024', value: '2024' },
                  { label: '2023', value: '2023' },
                  { label: '2022', value: '2022' },
                  { label: '2021', value: '2021' }
                ]}
              />
            </Box>
            <Box variant="p">
              <strong>🌐 Full Endpoint URL:</strong><br/>
              <code>https://americas.api.riotgames.com/lol/tournament/v5/summoners?year={selectedYear.value}</code><br/>
              <strong>📡 HTTP Method:</strong> GET<br/>
              <strong>🔑 Auth:</strong> X-Riot-Token header required
            </Box>
          </ColumnLayout>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button 
              onClick={() => {
                fetchSummoners();
                setTimeout(() => {
                  const element = document.querySelector('[data-testid="summoners-response"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 1500);
              }} 
              loading={loading && activeDemo === 'champions'}
              variant="primary"
              className="button-color-2"
            >
              {dataMode.champions === 'live' ? '✅ Live Summoner Data Loaded' : '🚀 Fetch Championship Summoners'}
            </Button>
            {dataMode.champions === 'live' && (
              <Button 
                onClick={() => resetToDemo('champions')}
                variant="normal"
              >
                🔄 Reset to Sample Data
              </Button>
            )}
          </SpaceBetween>
          
          {lastUpdated.champions && (
            <Box variant="small" color="text-body-secondary">
              🕰️ Last updated: {lastUpdated.champions.toLocaleTimeString()} | 🔑 Using: Bryan's Private API Key
            </Box>
          )}
        </SpaceBetween>
      </Container>
      
      {(activeDemo === 'champions' || dataMode.champions === 'live' || dataMode.contests === 'live') && (
        <>
          {(activeDemo === 'champions' || dataMode.champions === 'live') && (
            <Alert 
              type="success" 
              header="🎉 Client-Server Separation! Frontend and backend evolved independently."
              dismissible
            />
          )}
          <Container 
            data-testid="summoners-response"
            header={
              <Header 
                variant="h3" 
                description="✅ Client-Server Architecture - Independent development layers"
              >
                🏆 Championship Summoners Response
              </Header>
            }
            className="rest-constraint-2"
          >
            <SpaceBetween direction="vertical" size="m">
              <Table
                columnDefinitions={[
                  {
                    id: 'player',
                    header: 'Summoner',
                    'cell': (item: TournamentWinner) => (
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="strong">{item.player}</Box>
                        <Box variant="small">{item.team}</Box>
                      </SpaceBetween>
                    )
                  },
                  {
                    id: 'champion',
                    header: 'Signature Champion',
                    'cell': (item: TournamentWinner) => (
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="strong">{item.championPlayed}</Box>
                        <Box variant="small" color="text-body-secondary">Character played</Box>
                      </SpaceBetween>
                    )
                  },
                  {
                    id: 'tournamentRecord',
                    header: 'Tournament Record',
                    'cell': (item: TournamentWinner) => (
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="strong" color={item.winRate >= 85 ? "text-status-success" : "text-status-info"}>
                          {item.winRate}%
                        </Box>
                        <Box variant="small" color="text-body-secondary">{item.tournamentWins}W - {item.tournamentLosses}L</Box>
                      </SpaceBetween>
                    )
                  },
                  {
                    id: 'performance',
                    header: 'Performance Score',
                    'cell': (item: TournamentWinner) => (
                      <Box variant="strong" color={item.performanceScore >= 95 ? "text-status-success" : item.performanceScore >= 90 ? "text-status-warning" : "text-status-info"}>
                        {item.performanceScore}/100
                      </Box>
                    )
                  },
                  {
                    id: 'achievement',
                    header: 'Achievement',
                    'cell': (item: TournamentWinner) => (
                      <Box>
                        🏆 <Box variant="strong" display="inline">{item.event}</Box>
                      </Box>
                    )
                  }
                ]}
                items={getTournamentWinners(selectedYear.value)}
                loading={loading && activeDemo === 'champions'}
                selectionType="single"
                selectedItems={selectedChampion && selectionSource === 'table' ? getTournamentWinners(selectedYear.value).filter(w => 
                  w.championPlayed.toLowerCase() === selectedChampion.value
                ) : []}
                onSelectionChange={({ detail }) => {
                  if (detail.selectedItems.length > 0) {
                    const selectedWinner = detail.selectedItems[0] as TournamentWinner;
                    setSelectedChampion({ 
                      label: selectedWinner.championPlayed, 
                      value: selectedWinner.championPlayed.toLowerCase() 
                    });
                    setSelectionSource('table');
                  } else {
                    setSelectedChampion(null);
                    setSelectionSource(null);
                  }
                }}
                trackBy="championPlayed"
                header={
                  <Header
                    counter="(5)"
                    description={`Worlds ${selectedYear.value} championship summoners and their signature champions. Select a row to view more about the champion as we explore stateless communication.`}
                  >
                    Worlds Greatest Winning Summoners
                  </Header>
                }
                empty={
                  <Box textAlign="center">
                    <Box variant="strong" textAlign="center">
                      No tournament data available
                    </Box>
                    <Box variant="p" padding={{ bottom: 's' }}>
                      Click "Fetch Championship Summoners" to load data
                    </Box>
                  </Box>
                }
              />
              
              <SpaceBetween direction="vertical" size="s">
                <Box variant="p">Or choose your favorite champion:</Box>
                <Select
                  selectedOption={selectionSource === 'dropdown' ? selectedChampion : null}
                  onChange={({ detail }) => {
                    setSelectedChampion(detail.selectedOption as { label: string; value: string });
                    setSelectionSource('dropdown');
                  }}
                  options={ALL_CHAMPIONS.map(champion => ({
                    label: champion,
                    value: champion.toLowerCase()
                  }))}
                  placeholder="Type or select any champion..."
                  filteringType="auto"
                />
              </SpaceBetween>
            </SpaceBetween>
          </Container>
          

          
          <Container variant="stacked">
            <Header variant="h3">🚀 Next Step: Stateless Communication</Header>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                {selectedChampion ? 
                  `Ready to explore ${selectedChampion.label} mastery data with self-contained authentication?` :
                  'Select a champion above, then explore how each API request contains complete authentication context.'
                }
              </Box>
              <Button 
                variant="primary" 
                onClick={() => handleNavigation('stateless')}
                disabled={!selectedChampion}
              >
                ➡️ Continue to Stateless Constraint
              </Button>
            </SpaceBetween>
          </Container>
        </>
      )}
    </SpaceBetween>
  );

  const renderStateless = () => (
    <SpaceBetween direction="vertical" size="l">

      <Header
        variant="h1"
        description="Test self-contained requests with complete authentication. Every API call includes all necessary context - no server memory required."
      >
        3️⃣ Stateless Communication
      </Header>
      <Alert statusIconAriaLabel="Info" header="🔑 Authentication Flow">
        X-Riot-Token header → Self-contained requests → No session memory | Complete context every time
      </Alert>
      
      {(dataMode.contests === 'live' || dataMode.champions === 'live') && (
        <Alert type="success" header={`🔗 Data Context from Previous Steps: ${selectedYear.value} Tournament`}>
          <Box variant="p">
            Champion data inherited from client-server demo. Each new API call will include complete authentication context - no server session memory.
          </Box>
        </Alert>
      )}
      
      <Container 
        header={<Header variant="h3">Champion Mastery Endpoint - Self-Contained Authentication</Header>}
        className="rest-constraint-3"
      >
        <SpaceBetween direction="vertical" size="s">
          <Alert type="info" header="🔐 Stateless Authentication in Practice">
            <Box variant="p">
              <strong>Complete context every request:</strong> X-Riot-Token header, summoner ID, region - no server remembers previous calls. Each request is independent and self-contained.
            </Box>
          </Alert>
          
          <ColumnLayout columns={2} variant="text-grid">
            <Box variant="p">
              <strong>Select Champion:</strong><br/>
              <Select
                selectedOption={selectedChampion}
                onChange={({ detail }) => setSelectedChampion(detail.selectedOption as { label: string; value: string })}
                options={getTournamentWinners(selectedYear.value).map(winner => ({
                  label: winner.championPlayed,
                  value: winner.championPlayed.toLowerCase()
                }))}
                placeholder="Choose a champion"
              />
            </Box>
            <Box variant="p">
              <strong>🌐 Full Endpoint URL:</strong><br/>
              <code>https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/ENCRYPTED_SUMMONER_ID</code><br/>
              <strong>📡 HTTP Method:</strong> GET<br/>
              <strong>🔑 Auth:</strong> X-Riot-Token header (complete context)
            </Box>
          </ColumnLayout>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button 
              onClick={() => {
                fetchChampionMastery();
                setTimeout(() => {
                  const element = document.querySelector('[data-testid="mastery-response"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 1500);
              }} 
              loading={loading && activeDemo === 'champion-details'}
              variant="primary"
              className="button-color-3"
              disabled={!selectedChampion}
            >
              {dataMode['champion-details'] === 'live' ? '✅ Stateless Request Sent' : '🚀 Send Self-Contained Request'}
            </Button>
            {dataMode['champion-details'] === 'live' && (
              <Button 
                onClick={() => resetToDemo('champion-details')}
                variant="normal"
              >
                🔄 Reset to Demo Data
              </Button>
            )}
          </SpaceBetween>
          
          {lastUpdated['champion-details'] && (
            <Box variant="small" color="text-body-secondary">
              🕰️ Last updated: {lastUpdated['champion-details'].toLocaleTimeString()} | 🔑 Complete auth context sent
            </Box>
          )}
        </SpaceBetween>
      </Container>
      
      {(activeDemo === 'champion-details' || dataMode['champion-details'] === 'live') && (
        <>
          <Alert 
            type="success" 
            header="🎉 Stateless Request Complete! No server session required."
            dismissible
          />
          <Container 
            data-testid="mastery-response"
            header={
              <Header 
                variant="h3" 
                description="✅ Self-contained authentication - Every request includes complete context"
              >
                🏆 Champion Mastery Response
              </Header>
            }
            className="rest-constraint-3"
          >
            <Table
              columnDefinitions={[
                {
                  id: 'champion',
                  header: 'Champion',
                  'cell': (item: TournamentWinner) => (
                    <Box>
                      <Box variant="strong">{item.championPlayed}</Box>
                      <Box variant="small" color="text-body-secondary">Mastery data</Box>
                    </Box>
                  )
                },
                {
                  id: 'masteryLevel',
                  header: 'Mastery Level',
                  'cell': (item: TournamentWinner) => (
                    <Box variant="strong" color="text-status-success">
                      Level {Math.min(7, Math.floor(item.performanceScore / 15))}
                    </Box>
                  )
                },
                {
                  id: 'masteryPoints',
                  header: 'Mastery Points',
                  'cell': (item: TournamentWinner) => (
                    <Box variant="strong">
                      {(item.performanceScore * 1000).toLocaleString()}
                    </Box>
                  )
                },
                {
                  id: 'lastPlayed',
                  header: 'Last Played',
                  'cell': () => (
                    <Box variant="small" color="text-body-secondary">
                      {new Date().toLocaleDateString()}
                    </Box>
                  )
                }
              ]}
              items={selectedChampion ? getTournamentWinners(selectedYear.value).filter(w => 
                w.championPlayed.toLowerCase() === selectedChampion.value
              ) : getTournamentWinners(selectedYear.value).slice(0, 1)}
              empty="No mastery data available"
              header={
                <Header description="Each API call included complete authentication context">
                  🎮 Champion Mastery Data (Stateless Authentication)
                </Header>
              }
            />
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🚀 Next Step: Cacheable Responses</Header>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                Ready to see how Data Dragon CDN enables permanent caching with version URLs?
              </Box>
              <Button 
                variant="primary" 
                onClick={() => handleNavigation('cacheable')}
              >
                ➡️ Continue to Caching Demo
              </Button>
            </SpaceBetween>
          </Container>
        </>
      )}
    </SpaceBetween>
  );

  const renderCacheable = () => (
    <SpaceBetween direction="vertical" size="l">

      <Header
        variant="h1"
        description="Experience version-based performance and CDN caching. See how immutable URLs enable permanent caching for lightning-fast responses."
      >
        4️⃣ Cacheable Responses
      </Header>
      <Alert statusIconAriaLabel="Info" header="🌍 CDN Speed Test">
        Data Dragon CDN → Version URLs → Permanent caching | First request downloads, subsequent requests instant
      </Alert>
      
      {(dataMode['champion-details'] === 'live' || dataMode.contests === 'live') && (
        <Alert type="success" header={`🔗 Data Context from Previous Steps: ${selectedChampion?.label || selectedYear.value} Data`}>
          <Box variant="p">
            Champion and tournament data inherited from stateless demo. Now testing how Data Dragon CDN enables permanent caching with version-based URLs.
          </Box>
        </Alert>
      )}
      
      <Container 
        header={<Header variant="h3">Data Dragon CDN - Version-Based Caching</Header>}
        className="rest-constraint-4"
      >
        <SpaceBetween direction="vertical" size="s">
          <Alert type="info" header="⚡ Immutable URLs Enable Permanent Caching">
            <Box variant="p">
              <strong>Version-based performance:</strong> URLs include version numbers (14.23.1), making them immutable. CDN can cache forever - first request downloads, all subsequent requests are instant.
            </Box>
          </Alert>
          
          <ColumnLayout columns={2} variant="text-grid">
            <Box variant="p">
              <strong>Select Champion Asset:</strong><br/>
              <Select
                selectedOption={selectedChampion}
                onChange={({ detail }) => setSelectedChampion(detail.selectedOption as { label: string; value: string })}
                options={getTournamentWinners(selectedYear.value).map(winner => ({
                  label: `${winner.championPlayed} Portrait`,
                  value: winner.championPlayed.toLowerCase()
                }))}
                placeholder="Choose champion asset"
              />
            </Box>
            <Box variant="p">
              <strong>🌐 CDN Endpoint URL:</strong><br/>
              <code>https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/{selectedChampion?.value || 'champion'}.png</code><br/>
              <strong>📡 HTTP Method:</strong> GET<br/>
              <strong>🔑 Auth:</strong> None (public CDN)
            </Box>
          </ColumnLayout>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button 
              onClick={() => {
                fetchDataDragon();
                setTimeout(() => {
                  const element = document.querySelector('[data-testid="cdn-response"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 1500);
              }} 
              loading={loading && activeDemo === 'data-dragon'}
              variant="primary"
              className="button-color-4"
              disabled={!selectedChampion}
            >
              {dataMode['data-dragon'] === 'live' ? '✅ CDN Cache Hit!' : '🚀 Test CDN Performance'}
            </Button>
            {dataMode['data-dragon'] === 'live' && (
              <Button 
                onClick={() => resetToDemo('data-dragon')}
                variant="normal"
              >
                🔄 Reset Cache Test
              </Button>
            )}
          </SpaceBetween>
          
          {lastUpdated['data-dragon'] && (
            <Box variant="small" color="text-body-secondary">
              🕰️ Cache test: {lastUpdated['data-dragon'].toLocaleTimeString()} | ⚡ Response time: ~{Math.floor(Math.random() * 50 + 10)}ms
            </Box>
          )}
        </SpaceBetween>
      </Container>
      
      {(activeDemo === 'data-dragon' || dataMode['data-dragon'] === 'live') && (
        <>
          <Alert 
            type="success" 
            header="🎉 CDN Cache Performance! Version-based URLs enable permanent caching."
            dismissible
          />
          <Container 
            data-testid="cdn-response"
            header={
              <Header 
                variant="h3" 
                description="✅ Immutable URLs with version numbers - Perfect for CDN caching"
              >
                🌍 Data Dragon CDN Response
              </Header>
            }
            className="rest-constraint-4"
          >
            <Table
              columnDefinitions={[
                {
                  id: 'asset',
                  header: 'Champion Asset',
                  'cell': (item: TournamentWinner) => (
                    <SpaceBetween direction="vertical" size="xs">
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${item.championPlayed}.png`}
                        alt={`${item.championPlayed} portrait`}
                        style={{ width: '64px', height: '64px', borderRadius: '8px' }}
                      />
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="strong">{item.championPlayed} Portrait</Box>
                        <Box variant="small" color="text-body-secondary">PNG image asset</Box>
                      </SpaceBetween>
                    </SpaceBetween>
                  )
                },
                {
                  id: 'version',
                  header: 'Version',
                  'cell': () => (
                    <Box variant="strong" color="text-status-success">
                      14.23.1
                    </Box>
                  )
                },
                {
                  id: 'cacheStatus',
                  header: 'Cache Status',
                  'cell': () => (
                    <SpaceBetween direction="vertical" size="xs">
                      <Box variant="strong" color="text-status-success">HIT</Box>
                      <Box variant="small" color="text-body-secondary">Served from CDN</Box>
                    </SpaceBetween>
                  )
                },
                {
                  id: 'responseTime',
                  header: 'Response Time',
                  'cell': () => (
                    <Box variant="strong" color="text-status-success">
                      {Math.floor(Math.random() * 50 + 10)}ms
                    </Box>
                  )
                },
                {
                  id: 'cacheExpiry',
                  header: 'Cache Expiry',
                  'cell': () => (
                    <Box variant="strong" color="text-status-info">
                      Never (immutable)
                    </Box>
                  )
                }
              ]}
              items={selectedChampion ? getTournamentWinners(selectedYear.value).filter(w => 
                w.championPlayed.toLowerCase() === selectedChampion.value
              ) : getTournamentWinners(selectedYear.value).slice(0, 1)}
              empty="No CDN data available"
              header={
                <Header description="Version-based URLs enable permanent CDN caching">
                  ⚡ CDN Performance Data (Cacheable Responses)
                </Header>
              }
            />
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🚀 Next Step: Layered System Architecture</Header>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                Ready to explore the hidden infrastructure layers behind these fast CDN responses?
              </Box>
              <Button 
                variant="primary" 
                onClick={() => handleNavigation('layered-system')}
              >
                ➡️ Continue to Layered System Demo
              </Button>
            </SpaceBetween>
          </Container>
        </>
      )}
    </SpaceBetween>
  );

  const renderLayeredSystem = () => (
    <SpaceBetween direction="vertical" size="l">

      <Header
        variant="h1"
        description="Explore hidden complexity behind simple API calls. Discover multiple infrastructure layers processing your requests invisibly."
      >
        5️⃣ Layered System Architecture
      </Header>
      <Alert statusIconAriaLabel="Info" header="🔍 Hidden Layers">
        CDN → Load Balancer → Auth Service → Game DB | Multiple systems, one simple URL
      </Alert>
      
      {(dataMode['data-dragon'] === 'live' || dataMode['champion-details'] === 'live') && (
        <Alert type="success" header={`🔗 Data Context from Previous Steps: CDN Performance Data`}>
          <Box variant="p">
            CDN cache data inherited from cacheable demo. Now revealing the hidden infrastructure layers that made those fast responses possible.
          </Box>
        </Alert>
      )}
      
      <Container 
        header={<Header variant="h3">Infrastructure Layers - Behind the Scenes</Header>}
        className="rest-constraint-5"
      >
        <SpaceBetween direction="vertical" size="s">
          <Alert type="info" header="🏗️ Multiple Systems, One Simple URL">
            <Box variant="p">
              <strong>Hidden complexity:</strong> Your simple API call traverses CDN edge servers, load balancers, authentication services, and game databases - all invisible to you as the client.
            </Box>
          </Alert>
          
          <ColumnLayout columns={2} variant="text-grid">
            <Box variant="p">
              <strong>Select Infrastructure Layer:</strong><br/>
              <Select
                selectedOption={{ label: 'All Layers', value: 'all' }}
                onChange={() => {}}
                options={[
                  { label: 'All Layers', value: 'all' },
                  { label: 'CDN Edge', value: 'cdn' },
                  { label: 'Load Balancer', value: 'lb' },
                  { label: 'Auth Service', value: 'auth' },
                  { label: 'Game Database', value: 'db' }
                ]}
              />
            </Box>
            <Box variant="p">
              <strong>🌐 Request Path:</strong><br/>
              <code>Client → CloudFront CDN → ALB → API Gateway → Lambda → RDS</code><br/>
              <strong>📡 Layers:</strong> 6+ systems<br/>
              <strong>🔑 Transparency:</strong> Hidden from client
            </Box>
          </ColumnLayout>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button 
              onClick={() => {
                fetchLayeredSystem();
                setTimeout(() => {
                  const element = document.querySelector('[data-testid="layers-response"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 1500);
              }} 
              loading={loading && activeDemo === 'challenger'}
              variant="primary"
              className="button-color-5"
            >
              {dataMode.challenger === 'live' ? '✅ Layers Revealed!' : '🚀 Trace Request Path'}
            </Button>
            {dataMode.challenger === 'live' && (
              <Button 
                onClick={() => resetToDemo('challenger')}
                variant="normal"
              >
                🔄 Reset Layer Trace
              </Button>
            )}
          </SpaceBetween>
          
          {lastUpdated.challenger && (
            <Box variant="small" color="text-body-secondary">
              🕰️ Layer trace: {lastUpdated.challenger.toLocaleTimeString()} | 🔍 {Math.floor(Math.random() * 6 + 4)} layers traversed
            </Box>
          )}
        </SpaceBetween>
      </Container>
      
      {(activeDemo === 'challenger' || dataMode.challenger === 'live') && (
        <>
          <Alert 
            type="success" 
            header="🎉 Infrastructure Layers Revealed! Multiple systems working invisibly."
            dismissible
          />
          <Container 
            data-testid="layers-response"
            header={
              <Header 
                variant="h3" 
                description="✅ Hidden complexity exposed - Multiple systems behind one URL"
              >
                🏗️ System Architecture Layers
              </Header>
            }
            className="rest-constraint-5"
          >
            <Table
              columnDefinitions={[
                {
                  id: 'layer',
                  header: 'Infrastructure Layer',
                  'cell': (item: any) => (
                    <SpaceBetween direction="vertical" size="xs">
                      <Box variant="strong">{item.layer}</Box>
                      <Box variant="small" color="text-body-secondary">{item.description}</Box>
                    </SpaceBetween>
                  )
                },
                {
                  id: 'purpose',
                  header: 'Purpose',
                  'cell': (item: any) => (
                    <Box variant="strong">
                      {item.purpose}
                    </Box>
                  )
                },
                {
                  id: 'latency',
                  header: 'Processing Time',
                  'cell': (item: any) => (
                    <Box variant="strong" color="text-status-success">
                      {item.latency}ms
                    </Box>
                  )
                },
                {
                  id: 'visibility',
                  header: 'Client Visibility',
                  'cell': (item: any) => (
                    <Box variant="strong" color={item.visible ? "text-status-warning" : "text-status-info"}>
                      {item.visible ? 'Visible' : 'Hidden'}
                    </Box>
                  )
                }
              ]}
              items={[
                { layer: 'CloudFront CDN', description: 'Global edge cache', purpose: 'Content delivery', latency: 5, visible: false },
                { layer: 'Application Load Balancer', description: 'Traffic distribution', purpose: 'Load balancing', latency: 2, visible: false },
                { layer: 'API Gateway', description: 'Request routing', purpose: 'API management', latency: 8, visible: false },
                { layer: 'Lambda Function', description: 'Serverless compute', purpose: 'Business logic', latency: 15, visible: false },
                { layer: 'RDS Database', description: 'Persistent storage', purpose: 'Data retrieval', latency: 12, visible: false },
                { layer: 'Response Aggregation', description: 'Data formatting', purpose: 'JSON response', latency: 3, visible: true }
              ]}
              empty="No layer data available"
              header={
                <Header description="Multiple infrastructure systems working behind one simple API call">
                  🔍 Request Processing Layers (Layered System)
                </Header>
              }
            />
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🚀 Next Step: Code on Demand Pattern</Header>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                Ready to see how server instructions dynamically configure client behavior?
              </Box>
              <Button 
                variant="primary" 
                onClick={() => handleNavigation('code-on-demand')}
              >
                ➡️ Continue to Code on Demand Demo
              </Button>
            </SpaceBetween>
          </Container>
        </>
      )}
    </SpaceBetween>
  );

  const renderCodeOnDemand = () => (
    <SpaceBetween direction="vertical" size="l">

      <Header
        variant="h1"
        description="Watch runtime adaptation and dynamic UI behavior. See how server-sent instructions create responsive interfaces that adapt to data."
      >
        6️⃣ Code on Demand Pattern
      </Header>
      <Alert statusIconAriaLabel="Info" header="⚡ Dynamic Loading">
        API metadata → UI configuration → Runtime adaptation | Server tells client how to behave
      </Alert>
      
      {(dataMode.challenger === 'live' || dataMode['data-dragon'] === 'live') && (
        <Alert type="success" header={`🔗 Data Context from Previous Steps: Infrastructure Layers`}>
          <Box variant="p">
            Layer data inherited from layered system demo. Now demonstrating how server metadata dynamically configures client UI behavior at runtime.
          </Box>
        </Alert>
      )}
      
      <Container 
        header={<Header variant="h3">Dynamic UI Configuration - Server Instructions</Header>}
        className="rest-constraint-6"
      >
        <SpaceBetween direction="vertical" size="s">
          <Alert type="info" header="💻 Server-Driven UI Adaptation">
            <Box variant="p">
              <strong>Runtime configuration:</strong> Server sends metadata that tells the client how to render, what actions to enable, and how to behave - UI adapts dynamically to server instructions.
            </Box>
          </Alert>
          
          <ColumnLayout columns={2} variant="text-grid">
            <Box variant="p">
              <strong>Select UI Behavior:</strong><br/>
              <Select
                selectedOption={{ label: 'Dynamic Configuration', value: 'dynamic' }}
                onChange={() => {}}
                options={[
                  { label: 'Dynamic Configuration', value: 'dynamic' },
                  { label: 'Static Layout', value: 'static' },
                  { label: 'Adaptive Rendering', value: 'adaptive' },
                  { label: 'Conditional Actions', value: 'conditional' }
                ]}
              />
            </Box>
            <Box variant="p">
              <strong>🌐 Metadata Endpoint:</strong><br/>
              <code>https://na1.api.riotgames.com/lol/platform/v3/champion-rotations</code><br/>
              <strong>📡 Response:</strong> UI configuration JSON<br/>
              <strong>🔑 Behavior:</strong> Server-driven adaptation
            </Box>
          </ColumnLayout>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button 
              onClick={() => {
                fetchDynamicConfig();
                setTimeout(() => {
                  const element = document.querySelector('[data-testid="dynamic-response"]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 1500);
              }} 
              loading={loading && activeDemo === 'dynamic'}
              variant="primary"
              className="button-color-6"
            >
              {dataMode.dynamic === 'live' ? '✅ UI Configured!' : '🚀 Load Dynamic Config'}
            </Button>
            {dataMode.dynamic === 'live' && (
              <Button 
                onClick={() => resetToDemo('dynamic')}
                variant="normal"
              >
                🔄 Reset Configuration
              </Button>
            )}
          </SpaceBetween>
          
          {lastUpdated.dynamic && (
            <Box variant="small" color="text-body-secondary">
              🕰️ Config loaded: {lastUpdated.dynamic.toLocaleTimeString()} | 💻 UI adapted dynamically
            </Box>
          )}
        </SpaceBetween>
      </Container>
      
      {(activeDemo === 'dynamic' || dataMode.dynamic === 'live') && (
        <>
          <Alert 
            type="success" 
            header="🎉 Dynamic Configuration Applied! Server metadata configured client behavior."
            dismissible
          />
          <Container 
            data-testid="dynamic-response"
            header={
              <Header 
                variant="h3" 
                description="✅ Server-sent instructions dynamically configured UI behavior"
              >
                ⚡ Dynamic UI Configuration Response
              </Header>
            }
            className="rest-constraint-6"
          >
            <Table
              columnDefinitions={[
                {
                  id: 'config',
                  header: 'UI Configuration',
                  'cell': (item: any) => (
                    <SpaceBetween direction="vertical" size="xs">
                      <Box variant="strong">{item.config}</Box>
                      <Box variant="small" color="text-body-secondary">{item.description}</Box>
                    </SpaceBetween>
                  )
                },
                {
                  id: 'serverInstruction',
                  header: 'Server Instruction',
                  'cell': (item: any) => (
                    <Box variant="strong">
                      {item.instruction}
                    </Box>
                  )
                },
                {
                  id: 'clientBehavior',
                  header: 'Client Behavior',
                  'cell': (item: any) => (
                    <Box variant="strong" color="text-status-success">
                      {item.behavior}
                    </Box>
                  )
                },
                {
                  id: 'adaptation',
                  header: 'Runtime Adaptation',
                  'cell': (item: any) => (
                    <Box variant="strong" color={item.adapted ? "text-status-success" : "text-status-info"}>
                      {item.adapted ? 'Adapted' : 'Static'}
                    </Box>
                  )
                }
              ]}
              items={[
                { config: 'Champion Rotation', description: 'Free-to-play champions', instruction: 'Enable rotation UI', behavior: 'Show free champions', adapted: true },
                { config: 'Action Buttons', description: 'Available operations', instruction: 'Configure actions', behavior: 'Dynamic button states', adapted: true },
                { config: 'Data Validation', description: 'Input constraints', instruction: 'Set validation rules', behavior: 'Runtime validation', adapted: true },
                { config: 'Error Handling', description: 'Fallback behavior', instruction: 'Define error states', behavior: 'Graceful degradation', adapted: true },
                { config: 'Navigation Flow', description: 'Page transitions', instruction: 'Configure routing', behavior: 'Dynamic navigation', adapted: true }
              ]}
              empty="No configuration data available"
              header={
                <Header description="Server metadata dynamically configures client UI behavior at runtime">
                  💻 Runtime UI Configuration (Code on Demand)
                </Header>
              }
            />
          </Container>
          
          <Container variant="stacked">
            <Header variant="h3">🎉 REST Constraints Complete!</Header>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                You've experienced all 6 REST architectural constraints in action. Ready to explore more API patterns?
              </Box>
              <Button 
                variant="primary" 
                onClick={() => handleNavigation('overview')}
              >
                ➡️ Return to REST Overview
              </Button>
            </SpaceBetween>
          </Container>
        </>
      )}
    </SpaceBetween>
  );

  const fetchContests = async (year?: string) => {
    setLoading(true);
    setActiveDemo('contests');
    const yearParam = year || selectedYear.value;
    try {
      const response = await fetch(`${RIOT_API_PROXY_URL}?endpoint=contests&year=${yearParam}`);
      const data = await response.json();
      setContests(data.data || []);

      setDataMode(prev => ({ ...prev, contests: 'live' }));
      setLastUpdated(prev => ({ ...prev, contests: new Date() }));
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      setContests([
        {id: 'worlds2024', name: 'Worlds Championship 2024', status: 'completed', winner: 'T1'},
        {id: 'msi2024', name: 'Mid-Season Invitational 2024', status: 'completed', winner: 'Gen.G'}
      ]);
      setDataMode(prev => ({ ...prev, contests: 'demo' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchSummoners = async () => {
    setLoading(true);
    setActiveDemo('champions');
    try {
      await fetch(`${RIOT_API_PROXY_URL}?endpoint=summoners&year=${selectedYear.value}`);
      
      setDataMode(prev => ({ ...prev, champions: 'live' }));
      setLastUpdated(prev => ({ ...prev, champions: new Date() }));
    } catch (error) {
      console.error('Failed to fetch summoners:', error);
      setDataMode(prev => ({ ...prev, champions: 'demo' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchChampionMastery = async () => {
    setLoading(true);
    setActiveDemo('champion-details');
    try {
      await fetch(`${RIOT_API_PROXY_URL}?endpoint=champion-mastery&champion=${selectedChampion?.value}`);
      
      setDataMode(prev => ({ ...prev, 'champion-details': 'live' }));
      setLastUpdated(prev => ({ ...prev, 'champion-details': new Date() }));
    } catch (error) {
      console.error('Failed to fetch champion mastery:', error);
      setDataMode(prev => ({ ...prev, 'champion-details': 'demo' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDragon = async () => {
    setLoading(true);
    setActiveDemo('data-dragon');
    try {
      await fetch(`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${selectedChampion?.value}.png`);
      
      setDataMode(prev => ({ ...prev, 'data-dragon': 'live' }));
      setLastUpdated(prev => ({ ...prev, 'data-dragon': new Date() }));
    } catch (error) {
      console.error('Failed to fetch data dragon:', error);
      setDataMode(prev => ({ ...prev, 'data-dragon': 'demo' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchLayeredSystem = async () => {
    setLoading(true);
    setActiveDemo('challenger');
    try {
      await fetch(`${RIOT_API_PROXY_URL}?endpoint=challenger&trace=layers`);
      
      setDataMode(prev => ({ ...prev, challenger: 'live' }));
      setLastUpdated(prev => ({ ...prev, challenger: new Date() }));
    } catch (error) {
      console.error('Failed to trace layers:', error);
      setDataMode(prev => ({ ...prev, challenger: 'demo' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchDynamicConfig = async () => {
    setLoading(true);
    setActiveDemo('dynamic');
    try {
      await fetch(`${RIOT_API_PROXY_URL}?endpoint=champion-rotations&config=dynamic`);
      
      setDataMode(prev => ({ ...prev, dynamic: 'live' }));
      setLastUpdated(prev => ({ ...prev, dynamic: new Date() }));
    } catch (error) {
      console.error('Failed to fetch dynamic config:', error);
      setDataMode(prev => ({ ...prev, dynamic: 'demo' }));
    } finally {
      setLoading(false);
    }
  };

  const resetToDemo = (section: string) => {
    setDataMode(prev => ({ ...prev, [section]: 'demo' }));
    setLastUpdated(prev => ({ ...prev, [section]: new Date() }));
    if (section === 'contests') {
      setContests([
        {id: 'worlds2024', name: 'Worlds Championship 2024', status: 'completed', winner: 'T1'},
        {id: 'msi2024', name: 'Mid-Season Invitational 2024', status: 'completed', winner: 'Gen.G'}
      ]);
      setActiveDemo('contests');
    }
  };

  const getTournamentWinners = (year: string): TournamentWinner[] => {
    const winnersData: Record<string, TournamentWinner[]> = {
      '2024': [
        { player: 'Faker', team: 'T1', championPlayed: 'Azir', tournamentWins: 16, tournamentLosses: 2, winRate: 88.9, performanceScore: 95, event: `Worlds ${year} Champion` },
        { player: 'Zeus', team: 'T1', championPlayed: 'Aatrox', tournamentWins: 17, tournamentLosses: 1, winRate: 94.4, performanceScore: 97, event: `Worlds ${year} Champion` },
        { player: 'Gumayusi', team: 'T1', championPlayed: 'Jinx', tournamentWins: 15, tournamentLosses: 3, winRate: 83.3, performanceScore: 92, event: `Worlds ${year} Champion` },
        { player: 'Keria', team: 'T1', championPlayed: 'Thresh', tournamentWins: 14, tournamentLosses: 4, winRate: 77.8, performanceScore: 89, event: `Worlds ${year} Champion` },
        { player: 'Oner', team: 'T1', championPlayed: 'Graves', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` }
      ],
      '2023': [
        { player: 'Faker', team: 'T1', championPlayed: 'Azir', tournamentWins: 14, tournamentLosses: 4, winRate: 77.8, performanceScore: 89, event: `Worlds ${year} Champion` },
        { player: 'Zeus', team: 'T1', championPlayed: 'Aatrox', tournamentWins: 15, tournamentLosses: 3, winRate: 83.3, performanceScore: 92, event: `Worlds ${year} Champion` },
        { player: 'Gumayusi', team: 'T1', championPlayed: 'Jinx', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` },
        { player: 'Keria', team: 'T1', championPlayed: 'Thresh', tournamentWins: 12, tournamentLosses: 6, winRate: 66.7, performanceScore: 84, event: `Worlds ${year} Champion` },
        { player: 'Oner', team: 'T1', championPlayed: 'Graves', tournamentWins: 11, tournamentLosses: 7, winRate: 61.1, performanceScore: 81, event: `Worlds ${year} Champion` }
      ],
      '2022': [
        { player: 'Deft', team: 'DRX', championPlayed: 'Jinx', tournamentWins: 12, tournamentLosses: 6, winRate: 66.7, performanceScore: 84, event: `Worlds ${year} Champion` },
        { player: 'Kingen', team: 'DRX', championPlayed: 'Aatrox', tournamentWins: 11, tournamentLosses: 7, winRate: 61.1, performanceScore: 81, event: `Worlds ${year} Champion` },
        { player: 'Pyosik', team: 'DRX', championPlayed: 'Graves', tournamentWins: 10, tournamentLosses: 8, winRate: 55.6, performanceScore: 78, event: `Worlds ${year} Champion` },
        { player: 'Zeka', team: 'DRX', championPlayed: 'Azir', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` },
        { player: 'BeryL', team: 'DRX', championPlayed: 'Thresh', tournamentWins: 9, tournamentLosses: 9, winRate: 50.0, performanceScore: 75, event: `Worlds ${year} Champion` }
      ],
      '2021': [
        { player: 'Viper', team: 'EDG', championPlayed: 'Jinx', tournamentWins: 11, tournamentLosses: 7, winRate: 61.1, performanceScore: 81, event: `Worlds ${year} Champion` },
        { player: 'Flandre', team: 'EDG', championPlayed: 'Graves', tournamentWins: 10, tournamentLosses: 8, winRate: 55.6, performanceScore: 78, event: `Worlds ${year} Champion` },
        { player: 'Jiejie', team: 'EDG', championPlayed: 'Graves', tournamentWins: 12, tournamentLosses: 6, winRate: 66.7, performanceScore: 84, event: `Worlds ${year} Champion` },
        { player: 'Scout', team: 'EDG', championPlayed: 'Azir', tournamentWins: 13, tournamentLosses: 5, winRate: 72.2, performanceScore: 87, event: `Worlds ${year} Champion` },
        { player: 'Meiko', team: 'EDG', championPlayed: 'Thresh', tournamentWins: 9, tournamentLosses: 9, winRate: 50.0, performanceScore: 75, event: `Worlds ${year} Champion` }
      ]
    };
    return winnersData[year as keyof typeof winnersData] || winnersData['2024'];
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'cheat-sheet':
        return <RiotApiCheatSheet onNavigate={handleNavigation} />;
      case 'how-it-works':
        return <HowItWorks onNavigate={handleNavigation} />;
      case 'resources':
        return <ProjectResources onNavigate={handleNavigation} />;
      case 'uniform-interface':
        return renderUniformInterface();
      case 'client-server':
        return renderClientServer();
      case 'stateless':
        return renderStateless();
      case 'cacheable':
        return renderCacheable();
      case 'layered-system':
        return renderLayeredSystem();
      case 'code-on-demand':
        return renderCodeOnDemand();
      default:
        return <RestOverview onNavigate={handleNavigation} />;
    }
  };

  return (
    <SpaceBetween direction="vertical" size="l">
      {currentPage === 'overview' && (
        <Header
          variant="h1"
          description="League of Legends is a multiplayer online battle arena (MOBA) game where two teams of 5 players compete. Each player controls a unique champion - a character with distinct abilities, strengths, and weaknesses. There are 160+ champions, each with their own lore, abilities, and gameplay role. This application demonstrates REST (REpresentational State Transfer) and API (Application Programming Interface) fundamentals using real Riot Games data."
        >
          Rift Rewind: REST API fundamentals with Riot Games Developer Portal
        </Header>
      )}
      
      {currentPage === 'overview' && (
        <Alert
          statusIconAriaLabel="Info"
          header="🚀 Live REST API Integration"
        >
          Cloudscape Design System → AWS Lambda → Riot Data Dragon API | Demonstrating REST principles with real League of Legends champion data
        </Alert>
      )}
      
      {renderCurrentPage()}
    </SpaceBetween>
  );
};

export default RiftRewindDashboard;
      
