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
    xrayTraceId?: string;
  };
  xrayTrace?: any;
  dataSourceStatus: {
    live: boolean | null;
    test: boolean | null;
    summoner: boolean | null;
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
    },
    xrayTrace: null,
    dataSourceStatus: {
      live: null, // null = not tried, true = success, false = failed
      test: null,
      summoner: null
    }
  };

  private async fetchSummoners() {
    try {
      this.setState({ error: null, xrayTraceId: undefined, errorDetails: undefined });
      const summoners = await this.getTopSummoners();
      this.setState({ 
        summoners,
        dataSourceStatus: { live: true, test: null, summoner: null }
      });
      // Year parameter passed from Uniform Interface step
      console.log(`Fetching summoners for year: ${this.props.selectedYear.value}`);
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
        errorDetails,
        dataSourceStatus: { live: false, test: null, summoner: null }
      });
      // Don't re-throw - let the error display show
    }
  }
  
  private async loadTestData() {
    try {
      this.setState({ 
        error: null, 
        xrayTraceId: undefined, 
        errorDetails: undefined,
        summoners: this.getLocalFallbackSummoners(),
        dataSourceStatus: { live: null, test: true, summoner: null }
      });
      this.props.stateManager.setDataMode(this.section, 'demo');
    } catch (error) {
      this.setState({
        dataSourceStatus: { live: null, test: false, summoner: null }
      });
    }
  }
  
  private async fetchXRayTrace(traceId: string) {
    // Skip X-Ray trace fetching for now - endpoint not implemented
    console.log('X-Ray trace fetch skipped for:', traceId);
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
      const SUMMONER_LOOKUP_URL = import.meta.env.VITE_SUMMONER_LOOKUP_URL || '';
      
      console.log('Summoner lookup URL:', SUMMONER_LOOKUP_URL);
      console.log('Making request with data:', {
        summonerName: this.state.summonerLookup.riotId,
        region: this.state.summonerLookup.region
      });
      
      if (!SUMMONER_LOOKUP_URL) {
        throw new Error('Summoner lookup service not configured - check VITE_SUMMONER_LOOKUP_URL');
      }
      
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
      
      // Get X-Ray trace ID from headers
      const xrayTraceId = response.headers.get('X-Trace-Id');
      
      let data;
      const responseText = await response.text();
      
      // Handle non-JSON responses (like "Internal Server Error")
      if (responseText.startsWith('{')) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
        }
      } else {
        // Lambda returned plain text error
        throw new Error(`Lambda error: ${responseText}`);
      }
      
      if (!response.ok) {
        const errorMsg = data?.error || `HTTP ${response.status}: ${responseText}`;
        const error = new Error(errorMsg);
        (error as any).xrayTraceId = xrayTraceId || data?.xray_trace_id;
        throw error;
      }
      
      // Convert summoner lookup result to table format
      const getChampionName = (championId: number) => {
        const championMap: {[key: number]: string} = {
          157: 'Yasuo', 238: 'Zed', 64: 'Lee Sin', 91: 'Talon', 245: 'Ekko',
          103: 'Ahri', 84: 'Akali', 12: 'Alistar', 32: 'Amumu', 34: 'Anivia',
          1: 'Annie', 22: 'Ashe', 136: 'Aurelion Sol', 268: 'Azir', 432: 'Bard',
          53: 'Blitzcrank', 63: 'Brand', 201: 'Braum', 51: 'Caitlyn', 164: 'Camille',
          69: 'Cassiopeia', 31: 'Cho\'Gath', 42: 'Corki', 122: 'Darius', 131: 'Diana',
          36: 'Dr. Mundo', 119: 'Draven', 60: 'Elise', 28: 'Evelynn', 81: 'Ezreal',
          9: 'Fiddlesticks', 114: 'Fiora', 105: 'Fizz', 3: 'Galio', 41: 'Gangplank',
          86: 'Garen', 150: 'Gnar', 79: 'Gragas', 104: 'Graves', 120: 'Hecarim',
          74: 'Heimerdinger', 420: 'Illaoi', 39: 'Irelia', 427: 'Ivern', 40: 'Janna',
          59: 'Jarvan IV', 24: 'Jax', 126: 'Jayce', 202: 'Jhin', 222: 'Jinx',
          145: 'Kai\'Sa', 429: 'Kalista', 43: 'Karma', 30: 'Karthus', 38: 'Kassadin',
          55: 'Katarina', 10: 'Kayle', 141: 'Kayn', 85: 'Kennen', 121: 'Kha\'Zix',
          203: 'Kindred', 240: 'Kled', 96: 'Kog\'Maw', 7: 'LeBlanc', 127: 'Lissandra',
          236: 'Lucian', 117: 'Lulu', 99: 'Lux', 54: 'Malphite', 90: 'Malzahar',
          57: 'Maokai', 11: 'Master Yi', 21: 'Miss Fortune', 62: 'Wukong', 82: 'Mordekaiser',
          25: 'Morgana', 267: 'Nami', 75: 'Nasus', 111: 'Nautilus', 76: 'Nidalee',
          56: 'Nocturne', 20: 'Nunu', 2: 'Olaf', 61: 'Orianna', 516: 'Ornn',
          80: 'Pantheon', 78: 'Poppy', 555: 'Pyke', 246: 'Qiyana', 133: 'Quinn',
          497: 'Rakan', 33: 'Rammus', 421: 'Rek\'Sai', 58: 'Renekton', 107: 'Rengar',
          92: 'Riven', 68: 'Rumble', 13: 'Ryze', 113: 'Sejuani', 235: 'Senna',
          147: 'Seraphine', 875: 'Sett', 35: 'Shaco', 98: 'Shen', 102: 'Shyvana',
          27: 'Singed', 14: 'Sion', 15: 'Sivir', 72: 'Skarner', 37: 'Sona',
          16: 'Soraka', 50: 'Swain', 517: 'Sylas', 134: 'Syndra', 223: 'Tahm Kench',
          163: 'Taliyah', 91: 'Talon', 44: 'Taric', 17: 'Teemo', 412: 'Thresh',
          18: 'Tristana', 48: 'Trundle', 23: 'Tryndamere', 4: 'Twisted Fate',
          29: 'Twitch', 77: 'Udyr', 6: 'Urgot', 110: 'Varus', 67: 'Vayne',
          45: 'Veigar', 161: 'Vel\'Koz', 254: 'Vi', 112: 'Viktor', 8: 'Vladimir',
          106: 'Volibear', 19: 'Warwick', 498: 'Xayah', 101: 'Xerath', 5: 'Xin Zhao',
          83: 'Yorick', 350: 'Yuumi', 154: 'Zac', 238: 'Zed', 115: 'Ziggs',
          26: 'Zilean', 142: 'Zoe', 143: 'Zyra'
        };
        return championMap[championId] || `Champion ${championId}`;
      };
      
      const summonerTableData = [{
        player: data.summoner.name,
        team: `Level ${data.summoner.level}`,
        championPlayed: data.topChampions?.[0] ? getChampionName(data.topChampions[0].championId) : 'Unknown',
        tournamentWins: data.topChampions?.[0]?.championPoints || 0,
        tournamentLosses: 0,
        winRate: data.topChampions?.[0]?.championLevel ? data.topChampions[0].championLevel * 10 : 0,
        performanceScore: data.topChampions?.[0]?.championLevel ? data.topChampions[0].championLevel * 14 : 0,
        event: 'Individual Summoner Lookup'
      }];
      
      this.setState({
        summonerLookup: {
          ...this.state.summonerLookup,
          loading: false,
          result: data,
          error: undefined,
          xrayTraceId: xrayTraceId || data?.xray_trace_id
        },
        summoners: summonerTableData,
        dataSourceStatus: { live: null, test: null, summoner: true }
      });
      
      // Fetch X-Ray trace data
      if (xrayTraceId || data?.xray_trace_id) {
        this.fetchXRayTrace(xrayTraceId || data?.xray_trace_id);
      }
    } catch (error: any) {
      console.error('Summoner lookup error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let errorMessage = 'Network error - check browser console for details';
      let xrayTraceId = error.xrayTraceId;
      
      if (error.message) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = `CORS/Network error - URL: ${import.meta.env.VITE_SUMMONER_LOOKUP_URL}`;
        } else {
          errorMessage = error.message;
        }
      }
      
      this.setState({
        summonerLookup: {
          ...this.state.summonerLookup,
          loading: false,
          error: errorMessage,
          xrayTraceId: xrayTraceId
        },
        dataSourceStatus: { live: null, test: null, summoner: false }
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
                <Box variant="p" padding={{vertical: 's', horizontal: 'm'}} style={{backgroundColor: '#fff2cc', borderRadius: '8px'}}>
                  <strong>🔍 Request Journey:</strong><br/>
                  <div style={{fontFamily: 'monospace', fontSize: '12px', marginTop: '8px'}}>
                    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐<br/>
                    │ React   │───▶│ Lambda  │───▶│Riot API │───▶│ ❌ Failed│<br/>
                    │ Client  │    │Function │    │Request  │    │Fallback │<br/>
                    └─────────┘    └─────────┘    └─────────┘    └─────────┘<br/>
                    &nbsp;&nbsp;GET req&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;API call&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Local data
                  </div>
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
              
              <div>
                Check the browser console for detailed error information. 
                <a href="https://github.com/BryanChasko/rift-rewind-aws-riot-games-hackathon" target="_blank" rel="noopener noreferrer">🔗 View GitHub repo</a> for troubleshooting or contact <a href="https://linkedin.com/in/bryanchasko" target="_blank" rel="noopener noreferrer">Bryan Chasko</a>.
              </div>
            </SpaceBetween>
          </Alert>
        )}
        
        {this.state.error === 'api-partial' && (
          <Alert type="info" header="📊 API Status with X-Ray Diagnostics">
            <SpaceBetween direction="vertical" size="s">
              <div>
                Lambda executed successfully but Riot APIs are unavailable. Using local fallback data.
              </div>
              
              {this.state.xrayTraceId && (
                <div style={{backgroundColor: '#e6f3ff', borderRadius: '8px', padding: '12px'}}>
                  <strong>🔍 Request Journey:</strong><br/>
                  <div style={{fontFamily: 'monospace', fontSize: '12px', marginTop: '8px'}}>
                    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐<br/>
                    │ React   │───▶│ Lambda  │───▶│Riot API │───▶│Fallback │<br/>
                    │ Client  │    │Function │    │Timeout  │    │ Data    │<br/>
                    └─────────┘    └─────────┘    └─────────┘    └─────────┘<br/>
                    &nbsp;&nbsp;GET req&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Retry&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Demo data
                  </div>
                </div>
              )}
              
              {this.state.errorDetails?.api_attempts && (
                <div>
                  <strong>🛠️ API Attempt Details:</strong><br/>
                  {this.state.errorDetails.api_attempts.map((attempt: any, index: number) => (
                    <div key={index}>
                      <code>{attempt.endpoint}: {attempt.status} - {attempt.result}</code><br/>
                    </div>
                  ))}
                </div>
              )}
            </SpaceBetween>
          </Alert>
        )}
        
        {(this.props.stateManager.getDataMode('contests') === 'live' || this.props.stateManager.getDataMode('contests') === 'demo') && (
          <Alert type="success" header={`🔗 Data Context from Step 1: ${this.props.selectedYear.value} Tournament Data`}>
            <SpaceBetween direction="vertical" size="s">
              <div>
                <strong>Year Filter Applied:</strong> {this.props.selectedYear.value} selection automatically carried forward from Uniform Interface demo. This shows how client-server architecture maintains state across different API endpoints while allowing independent evolution.
              </div>
              <div style={{backgroundColor: '#e8f5e8', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px'}}>
                <strong>🔍 Data Flow Connection:</strong><br/>
                Step 1 (Uniform Interface) → Year: {this.props.selectedYear.value} → Step 2 (Client-Server)<br/>
                ┌─────────┐    ┌─────────┐    ┌─────────┐<br/>
                │Contests │───▶│ Filter  │───▶│Summoners│<br/>
                │API Call │    │ Year    │    │ for Year │<br/>
                └─────────┘    └─────────┘    └─────────┘<br/>
                &nbsp;&nbsp;{this.props.selectedYear.value}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Context&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.props.selectedYear.value} data
              </div>
            </SpaceBetween>
          </Alert>
        )}
        
        <Container 
          header="Summoner Signature Champions"
          className="rest-constraint-2"
        >
          <SpaceBetween direction="vertical" size="s">
            <Alert type="info" header="🎮 Architecture Overview">
              <Box variant="p">
                <strong>Dual Lambda:</strong> Main (Challenger data) + Summoner (Riot ID lookup)<br/>
                <strong>Security:</strong> API keys in encrypted SSM Parameter Store<br/>
                <strong>Process:</strong> Riot ID → Account API → Summoner API → Champion Mastery
              </Box>
            </Alert>
            

            
            <Container header="🎮 Client-Server Data Sources">
              <SpaceBetween direction="vertical" size="m">
                <Box variant="p">
                  Choose your data source to explore client-server architecture patterns:
                </Box>
                
                <ColumnLayout columns={3} variant="text-grid">
                  <div style={{textAlign: 'center'}}>
                    {this.renderApiButton(
                      () => this.fetchSummoners(),
                      `${this.state.dataSourceStatus.live === true ? '✅' : this.state.dataSourceStatus.live === false ? '❌' : '🚀'} Fetch ${this.props.selectedYear.value} Summoners`,
                      'Live Data Loaded',
                      this.state.dataSourceStatus.live === true
                    )}
                    <Box variant="small" color={this.state.dataSourceStatus.live === true ? 'text-status-success' : this.state.dataSourceStatus.live === false ? 'text-status-error' : 'text-body-secondary'} margin={{top: 'xs'}}>
                      {this.state.dataSourceStatus.live === true ? `✅ Live Challenger League (${this.state.summoners.length} players)` : this.state.dataSourceStatus.live === false ? '❌ Failed to load from Riot API' : `Live Challenger League for ${this.props.selectedYear.value}`}
                    </Box>
                  </div>
                  
                  <div style={{textAlign: 'center'}}>
                    <SpaceBetween direction="vertical" size="s">
                      <button 
                        style={{
                          padding: '12px 24px', 
                          borderRadius: '6px', 
                          border: 'none', 
                          background: '#0073bb', 
                          color: 'white', 
                          cursor: this.state.summonerLookup.loading ? 'not-allowed' : 'pointer',
                          opacity: this.state.summonerLookup.loading ? 0.6 : 1,
                          fontSize: '14px',
                          fontWeight: '500',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                        onClick={() => this.lookupSummoner()}
                        disabled={this.state.summonerLookup.loading}
                      >
                        {this.state.summonerLookup.loading ? 'Looking up...' : `${this.state.dataSourceStatus.summoner === true ? '✅' : this.state.dataSourceStatus.summoner === false ? '❌' : '🔍'} Look Up Summoner`}
                      </button>
                      <Box variant="small" color={this.state.dataSourceStatus.summoner === true ? 'text-status-success' : this.state.dataSourceStatus.summoner === false ? 'text-status-error' : 'text-body-secondary'}>
                        {this.state.dataSourceStatus.summoner === true ? '✅ Individual lookup' : this.state.dataSourceStatus.summoner === false ? '❌ Failed lookup' : 'Individual lookup'}
                      </Box>
                      
                      <SpaceBetween direction="vertical" size="xs">
                        <input 
                          type="text" 
                          placeholder="Doublelift#NA1" 
                          value={this.state.summonerLookup.riotId}
                          onChange={(e) => this.setState({
                            summonerLookup: {...this.state.summonerLookup, riotId: (e.target as HTMLInputElement).value}
                          })}
                          style={{
                            padding: '6px 8px', 
                            borderRadius: '4px', 
                            border: '1px solid #d5dbdb', 
                            width: '100%',
                            fontSize: '12px',
                            boxSizing: 'border-box'
                          }}
                        />
                        <select 
                          value={this.state.summonerLookup.region}
                          onChange={(e) => this.setState({
                            summonerLookup: {...this.state.summonerLookup, region: (e.target as HTMLSelectElement).value}
                          })}
                          style={{
                            padding: '6px 8px', 
                            borderRadius: '4px', 
                            border: '1px solid #d5dbdb',
                            fontSize: '12px',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="na1">North America</option>
                          <option value="euw1">Europe West</option>
                          <option value="kr">Korea</option>
                        </select>
                      </SpaceBetween>
                    </SpaceBetween>
                  </div>
                  
                  <div style={{textAlign: 'center'}}>
                    {this.renderApiButton(
                      () => this.loadTestData(),
                      `${this.state.dataSourceStatus.test === true ? '✅' : this.state.dataSourceStatus.test === false ? '❌' : '📊'} Load ${this.props.selectedYear.value} Test Data`,
                      'Test Data Loaded',
                      this.state.dataSourceStatus.test === true
                    )}
                    <Box variant="small" color={this.state.dataSourceStatus.test === true ? 'text-status-success' : this.state.dataSourceStatus.test === false ? 'text-status-error' : 'text-body-secondary'} margin={{top: 'xs'}}>
                      {this.state.dataSourceStatus.test === true ? `✅ Local ${this.props.selectedYear.value} fallback data` : this.state.dataSourceStatus.test === false ? '❌ Failed to load' : `Local ${this.props.selectedYear.value} fallback data`}
                    </Box>
                  </div>
                </ColumnLayout>

                
                {this.state.summonerLookup.result && (
                  <Alert type="success" header="🎮 Summoner Found">
                    <SpaceBetween direction="vertical" size="s">
                      <Box variant="p">
                        <strong>{this.state.summonerLookup.result.summoner.name}</strong> - Level {this.state.summonerLookup.result.summoner.level}<br/>
                        <strong>Top Champions:</strong> {this.state.summonerLookup.result.topChampions?.map((c: any) => `Champion ${c.championId} (${c.championPoints} pts)`).join(', ') || 'None'}
                      </Box>
                      
                      {this.state.summonerLookup.xrayTraceId && (
                        <div style={{backgroundColor: '#f2f3f3', borderRadius: '8px', padding: '12px'}}>
                          <strong>🔍 Request Journey:</strong><br/>
                          {this.state.xrayTrace ? (
                            <div style={{fontFamily: 'monospace', fontSize: '11px', marginTop: '8px'}}>
                              {this.state.xrayTrace.segments?.map((segment: any, i: number) => (
                                <div key={i} style={{marginBottom: '4px'}}>
                                  <strong>{segment.name}</strong>: {Math.round(segment.duration * 1000)}ms
                                  {segment.subsegments?.map((sub: any, j: number) => (
                                    <div key={j} style={{marginLeft: '16px', color: '#666'}}>
                                      └─ {sub.name}: {Math.round(sub.duration * 1000)}ms
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{fontFamily: 'monospace', fontSize: '12px', marginTop: '8px'}}>
                              ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐<br/>
                              │ React   │───▶│ Lambda  │───▶│   SSM   │───▶│ Response│<br/>
                              │ Client  │    │Function │    │Parameter│    │ Success │<br/>
                              └─────────┘    └─────────┘    └─────────┘    └─────────┘<br/>
                              &nbsp;&nbsp;POST req&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;API key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Demo data
                            </div>
                          )}
                        </div>
                      )}
                    </SpaceBetween>
                  </Alert>
                )}
                
                {this.state.summonerLookup.error && (
                  <Alert type="error" header="⚠️ Lookup Failed">
                    <SpaceBetween direction="vertical" size="s">
                      <Box variant="p">
                        <strong>Error:</strong> {this.state.summonerLookup.error}
                      </Box>
                      
                      <Box variant="p">
                        {this.state.summonerLookup.xrayTraceId ? (
                          <>
                            <div style={{backgroundColor: '#fdf2f2', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px'}}>
                              <strong>🔍 Error in Request Journey:</strong><br/>
                              ┌─────────┐    ┌─────────┐    ┌─────────┐<br/>
                              │ React   │───▶│ Lambda  │───▶│ ❌ Error │<br/>
                              │ Client  │    │Function │    │Response │<br/>
                              └─────────┘    └─────────┘    └─────────┘<br/>
                              &nbsp;&nbsp;POST req&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Failed
                            </div>
                          </>
                        ) : (
                          <>
                            <strong>🔍 Network Diagnostics:</strong><br/>
                            <em>Request failed before reaching Lambda - likely CORS or connectivity issue</em><br/>
                            <strong>Check:</strong> Browser console, Lambda URL, CORS configuration
                          </>
                        )}
                      </Box>
                      
                      <Box variant="p">
                        <strong>🛠️ Architecture Flow:</strong><br/>
                        React → POST {import.meta.env.VITE_SUMMONER_LOOKUP_URL ? 'to Lambda URL' : '(URL not configured)'} → SSM → Demo Response
                      </Box>
                    </SpaceBetween>
                  </Alert>
                )}
              </SpaceBetween>
            </Container>
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
                  header={this.state.summoners.length === 1 && this.state.summoners[0]?.event === 'Individual Summoner Lookup' ? "Individual Summoner Lookup Result" : this.state.dataSourceStatus.live === true ? "Top Challenger Summoners (Live Data)" : "Top Ranked Summoners (Simulated Data)"}
                  description={this.state.summoners.length === 1 && this.state.summoners[0]?.event === 'Individual Summoner Lookup' ? `Individual summoner data retrieved via Riot ID lookup. Shows summoner level and top champion mastery data from the Champion Mastery API. Select a row to view more about the champion as we explore stateless communication.` : this.state.dataSourceStatus.live === true ? `Live Challenger League data from Riot Games API. Players are identified by encrypted IDs (puuid/summonerId) - to get Riot IDs like 'Player#NA1', we'd need additional Account API calls using their puuid. Select a row to view more about the champion as we explore stateless communication.` : `Simulated summoner data for demonstration. Select a row to view more about the champion as we explore stateless communication.`}
                  counter={`(${this.state.summoners.length})`}
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