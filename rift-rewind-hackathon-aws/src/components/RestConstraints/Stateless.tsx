import React from 'react';
import { Container, Alert, ColumnLayout, Box, SpaceBetween, Select } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';

import { ALL_CHAMPIONS } from '../../data/champions';



interface StatelessState {
  championData: any;
}

export class Stateless extends RestConstraintBase {
  protected constraintNumber = 3;
  protected title = "Stateless Communication";
  protected description = "Test self-contained requests with complete authentication. Every API call includes all necessary context - no server memory required.";
  protected section = 'champion-details' as const;
  
  state: StatelessState = {
    championData: null
  };

  private async fetchChampionProficiency() {
    if (this.props.selectedChampion) {
      const championData = await this.getChampionData(this.props.selectedChampion.label);
      this.setState({ championData });
      await this.props.apiService.fetchChampionProficiency(this.props.selectedChampion.value);
      this.props.stateManager.setDataMode(this.section, 'live');
      this.forceUpdate();
    }
  }



  private async getChampionData(championName: string) {
    try {
      // Fetch from Data Dragon API
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/champion/${championName}.json`);
      const data = await response.json();
      const champion = data.data[championName];
      
      return {
        title: champion.title,
        role: champion.tags[0] || 'Fighter',
        difficulty: champion.info.difficulty,
        resource: champion.partype || 'Mana',
        attack: champion.info.attack,
        defense: champion.info.defense,
        magic: champion.info.magic,
        attackRange: champion.stats.attackrange > 200 ? `Ranged (${champion.stats.attackrange})` : `Melee (${champion.stats.attackrange})`,
        passive: champion.passive.name,
        championId: champion.key,
        releaseDate: new Date(champion.releaseDate || '2009-01-01').getFullYear().toString()
      };
    } catch (error) {
      console.error('Failed to fetch champion data:', error);
      return {
        title: 'the Champion',
        role: 'Fighter',
        difficulty: 5,
        resource: 'Mana',
        attack: 5,
        defense: 5,
        magic: 5,
        attackRange: 'Melee (125)',
        passive: 'Champion Passive',
        championId: 1,
        releaseDate: '2009'
      };
    }
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const hasContext = this.props.stateManager.getDataMode('contests') === 'live' || this.props.stateManager.getDataMode('champions') === 'live';

    const championColumns: TableColumn<any>[] = [
      {
        id: 'champion',
        header: 'Champion',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong">{item.name}</Box>
            <Box variant="small" color="text-body-secondary">{item.title}</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'role',
        header: 'Role & Resource',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong" color="text-status-info">{item.role}</Box>
            <Box variant="small" color="text-body-secondary">{item.resource}</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'stats',
        header: 'Combat Stats',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="small">Attack: {item.attack}/10</Box>
            <Box variant="small">Defense: {item.defense}/10</Box>
            <Box variant="small">Magic: {item.magic}/10</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'range',
        header: 'Range & Passive',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong">{item.attackRange}</Box>
            <Box variant="small" color="text-body-secondary">{item.passive}</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'meta',
        header: 'Champion Info',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="small">ID: {item.championId}</Box>
            <Box variant="small">Released: {item.releaseDate}</Box>
            <Box variant="small">Difficulty: {item.difficulty}/10</Box>
          </SpaceBetween>
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
          header="Champion Proficiency Endpoint - Self-Contained Authentication"
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
                  selectedOption={this.props.selectedChampion}
                  onChange={({ detail }) => {
                    const champion = detail.selectedOption as { label: string; value: string };
                    if (this.props.onChampionChange) {
                      this.props.onChampionChange(champion);
                    }
                  }}
                  options={ALL_CHAMPIONS.map(champion => ({
                    label: champion,
                    value: champion.toLowerCase()
                  }))}
                  placeholder="Type or select any champion..."
                  filteringType="auto"
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
              () => this.fetchChampionProficiency(),
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
              header="🎉 Stateless Request Complete! Each request was self-contained."
              dismissible
            >
              <Box variant="p">
                Champion data retrieved with complete authentication context in this single request. Our AWS Lambda function (acting as a proxy to Riot's API) didn't need to remember any previous interaction - all necessary information was included.
              </Box>
            </Alert>
            <Container 
              data-testid="proficiency-response"
              header="🏆 Champion Proficiency Response"
              className="rest-constraint-3"
            >
              <DataTable
                items={this.state.championData ? [{
                  name: this.props.selectedChampion?.label || '',
                  ...this.state.championData
                }] : []}
                columns={championColumns}
                header="🎮 Champion Information (Stateless Authentication)"
                description="Each API call included complete authentication context"
                emptyMessage="No champion data available"
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