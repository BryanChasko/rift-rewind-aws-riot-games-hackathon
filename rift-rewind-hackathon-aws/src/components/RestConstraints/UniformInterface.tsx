
import { Container, Alert, ColumnLayout, Box, Select, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import type { Contest } from '../../services/types';

interface UniformInterfaceState {
  contests: Contest[];
}

export class UniformInterface extends RestConstraintBase {
  protected constraintNumber = 1;
  protected title = "Uniform Interface in Practice";
  protected description = "Experience consistent HTTP methods and JSON structure across all endpoints. See how one pattern works for all data types in the Riot Games API.";
  protected section = 'contests' as const;

  state: UniformInterfaceState = {
    contests: []
  };

  private async fetchContests() {
    try {
      const contests = await this.props.apiService.fetchContests(this.props.selectedYear.value);
      this.setState({ contests });
      this.props.stateManager.setDataMode(this.section, 'live');
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      this.setState({ 
        contests: [
          {id: 'worlds2024', name: 'Worlds Championship 2024', status: 'completed', winner: 'T1'},
          {id: 'msi2024', name: 'Mid-Season Invitational 2024', status: 'completed', winner: 'Gen.G'}
        ]
      });
      this.props.stateManager.setDataMode(this.section, 'demo');
    }
  }

  private loadTestData() {
    this.setState({ 
      contests: [
        {id: 'worlds2024', name: 'Worlds Championship 2024', status: 'completed', winner: 'T1'},
        {id: 'msi2024', name: 'Mid-Season Invitational 2024', status: 'completed', winner: 'Gen.G'}
      ]
    });
    this.props.stateManager.setDataMode(this.section, 'demo');
  }

  renderContent(): React.JSX.Element {
    const contestColumns: TableColumn<Contest>[] = [
      { id: 'name', header: 'Challenge Contest', cell: (item) => item.name },
      { id: 'status', header: 'Status', cell: (item) => item.status },
      { id: 'winner', header: 'Winner', cell: (item) => item.winner }
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
              Watch uniform interface constraints: Resource ID (<code>/challenges/config</code>), JSON representation, self-descriptive HTTP responses, and navigation links working together. Challenges API data transformed to contest format.
            </Alert>
            
            <ColumnLayout columns={2} variant="text-grid">
              <SpaceBetween direction="vertical" size="xs">
                <Box variant="strong">Select Year:</Box>
                <Select
                  selectedOption={this.props.selectedYear}
                  onChange={() => {}} // Handled by parent
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
                <Box variant="code">{import.meta.env.VITE_API_URL}?endpoint=contests&year={this.props.selectedYear.value}</Box>
                <Box variant="small" color="text-body-secondary">→ Challenges Config API transformed to contest format</Box>
                <Box variant="strong">📡 HTTP Method:</Box>
                <Box>GET</Box>
                <Box variant="strong">🔑 Auth:</Box>
                <Box>X-Riot-Token header required</Box>
              </SpaceBetween>
            </ColumnLayout>
            
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                {this.renderApiButton(
                  () => this.fetchContests(),
                  '🚀 Send GET Request',
                  'API Called - See Below!',
                  this.props.stateManager.getDataMode(this.section) === 'live'
                )}
              </div>
              <div>
                <button 
                  style={{
                    padding: '12px 24px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    background: '#0073bb', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    width: '100%'
                  }}
                  onClick={() => this.loadTestData()}
                >
                  📊 Send Test Data
                </button>
              </div>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {(this.state.contests.length > 0 || this.props.stateManager.getDataMode(this.section) === 'live' || this.props.stateManager.getDataMode(this.section) === 'demo') && (
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
                items={this.state.contests.length > 0 ? this.state.contests : [
                  {id: 'worlds2024', name: 'Worlds Championship 2024', status: 'completed', winner: 'T1'},
                  {id: 'msi2024', name: 'Mid-Season Invitational 2024', status: 'completed', winner: 'Gen.G'}
                ]}
                columns={contestColumns}
                header="🏆 Challenge Contest Data (Uniform Interface Applied)"
                description={this.props.stateManager.getDataMode(this.section) === 'live' ? 
                  this.state.contests.length > 0 ? 
                    `Live data from Riot Games Challenges API transformed to contest format for ${this.props.selectedYear.value}. Shows 3 randomly selected challenges from 400+ available. Demonstrates uniform HTTP methods (GET), consistent JSON structure, and real API integration.` :
                    `API called successfully for ${this.props.selectedYear.value} but no challenges available. Using fallback data to demonstrate uniform JSON structure.` :
                  `Test data demonstrating uniform JSON representation with consistent structure for ${this.props.selectedYear.value} challenge contests.`}
                emptyMessage="No contests available"
              />
            </Container>
            
            {this.renderNextStep(
              'client-server',
              'Client-Server Architecture',
              `Ready to see how the ${this.props.selectedYear.value} challenge winners demonstrate client-server separation?`
            )}
          </>
        )}
      </>
    );
  }
}