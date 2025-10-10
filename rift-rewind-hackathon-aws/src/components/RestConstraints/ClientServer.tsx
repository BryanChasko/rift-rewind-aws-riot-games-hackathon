import React from 'react';
import { Container, Alert, ColumnLayout, Box, Select, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import type { TournamentWinner } from '../../services/types';
import { ALL_CHAMPIONS } from '../../data/champions';

const RIOT_API_PROXY_URL = import.meta.env.VITE_API_URL || '';

interface ClientServerState {
  selectedChampion: { label: string; value: string } | null;
  selectionSource: 'table' | 'dropdown' | null;
  summoners: TournamentWinner[];
  error: 'api-key' | 'network' | 'api-partial' | null;
  xrayTraceId?: string;
  errorDetails?: any;
  summonerLookup: {
    riotId: string;
    region: string;
    loading: boolean;
    result?: any;
    error?: string;
  };
}

export class ClientServer extends RestConstraintBase {
  protected constraintNumber = 2;
  protected title = "Client-Server Architecture";
  protected description = "Explore separation of concerns between frontend and backend. Watch how UI and data storage evolve independently through stable contracts.";
  protected section = 'champions' as const;

  state: ClientServerState = {
    selectedChampion: null,
    selectionSource: null,
    summoners: [],
    error: null,
    xrayTraceId: undefined,
    errorDetails: undefined,
    summonerLookup: {
      riotId: 'Doublelift#NA1',
      region: 'na1',
      loading: false
    }
  };

  private async fetchSummoners() {
    try {
      this.setState({ error: null, xrayTraceId: undefined, errorDetails: undefined });
      const summoners = await this.getTopSummoners();
      this.setState({ summoners });
      await this.props.apiService.fetchSummoners(this.props.selectedYear.value);
      this.props.stateManager.setDataMode(this.section, 'live');
    } catch (error: any) {
      console.error('Full error details:', error);
      const isApiKeyError = error.message?.includes('API key');
      
      // Extract X-Ray trace information if available
      let xrayTraceId: string | undefined;
      let errorDetails: any;
      
      if (error.response) {
        xrayTraceId = error.response.headers?.['x-trace-id'] || error.response.headers?.['X-Trace-Id'];
        try {
          const responseData = typeof error.response.data === 'string' ? 
            JSON.parse(error.response.data) : error.response.data;
          errorDetails = responseData.error;
          xrayTraceId = xrayTraceId || responseData.xray_trace_id;
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
      
      this.setState({ 
        error: isApiKeyError ? 'api-key' : 'network',
        summoners: this.getDefaultSummoners(),
        xrayTraceId,
        errorDetails
      });
      // Don't re-throw - let the error display show
    }
  }
  
  private async loadTestData() {
    this.setState({ 
      error: null, 
      xrayTraceId: undefined, 
      errorDetails: undefined,
      summoners: this.getLocalFallbackSummoners()
    });
    this.props.stateManager.setDataMode(this.section, 'demo');
  }
  
  private async lookupSummoner() {
    this.setState({
      summonerLookup: {
        ...this.state.summonerLookup,
        loading: true,
        result: undefined,
        error: undefined
      }
    });
    
    try {
      // This will be the summoner lookup Lambda URL - placeholder for now
      const SUMMONER_LOOKUP_URL = 'https://placeholder-summoner-lookup-url.lambda-url.us-east-2.on.aws/';
      
      const response = await fetch(SUMMONER_LOOKUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summonerName: this.state.summonerLookup.riotId,
          region: this.state.summonerLookup.region
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      this.setState({
        summonerLookup: {
          ...this.state.summonerLookup,
          loading: false,
          result: data
        }
      });
    } catch (error: any) {
      this.setState({
        summonerLookup: {
          ...this.state.summonerLookup,
          loading: false,
          error: error.message || 'Failed to lookup summoner'
        }
      });
    }
  }

  private async getTopSummoners(): Promise<TournamentWinner[]> {
    try {
      const response = await fetch(`${RIOT_API_PROXY_URL}?endpoint=challenger-league`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store X-Ray trace ID
      const xrayTraceId = response.headers.get('X-Trace-Id') || data.xray_trace_id;
      if (xrayTraceId) {
        this.setState({ xrayTraceId });
      }
      
      // Check if Lambda got real data
      const challengerAttempt = data.api_attempts?.find((attempt: any) => 
        attempt.endpoint === 'Challenger League API'
      );
      
      if (challengerAttempt?.status === 'Success' && data.data?.length > 0) {
        // Transform real challenger data to our format
        this.setState({ error: null });
        return data.data.map((player: any) => ({
          player: `Rank ${player.rank} (${player.leaguePoints} LP)`,
          team: `${player.veteran ? 'Veteran' : player.freshBlood ? 'Rising Star' : 'Challenger'}${player.hotStreak ? ' 🔥' : ''}`,
          championPlayed: player.signatureChampion,
          tournamentWins: player.wins,
          tournamentLosses: player.losses,
          winRate: player.winRate,
          performanceScore: Math.min(100, Math.round(player.leaguePoints / 25)), // Scale LP to 0-100
          event: 'Live Challenger League'
        }));
      } else {
        // API failed, show diagnostic info and use local fallback
        this.setState({ 
          error: 'api-partial',
          errorDetails: { api_attempts: data.api_attempts }
        });
        throw new Error('Riot API unavailable');
      }
    } catch (error) {
      // Use local fallback data
      return this.getLocalFallbackSummoners();
    }
  }
  
  private getLocalFallbackSummoners(): TournamentWinner[] {
    return [
      { player: 'Rank 1 (2040 LP)', team: 'Veteran 🔥', championPlayed: 'Azir', tournamentWins: 493, tournamentLosses: 362, winRate: 58, performanceScore: 82, event: 'Demo Challenger Data' },
      { player: 'Rank 2 (2007 LP)', team: 'Veteran', championPlayed: 'Aatrox', tournamentWins: 525, tournamentLosses: 430, winRate: 55, performanceScore: 80, event: 'Demo Challenger Data' },
      { player: 'Rank 3 (1680 LP)', team: 'Veteran', championPlayed: 'Jinx', tournamentWins: 366, tournamentLosses: 298, winRate: 55, performanceScore: 67, event: 'Demo Challenger Data' },
      { player: 'Rank 4 (1650 LP)', team: 'Veteran', championPlayed: 'Thresh', tournamentWins: 268, tournamentLosses: 168, winRate: 61, performanceScore: 66, event: 'Demo Challenger Data' },
      { player: 'Rank 5 (1639 LP)', team: 'Veteran', championPlayed: 'Graves', tournamentWins: 242, tournamentLosses: 149, winRate: 62, performanceScore: 66, event: 'Demo Challenger Data' }
    ];
  }

  private getDefaultSummoners(): TournamentWinner[] {
    return [
      { player: 'Loading...', team: 'Challenger', championPlayed: 'Azir', tournamentWins: 0, tournamentLosses: 0, winRate: 0, performanceScore: 0, event: 'Loading...' }
    ];
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const winners = this.state.summoners.length > 0 && this.state.summoners[0].player !== 'Loading...';

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
        
        {this.state.error === 'api-key' && (
          <Alert type="error" header="🔑 API Key Issue Detected">
            <Box variant="p">
              The Riot Games API key needs to be updated. Please contact <a href="https://linkedin.com/in/bryanchasko" target="_blank" rel="noopener noreferrer">Bryan Chasko on LinkedIn</a> or check the <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer">GitHub repository</a> for updates.
            </Box>
          </Alert>
        )}
        
        {this.state.error === 'network' && (
          <Alert type="warning" header="⚠️ API Communication Issue">
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                The Lambda API is not responding as expected. This could be due to API key expiration, Lambda function issues, or Riot API rate limits.
              </Box>
              
              {this.state.xrayTraceId && (
                <Box variant="p">
                  <strong>🔍 X-Ray Trace ID:</strong> <code>{this.state.xrayTraceId}</code><br/>
                  <a 
                    href={`https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/${this.state.xrayTraceId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📊 View detailed trace in AWS X-Ray Console
                  </a>
                </Box>
              )}
              
              {this.state.errorDetails && (
                <Box variant="p">
                  <strong>🛠️ Error Details:</strong><br/>
                  <code>Type: {this.state.errorDetails.error_type}</code><br/>
                  <code>Message: {this.state.errorDetails.error_message}</code><br/>
                  {this.state.errorDetails.lambda_request_id && (
                    <><code>Lambda Request ID: {this.state.errorDetails.lambda_request_id}</code><br/></>
                  )}
                </Box>
              )}
              
              <Box variant="p">
                Check the browser console for detailed error information. 
                <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer">🔗 View GitHub repo</a> for troubleshooting or contact <a href="https://linkedin.com/in/bryanchasko" target="_blank" rel="noopener noreferrer">Bryan Chasko</a>.
              </Box>
            </SpaceBetween>
          </Alert>
        )}
        
        {this.state.error === 'api-partial' && (
          <Alert type="info" header="📊 API Status with X-Ray Diagnostics">
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                Lambda executed successfully but Riot APIs are unavailable. Using local fallback data.
              </Box>
              
              {this.state.xrayTraceId && (
                <Box variant="p">
                  <strong>🔍 X-Ray Trace ID:</strong> <code>{this.state.xrayTraceId}</code><br/>
                  <a 
                    href={`https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/${this.state.xrayTraceId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📊 View detailed request flow in AWS X-Ray Console
                  </a>
                </Box>
              )}
              
              {this.state.errorDetails?.api_attempts && (
                <Box variant="p">
                  <strong>🛠️ API Attempt Details:</strong><br/>
                  {this.state.errorDetails.api_attempts.map((attempt: any, index: number) => (
                    <div key={index}>
                      <code>{attempt.endpoint}: {attempt.status} - {attempt.result}</code><br/>
                    </div>
                  ))}
                </Box>
              )}
            </SpaceBetween>
          </Alert>
        )}
        
        {this.props.stateManager.getDataMode('contests') === 'live' && (
          <Alert type="success" header={`🔗 Data Context from Step 1: ${this.props.selectedYear.value} Tournament`}>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="p">
                Year selection automatically carried forward from Uniform Interface demo. This shows how client-server architecture maintains state across different API endpoints.
              </Box>
              {this.state.xrayTraceId && (
                <Box variant="p">
                  <strong>🔍 X-Ray Trace:</strong> <code>{this.state.xrayTraceId}</code> - 
                  <a 
                    href={`https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/${this.state.xrayTraceId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View request flow
                  </a>
                </Box>
              )}
            </SpaceBetween>
          </Alert>
        )}
        
        <Container 
          header="Summoner Signature Champions"
          className="rest-constraint-2"
        >
          <SpaceBetween direction="vertical" size="s">
            <Alert type="info" header="🎮 API Architecture & Rate Limits">
              <SpaceBetween direction="vertical" size="s">
                <Box variant="p">
                  <strong>Rate Limits:</strong> Personal API Key (20/sec, 100/2min) • Production Keys (higher limits)<br/>
                  <strong>CORS:</strong> Lambda handles cross-origin requests with proper headers<br/>
                  <strong>Security:</strong> API keys stored in encrypted AWS SSM Parameter Store
                </Box>
                <Box variant="p">
                  <strong>Challenger League Data Fields:</strong><br/>
                  • <strong>puuid:</strong> Unique player ID • <strong>leaguePoints:</strong> Ranking score<br/>
                  • <strong>wins/losses:</strong> Match records • <strong>veteran/hotStreak/freshBlood:</strong> Player status
                </Box>
              </SpaceBetween>
            </Alert>
            
            <Box variant="p">
              <strong>🌐 Live Challenger League Endpoint:</strong><br/>
              <code>https://na1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5</code><br/>
              <strong>📡 HTTP Method:</strong> GET<br/>
              <strong>🔑 Auth:</strong> X-Riot-Token header required<br/>
              <strong>📊 Returns:</strong> Current top ~300 Challenger players with live ranking data
            </Box>
            
            <SpaceBetween direction="vertical" size="s">
              <SpaceBetween direction="horizontal" size="s">
                {this.renderApiButton(
                  () => this.fetchSummoners(),
                  'Fetch Top Summoners',
                  'Live Summoner Data Loaded',
                  this.props.stateManager.getDataMode(this.section) === 'live'
                )}
                {this.renderApiButton(
                  () => this.loadTestData(),
                  'Load Test Data',
                  'Test Data Loaded',
                  false
                )}
              </SpaceBetween>
              
              <Container header="🔍 Look Up Any Summoner">
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="p">Try a Riot ID like <strong>Doublelift#NA1</strong> or <strong>Faker#Hide</strong></Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <input 
                      type="text" 
                      placeholder="GameName#TAG" 
                      value={this.state.summonerLookup.riotId}
                      onChange={(e) => this.setState({
                        summonerLookup: {...this.state.summonerLookup, riotId: (e.target as HTMLInputElement).value}
                      })}
                      style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px'}}
                    />
                    <select 
                      value={this.state.summonerLookup.region}
                      onChange={(e) => this.setState({
                        summonerLookup: {...this.state.summonerLookup, region: (e.target as HTMLSelectElement).value}
                      })}
                      style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                    >
                      <option value="na1">North America</option>
                      <option value="euw1">Europe West</option>
                      <option value="kr">Korea</option>
                    </select>
                    <button 
                      style={{padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#0073bb', color: 'white', cursor: 'pointer'}}
                      onClick={() => this.lookupSummoner()}
                      disabled={this.state.summonerLookup.loading}
                    >
                      {this.state.summonerLookup.loading ? 'Looking up...' : 'Look Up'}
                    </button>
                  </SpaceBetween>
                  
                  {this.state.summonerLookup.result && (
                    <Alert type="success" header="🎮 Summoner Found">
                      <Box variant="p">
                        <strong>{this.state.summonerLookup.result.summoner.name}</strong> - Level {this.state.summonerLookup.result.summoner.level}<br/>
                        <strong>Top Champions:</strong> {this.state.summonerLookup.result.topChampions?.map((c: any) => `Champion ${c.championId} (${c.championPoints} pts)`).join(', ') || 'None'}
                      </Box>
                    </Alert>
                  )}
                  
                  {this.state.summonerLookup.error && (
                    <Alert type="error" header="⚠️ Lookup Failed">
                      <Box variant="p">{this.state.summonerLookup.error}</Box>
                    </Alert>
                  )}
                </SpaceBetween>
              </Container>
            </SpaceBetween>
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
              <SpaceBetween direction="vertical" size="m">
                <DataTable
                  items={this.state.summoners}
                  columns={summonerColumns}
                  header="Top Challenger Summoners"
                  description={`Top Challenger summoners and their signature champions. Select a row to view more about the champion as we explore stateless communication.`}
                  counter="(5)"
                  emptyMessage="Click 'Fetch Top Summoners' to load data"
                  selectionType="single"
                  selectedItems={this.state.selectedChampion && this.state.selectionSource === 'table' ? 
                    (this.state.summoners.length > 0 ? this.state.summoners : this.getDefaultSummoners()).filter(w => 
                      w.championPlayed.toLowerCase() === this.state.selectedChampion!.value
                    ) : []}
                  onSelectionChange={(items) => {
                    if (items.length > 0) {
                      const selectedWinner = items[0] as TournamentWinner;
                      const champion = { 
                        label: selectedWinner.championPlayed, 
                        value: selectedWinner.championPlayed.toLowerCase() 
                      };
                      this.setState({
                        selectedChampion: champion,
                        selectionSource: 'table'
                      });
                      // Propagate to parent
                      if (this.props.onChampionChange) {
                        this.props.onChampionChange(champion);
                      }
                    } else {
                      this.setState({
                        selectedChampion: null,
                        selectionSource: null
                      });
                      // Propagate to parent
                      if (this.props.onChampionChange) {
                        this.props.onChampionChange(null);
                      }
                    }
                  }}
                  trackBy="championPlayed"
                />
                
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="p">Or choose your favorite champion:</Box>
                  <Select
                    selectedOption={this.state.selectedChampion}
                    onChange={({ detail }) => {
                      const champion = detail.selectedOption as { label: string; value: string };
                      this.setState({
                        selectedChampion: champion,
                        selectionSource: 'dropdown'
                      });
                      // Propagate to parent
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
                </SpaceBetween>
              </SpaceBetween>
            </Container>
            
            {this.renderNextStep(
              'stateless',
              'Stateless Communication',
              this.state.selectedChampion ? 
                `Ready to explore ${this.state.selectedChampion.label} mastery data with self-contained authentication?` :
                'Select a champion above, then explore how each API request contains complete authentication context.'
            )}
          </>
        )}
      </>
    );
  }
}