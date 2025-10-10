
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
    const contests = await this.props.apiService.fetchContests(this.props.selectedYear.value);
    this.setState({ contests });
    this.props.stateManager.setDataMode(this.section, 'live');
  }

  renderContent(): React.JSX.Element {
    const contestColumns: TableColumn<Contest>[] = [
      { id: 'name', header: 'Tournament', cell: (item) => item.name },
      { id: 'status', header: 'Status', cell: (item) => item.status },
      { id: 'winner', header: 'Winner', cell: (item) => item.winner }
    ];

    return (
      <>
        <Alert statusIconAriaLabel="Info" header="🎯 Tournament API Demo">
          Consistent patterns → Standard HTTP methods → Uniform JSON responses | One interface, all data types
        </Alert>
        
        <Container 
          header="Hands-On: Contests Endpoint Analysis"
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
                  selectedOption={this.props.selectedYear}
                  onChange={() => {}} // Handled by parent
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
                <code>https://americas.api.riotgames.com/lol/tournament/v5/tournaments?year={this.props.selectedYear.value}</code><br/>
                <strong>📡 HTTP Method:</strong> GET<br/>
                <strong>🔑 Auth:</strong> X-Riot-Token header required
              </Box>
            </ColumnLayout>
            
            {this.renderApiButton(
              () => this.fetchContests(),
              'Send GET Request',
              'Live Data Loaded - See Below!',
              false
            )}
          </SpaceBetween>
        </Container>

        {(this.props.stateManager.getDataMode(this.section) === 'live' || this.state.contests.length > 0) && (
          <>
            <Alert 
              type="success" 
              header="🎉 API Response Received! Fresh tournament data loaded below."
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
                header="🏆 Tournament Data (Uniform Interface Applied)"
                description="Uniform JSON representation with consistent structure"
                emptyMessage="No contests available"
              />
            </Container>
            
            {this.renderNextStep(
              'client-server',
              'Client-Server Architecture',
              `Ready to see how the ${this.props.selectedYear.value} championship summoners demonstrate client-server separation?`
            )}
          </>
        )}
      </>
    );
  }
}