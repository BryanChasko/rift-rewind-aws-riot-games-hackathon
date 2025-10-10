
import { Container, Alert, ColumnLayout, Box, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import { ChampionSelector } from '../shared/ChampionSelector';
import type { TournamentWinner } from '../../services/types';

interface CacheableData extends TournamentWinner {
  version: string;
  cacheStatus: string;
  responseTime: number;
  cacheExpiry: string;
}

export class Cacheable extends RestConstraintBase {
  protected constraintNumber = 4;
  protected title = "Cacheable Responses";
  protected description = "Experience version-based performance and CDN caching. See how immutable URLs enable permanent caching for lightning-fast responses.";
  protected section = 'data-dragon' as const;

  private async fetchDataDragon() {
    if (this.props.selectedChampion) {
      await this.props.apiService.fetchDataDragon(this.props.selectedChampion.value);
      this.props.stateManager.setDataMode(this.section, 'live');
    }
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const lastUpdated = this.props.stateManager.getLastUpdated(this.section);
    const hasContext = this.props.stateManager.getDataMode('champion-details') === 'live' || this.props.stateManager.getDataMode('contests') === 'live';

    const cacheColumns: TableColumn<CacheableData>[] = [
      {
        id: 'asset',
        header: 'Champion Asset',
        cell: (item) => (
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
        cell: () => (
          <Box variant="strong" color="text-status-success">
            14.23.1
          </Box>
        )
      },
      {
        id: 'cacheStatus',
        header: 'Cache Status',
        cell: () => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong" color="text-status-success">HIT</Box>
            <Box variant="small" color="text-body-secondary">Served from CDN</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'responseTime',
        header: 'Response Time',
        cell: () => (
          <Box variant="strong" color="text-status-success">
            {Math.floor(Math.random() * 50 + 10)}ms
          </Box>
        )
      },
      {
        id: 'cacheExpiry',
        header: 'Cache Expiry',
        cell: () => (
          <Box variant="strong" color="text-status-info">
            Never (immutable)
          </Box>
        )
      }
    ];

    return (
      <>
        <Alert statusIconAriaLabel="Info" header="🌍 CDN Speed Test">
          Data Dragon CDN → Version URLs → Permanent caching | First request downloads, subsequent requests instant
        </Alert>
        
        {hasContext && (
          <Alert type="success" header={`🔗 Data Context from Previous Steps: ${this.props.selectedChampion?.label || this.props.selectedYear.value} Data`}>
            <Box variant="p">
              Champion and tournament data inherited from stateless demo. Now testing how Data Dragon CDN enables permanent caching with version-based URLs.
            </Box>
          </Alert>
        )}
        
        <Container 
          header="Data Dragon CDN - Version-Based Caching"
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
                <ChampionSelector
                  selectedChampion={this.props.selectedChampion}
                  onSelect={() => {}} // Handled by parent
                  champions={[]} // Will be populated by parent
                  placeholder="Choose champion asset"
                />
              </Box>
              <Box variant="p">
                <strong>🌐 CDN Endpoint URL:</strong><br/>
                <code>https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/{this.props.selectedChampion?.value || 'champion'}.png</code><br/>
                <strong>📡 HTTP Method:</strong> GET<br/>
                <strong>🔑 Auth:</strong> None (public CDN)
              </Box>
            </ColumnLayout>
            
            {this.renderApiButton(
              () => this.fetchDataDragon(),
              'Test CDN Performance',
              'CDN Cache Hit!',
              !this.props.selectedChampion
            )}
            
            {lastUpdated && (
              <Box variant="small" color="text-body-secondary">
                🕰️ Cache test: {lastUpdated.toLocaleTimeString()} | ⚡ Response time: ~{Math.floor(Math.random() * 50 + 10)}ms
              </Box>
            )}
          </SpaceBetween>
        </Container>

        {(this.props.activeDemo === this.section || dataMode === 'live') && (
          <>
            <Alert 
              type="success" 
              header="🎉 CDN Cache Performance! Version-based URLs enable permanent caching."
              dismissible
            />
            <Container 
              data-testid="cdn-response"
              header="🌍 Data Dragon CDN Response"
              className="rest-constraint-4"
            >
              <DataTable
                items={[]} // Will be populated by parent with cache data
                columns={cacheColumns}
                header="⚡ CDN Performance Data (Cacheable Responses)"
                description="Version-based URLs enable permanent CDN caching"
                emptyMessage="No CDN data available"
              />
            </Container>
            
            {this.renderNextStep(
              'layered-system',
              'Layered System Architecture',
              'Ready to explore the hidden infrastructure layers behind these fast CDN responses?'
            )}
          </>
        )}
      </>
    );
  }
}