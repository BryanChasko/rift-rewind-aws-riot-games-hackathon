
import { Container, Alert, ColumnLayout, Box, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import { ChampionSelector } from '../shared/ChampionSelector';
import type { TournamentWinner } from '../../services/types';

export class Stateless extends RestConstraintBase {
  protected constraintNumber = 3;
  protected title = "Stateless Communication";
  protected description = "Test self-contained requests with complete authentication. Every API call includes all necessary context - no server memory required.";
  protected section = 'champion-details' as const;

  private async fetchChampionMastery() {
    if (this.props.selectedChampion) {
      await this.props.apiService.fetchChampionMastery(this.props.selectedChampion.value);
      this.props.stateManager.setDataMode(this.section, 'live');
    }
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const hasContext = this.props.stateManager.getDataMode('contests') === 'live' || this.props.stateManager.getDataMode('champions') === 'live';

    const masteryColumns: TableColumn<TournamentWinner>[] = [
      {
        id: 'champion',
        header: 'Champion',
        cell: (item) => (
          <Box>
            <Box variant="strong">{item.championPlayed}</Box>
            <Box variant="small" color="text-body-secondary">Mastery data</Box>
          </Box>
        )
      },
      {
        id: 'masteryLevel',
        header: 'Mastery Level',
        cell: (item) => (
          <Box variant="strong" color="text-status-success">
            Level {Math.min(7, Math.floor(item.performanceScore / 15))}
          </Box>
        )
      },
      {
        id: 'masteryPoints',
        header: 'Mastery Points',
        cell: (item) => (
          <Box variant="strong">
            {(item.performanceScore * 1000).toLocaleString()}
          </Box>
        )
      },
      {
        id: 'lastPlayed',
        header: 'Last Played',
        cell: () => (
          <Box variant="small" color="text-body-secondary">
            {new Date().toLocaleDateString()}
          </Box>
        )
      }
    ];

    return (
      <>
        <Alert statusIconAriaLabel="Info" header="🔑 Authentication Flow">
          X-Riot-Token header → Self-contained requests → No session memory | Complete context every time
        </Alert>
        
        {hasContext && (
          <Alert type="success" header={`🔗 Data Context from Previous Steps: ${this.props.selectedYear.value} Tournament`}>
            <Box variant="p">
              Champion data inherited from client-server demo. Each new API call will include complete authentication context - no server session memory.
            </Box>
          </Alert>
        )}
        
        <Container 
          header="Champion Mastery Endpoint - Self-Contained Authentication"
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
                <ChampionSelector
                  selectedChampion={this.props.selectedChampion}
                  onSelect={() => {}} // Handled by parent
                  champions={[]} // Will be populated by parent
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
            
            {this.renderApiButton(
              () => this.fetchChampionMastery(),
              'Send Self-Contained Request',
              'Stateless Request Sent',
              !this.props.selectedChampion
            )}
          </SpaceBetween>
        </Container>

        {(this.props.activeDemo === this.section || dataMode === 'live') && (
          <>
            <Alert 
              type="success" 
              header="🎉 Stateless Request Complete! No server session required."
              dismissible
            />
            <Container 
              data-testid="mastery-response"
              header="🏆 Champion Mastery Response"
              className="rest-constraint-3"
            >
              <DataTable
                items={[]} // Will be populated by parent with filtered data
                columns={masteryColumns}
                header="🎮 Champion Mastery Data (Stateless Authentication)"
                description="Each API call included complete authentication context"
                emptyMessage="No mastery data available"
              />
            </Container>
            
            {this.renderNextStep(
              'cacheable',
              'Cacheable Responses',
              'Ready to see how Data Dragon CDN enables permanent caching with version URLs?'
            )}
          </>
        )}
      </>
    );
  }
}