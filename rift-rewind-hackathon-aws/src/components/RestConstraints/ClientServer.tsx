
import { Container, Alert, ColumnLayout, Box, Select, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';

import type { TournamentWinner } from '../../services/types';

export class ClientServer extends RestConstraintBase {
  protected constraintNumber = 2;
  protected title = "Client-Server Architecture";
  protected description = "Explore separation of concerns between frontend and backend. Watch how UI and data storage evolve independently through stable contracts.";
  protected section = 'champions' as const;

  private async fetchSummoners() {
    await this.props.apiService.fetchSummoners(this.props.selectedYear.value);
    this.props.stateManager.setDataMode(this.section, 'live');
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const winners = this.props.stateManager.getDataMode('contests') === 'live' || dataMode === 'live';

    const summonerColumns: TableColumn<TournamentWinner>[] = [
      {
        id: 'player',
        header: 'Summoner',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong">{item.player}</Box>
            <Box variant="small">{item.team}</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'champion',
        header: 'Signature Champion',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong">{item.championPlayed}</Box>
            <Box variant="small" color="text-body-secondary">Character played</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'tournamentRecord',
        header: 'Tournament Record',
        cell: (item) => (
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
        cell: (item) => (
          <Box variant="strong" color={item.performanceScore >= 95 ? "text-status-success" : item.performanceScore >= 90 ? "text-status-warning" : "text-status-info"}>
            {item.performanceScore}/100
          </Box>
        )
      },
      {
        id: 'achievement',
        header: 'Achievement',
        cell: (item) => (
          <Box>
            🏆 <Box variant="strong" display="inline">{item.event}</Box>
          </Box>
        )
      }
    ];

    return (
      <>
        <Alert statusIconAriaLabel="Info" header="🏗️ Architecture in Action">
          React Frontend ↔ AWS Lambda ↔ Riot API | Independent development, stable contracts
        </Alert>
        
        {this.props.stateManager.getDataMode('contests') === 'live' && (
          <Alert type="success" header={`🔗 Data Context from Step 1: ${this.props.selectedYear.value} Tournament`}>
            <Box variant="p">
              Year selection automatically carried forward from Uniform Interface demo. This shows how client-server architecture maintains state across different API endpoints.
            </Box>
          </Alert>
        )}
        
        <Container 
          header="Summoner Signature Champions"
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
                <code>https://americas.api.riotgames.com/lol/tournament/v5/summoners?year={this.props.selectedYear.value}</code><br/>
                <strong>📡 HTTP Method:</strong> GET<br/>
                <strong>🔑 Auth:</strong> X-Riot-Token header required
              </Box>
            </ColumnLayout>
            
            {this.renderApiButton(
              () => this.fetchSummoners(),
              'Fetch Championship Summoners',
              'Live Summoner Data Loaded',
              false
            )}
          </SpaceBetween>
        </Container>

        {winners && (
          <>
            <Alert 
              type="success" 
              header="🎉 Client-Server Separation! Frontend and backend evolved independently."
              dismissible
            />
            <Container 
              data-testid="summoners-response"
              header="🏆 Championship Summoners Response"
              className="rest-constraint-2"
            >
              <DataTable
                items={[]} // Will be populated by parent with actual data
                columns={summonerColumns}
                header="Worlds Greatest Winning Summoners"
                description={`Worlds ${this.props.selectedYear.value} championship summoners and their signature champions. Select a row to view more about the champion as we explore stateless communication.`}
                counter="(5)"
                emptyMessage="Click 'Fetch Championship Summoners' to load data"
              />
            </Container>
            
            {this.renderNextStep(
              'stateless',
              'Stateless Communication',
              this.props.selectedChampion ? 
                `Ready to explore ${this.props.selectedChampion.label} mastery data with self-contained authentication?` :
                'Select a champion above, then explore how each API request contains complete authentication context.'
            )}
          </>
        )}
      </>
    );
  }
}