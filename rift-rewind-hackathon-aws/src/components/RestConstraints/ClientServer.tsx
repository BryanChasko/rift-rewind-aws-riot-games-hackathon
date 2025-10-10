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
    errorDetails: undefined
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

  private async getTopSummoners(): Promise<TournamentWinner[]> {
    const response = await fetch(`${RIOT_API_PROXY_URL}?endpoint=challenger-league`);
    
    if (response.status === 403 || response.status === 401) {
      const responseText = await response.text().catch(() => '');
      const error = new Error('API key expired or invalid') as any;
      error.response = { 
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseText
      };
      throw error;
    }
    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      const error = new Error(`API error: ${response.status}`) as any;
      error.response = { 
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseText
      };
      throw error;
    }
    
    const result = await response.json();
    
    // Handle error responses from Lambda
    if (result.statusCode >= 400) {
      const error = new Error(`Lambda error: ${result.statusCode}`) as any;
      error.response = {
        status: result.statusCode,
        headers: result.headers || {},
        data: result.body
      };
      throw error;
    }
    
    const data = JSON.parse(result.body);
    
    // Store X-Ray trace ID and API attempt information
    if (data.xray_trace_id) {
      this.setState({ xrayTraceId: data.xray_trace_id });
    }
    
    // Check if any API attempts failed
    const failedAttempts = data.api_attempts?.filter((attempt: any) => 
      attempt.status === 'Failed' || attempt.status === 'No Data'
    ) || [];
    
    if (failedAttempts.length > 0) {
      this.setState({ 
        error: 'api-partial',
        errorDetails: { api_attempts: data.api_attempts }
      });
    }
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.slice(0, 5).map((entry: any, index: number) => ({
        player: entry.summonerName || `Player ${index + 1}`,
        team: 'Challenger',
        championPlayed: ['Azir', 'Aatrox', 'Jinx', 'Thresh', 'Graves'][index],
        tournamentWins: entry.wins || 0,
        tournamentLosses: entry.losses || 0,
        winRate: entry.wins && entry.losses ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100) : 0,
        performanceScore: entry.leaguePoints ? Math.min(100, Math.round(entry.leaguePoints / 10)) : 0,
        event: 'Challenger League'
      }));
    }
    return [];
  }

  private getDefaultSummoners(): TournamentWinner[] {
    return [
      { player: 'Loading...', team: 'Challenger', championPlayed: 'Azir', tournamentWins: 0, tournamentLosses: 0, winRate: 0, performanceScore: 0, event: 'Demo Data' }
    ];
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const winners = true; // Always show table like in original

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
                Lambda executed successfully but some Riot APIs are unavailable. Using fallback demo data.
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
                  onChange={({ detail }) => {
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
              'Fetch Top Summoners',
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
              <SpaceBetween direction="vertical" size="m">
                <DataTable
                  items={this.state.summoners.length > 0 ? this.state.summoners : this.getDefaultSummoners()}
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