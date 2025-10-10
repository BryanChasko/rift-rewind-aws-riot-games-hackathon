
import { Container, Alert, ColumnLayout, Box, Select, SpaceBetween, Button, StatusIndicator, Header } from '@cloudscape-design/components';
import CodeView from '@cloudscape-design/code-view/code-view';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import type { Contest } from '../../services/types';

interface UniformInterfaceState {
  contests: Contest[];
  loading: boolean;
  selectedContest: Contest | null;
}

export class UniformInterface extends RestConstraintBase {
  protected constraintNumber = 1;
  protected title = "Uniform Interface in Practice";
  protected description = "Experience consistent HTTP methods and JSON structure across all endpoints. See how one pattern works for all data types in the Riot Games API.";
  protected section = 'contests' as const;

  state: UniformInterfaceState = {
    contests: [],
    loading: false,
    selectedContest: null
  };

  private async fetchContests() {
    this.setState({ loading: true });
    try {
      // Direct API call since we don't have apiService prop in this architecture
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}?endpoint=contests&year=${this.props.selectedYear.value}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const contests = data.data || [];
      
      this.setState({ contests, loading: false });
      this.props.stateManager.setDataMode(this.section, 'live');
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      // Use fallback data on error
      this.loadTestData();
      this.setState({ loading: false });
    }
  }

  private loadTestData() {
    const year = this.props.selectedYear.value;
    const contestsByYear = {
      '2024': [
        {id: 'pentakill2024', name: 'PENTAKIIIIIIIIL!! Championship', status: 'live', winner: '#1 Player (15,847 points)', points: 15847, participants: 2847291, difficulty: 'Legendary', category: 'Combat', year: '2024'},
        {id: 'damage2024', name: 'Damage Dispenser Championship', status: 'live', winner: '#1 Player (12,394 points)', points: 12394, participants: 1923847, difficulty: 'Master', category: 'Combat', year: '2024'},
        {id: 'tactics2024', name: 'Plant Tactics Championship', status: 'live', winner: '#1 Player (8,921 points)', points: 8921, participants: 1456782, difficulty: 'Expert', category: 'Strategy', year: '2024'}
      ],
      '2023': [
        {id: 'pentakill2023', name: 'PENTAKIIIIIIIIL!! Championship', status: 'completed', winner: '#1 Player (14,203 points)', points: 14203, participants: 2634829, difficulty: 'Legendary', category: 'Combat', year: '2023'},
        {id: 'damage2023', name: 'Damage Dispenser Championship', status: 'completed', winner: '#1 Player (11,756 points)', points: 11756, participants: 1847392, difficulty: 'Master', category: 'Combat', year: '2023'},
        {id: 'tactics2023', name: 'Plant Tactics Championship', status: 'completed', winner: '#1 Player (7,834 points)', points: 7834, participants: 1293847, difficulty: 'Expert', category: 'Strategy', year: '2023'}
      ],
      '2022': [
        {id: 'pentakill2022', name: 'PENTAKIIIIIIIIL!! Championship', status: 'completed', winner: '#1 Player (13,492 points)', points: 13492, participants: 2456738, difficulty: 'Legendary', category: 'Combat', year: '2022'},
        {id: 'damage2022', name: 'Damage Dispenser Championship', status: 'completed', winner: '#1 Player (10,847 points)', points: 10847, participants: 1738294, difficulty: 'Master', category: 'Combat', year: '2022'},
        {id: 'tactics2022', name: 'Plant Tactics Championship', status: 'completed', winner: '#1 Player (6,923 points)', points: 6923, participants: 1184729, difficulty: 'Expert', category: 'Strategy', year: '2022'}
      ],
      '2021': [
        {id: 'pentakill2021', name: 'PENTAKIIIIIIIIL!! Championship', status: 'completed', winner: '#1 Player (12,847 points)', points: 12847, participants: 2293847, difficulty: 'Legendary', category: 'Combat', year: '2021'},
        {id: 'damage2021', name: 'Damage Dispenser Championship', status: 'completed', winner: '#1 Player (9,734 points)', points: 9734, participants: 1629384, difficulty: 'Master', category: 'Combat', year: '2021'},
        {id: 'tactics2021', name: 'Plant Tactics Championship', status: 'completed', winner: '#1 Player (5,847 points)', points: 5847, participants: 1047293, difficulty: 'Expert', category: 'Strategy', year: '2021'}
      ]
    };
    
    this.setState({ 
      contests: contestsByYear[year as keyof typeof contestsByYear] || contestsByYear['2024']
    });
    this.props.stateManager.setDataMode(this.section, 'demo');
  }

  private getSelectedWinner(): string {
    if (this.state.selectedContest) {
      const winner = this.state.selectedContest.winner || 'Unknown Player';
      // Extract player name from format like "PlayerName (15,847 points)" or "Player #1 (points)"
      const nameMatch = winner.match(/^([^(]+)\s*\(/);
      if (nameMatch) {
        const playerName = nameMatch[1].trim();
        return playerName.startsWith('Player #') ? `${playerName}` : `${playerName}`;
      }
      return winner;
    }
    return this.state.contests.length > 0 ? 'a challenge winner' : 'Challenge Winner';
  }

  renderContent(): React.JSX.Element {
    try {
      const contestColumns: TableColumn<Contest>[] = [
        { id: 'name', header: 'Challenge Contest', cell: (item) => item.name },
        { id: 'difficulty', header: 'Difficulty', cell: (item) => item.difficulty },
        { id: 'participants', header: 'Participants', cell: (item) => item.participants?.toLocaleString() || 'N/A' },
        { id: 'points', header: 'Top Score', cell: (item) => item.points?.toLocaleString() || 'N/A' },
        { id: 'category', header: 'Category', cell: (item) => item.category },
        { id: 'status', header: 'Status', cell: (item) => item.status }
      ];

      return (
      <>
        <Alert statusIconAriaLabel="Info" header="🎯 Challenges API Demo">
          Consistent patterns → Standard HTTP methods → Uniform JSON responses | One interface, all data types
        </Alert>
        
        <Container 
          header="Hands-On: Contests Endpoint Analysis"
          className="rest-constraint-1"
        >
          <SpaceBetween direction="vertical" size="s">
            <Alert type="info" header="🏆 Uniform Interface Constraints in Practice">
              Watch uniform interface constraints: Resource ID, JSON representation, self-descriptive HTTP responses, and navigation links working together. Challenges API data transformed to contest format.
            </Alert>
            <Alert type="info" header="Resource Endpoint">
              <CodeView content="/lol/challenges/v1/challenges/config" />
            </Alert>
            
            <ColumnLayout columns={2} variant="text-grid">
              <SpaceBetween direction="vertical" size="xs">
                <Box variant="strong">Select Year:</Box>
                <Select
                  selectedOption={this.props.selectedYear}
                  onChange={({ detail }) => {
                    // Reset state when year changes
                    this.setState({ contests: [] });
                    this.props.stateManager.setDataMode(this.section, 'demo');
                    // Let parent handle year change
                    if (this.props.onYearChange) {
                      this.props.onYearChange(detail.selectedOption as { label: string; value: string });
                    }
                  }}
                  options={[
                    { label: '2024', value: '2024' },
                    { label: '2023', value: '2023' },
                    { label: '2022', value: '2022' },
                    { label: '2021', value: '2021' }
                  ]}
                />
              </SpaceBetween>
              <SpaceBetween direction="vertical" size="xs">
                <Box variant="strong">🌐 Full Endpoint URL:</Box>
                <CodeView content={`${import.meta.env.VITE_API_URL}?endpoint=contests&year=${this.props.selectedYear.value}`} />
                <Box variant="small" color="text-body-secondary">→ Challenges Config API transformed to contest format</Box>
                <Box variant="strong">📡 HTTP Method:</Box>
                <Box><StatusIndicator type="success">GET</StatusIndicator></Box>
                <Box variant="strong">🔑 Auth Header:</Box>
                <CodeView content="X-Riot-Token: RGAPI-your-key-here" />
                <Box variant="small" color="text-body-secondary">🔒 Stored securely in AWS SSM Parameter Store</Box>
              </SpaceBetween>
            </ColumnLayout>
            
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Button
                  variant="primary"
                  onClick={() => this.fetchContests()}
                  loading={this.state.loading}
                  loadingText="Fetching contest data"
                  ariaLabel="Fetch contest data from Riot Games API"
                  fullWidth
                >
                  {this.props.stateManager.getDataMode(this.section) === 'live' ? '✅ Live Data Loaded' : '🚀 Send GET Request'}
                </Button>
              </div>
              <div>
                <Button
                  variant="normal"
                  onClick={() => this.loadTestData()}
                  ariaLabel="Load test data for demonstration"
                  fullWidth
                >
                  📊 Send Test Data
                </Button>
              </div>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {this.state.contests.length > 0 && (
          <>
            <Alert 
              type={this.props.stateManager.getDataMode(this.section) === 'live' ? 'success' : 'info'} 
              header={this.props.stateManager.getDataMode(this.section) === 'live' ? 
                '🎉 Live API Data! Challenge data transformed to contest format.' :
                '📊 Test Data Loaded! Demonstrating uniform JSON structure.'}
              dismissible
            />
            <Container 
              data-testid="contests-response"
              header="🏆 Contests Response Analysis"
              className="rest-constraint-1"
            >
              <DataTable
                items={this.state.contests}
                columns={contestColumns}
                header="🏆 Challenge Contest Data (Uniform Interface Applied)"
                description={this.props.stateManager.getDataMode(this.section) === 'live' ? 
                  this.state.contests.length > 0 ? 
                    `Live data from Riot Games Challenges API transformed to contest format for ${this.props.selectedYear.value}. Shows ${this.state.contests.length} highest-scoring challenges from 400+ available. Select a contest winner to explore in the next step.` :
                    `API called successfully for ${this.props.selectedYear.value} but no challenges available. Using fallback data to demonstrate uniform JSON structure.` :
                  `Test data demonstrating uniform JSON representation with consistent structure for ${this.props.selectedYear.value} challenge contests. Select a contest winner to continue.`}
                emptyMessage="No contests available"
                selectionType="single"
                selectedItems={this.state.selectedContest ? [this.state.selectedContest] : []}
                onSelectionChange={(event: any) => {
                  this.setState({ 
                    selectedContest: event.detail.selectedItems.length > 0 ? event.detail.selectedItems[0] as Contest : null 
                  });
                }}
                trackBy="id"
              />
            </Container>
            
            <Container variant="stacked">
              <Header variant="h3">🚀 Next Step: Client-Server Architecture</Header>
              <SpaceBetween direction="vertical" size="s">
                <Box variant="p">
                  {this.state.selectedContest ? 
                    `Ready to see how ${this.getSelectedWinner()} demonstrates client-server separation?` :
                    'Select a contest winner above, then explore client-server architecture with their data.'
                  }
                </Box>
                <Button 
                  variant="primary" 
                  onClick={() => this.props.onNavigate('client-server')}
                  disabled={!this.state.selectedContest}
                >
                  ➡️ Continue to Client-Server Architecture
                </Button>
              </SpaceBetween>
            </Container>
          </>
        )}
      </>
      );
    } catch (error) {
      console.error('Render error in UniformInterface:', error);
      return (
        <Alert
          type="error"
          header="Component Error"
          action={
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          }
        >
          An error occurred while rendering the Uniform Interface demo. Please reload the page to continue.
        </Alert>
      );
    }
  }
}