
import { Container, Alert, ColumnLayout, Box, Select, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import type { ConfigData } from '../../services/types';

export class CodeOnDemand extends RestConstraintBase {
  protected constraintNumber = 6;
  protected title = "Code on Demand Pattern";
  protected description = "Watch runtime adaptation and dynamic UI behavior. See how server-sent instructions create responsive interfaces that adapt to data.";
  protected section = 'dynamic' as const;

  private async fetchDynamicConfig() {
    await this.props.apiService.fetchDynamicConfig();
    this.props.stateManager.setDataMode(this.section, 'live');
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const lastUpdated = this.props.stateManager.getLastUpdated(this.section);
    const hasContext = this.props.stateManager.getDataMode('challenger') === 'live' || this.props.stateManager.getDataMode('data-dragon') === 'live';

    const configColumns: TableColumn<ConfigData>[] = [
      {
        id: 'config',
        header: 'UI Configuration',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong">{item.config}</Box>
            <Box variant="small" color="text-body-secondary">{item.description}</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'serverInstruction',
        header: 'Server Instruction',
        cell: (item) => (
          <Box variant="strong">
            {item.instruction}
          </Box>
        )
      },
      {
        id: 'clientBehavior',
        header: 'Client Behavior',
        cell: (item) => (
          <Box variant="strong" color="text-status-success">
            {item.behavior}
          </Box>
        )
      },
      {
        id: 'adaptation',
        header: 'Runtime Adaptation',
        cell: (item) => (
          <Box variant="strong" color={item.adapted ? "text-status-success" : "text-status-info"}>
            {item.adapted ? 'Adapted' : 'Static'}
          </Box>
        )
      }
    ];

    return (
      <>
        <Alert statusIconAriaLabel="Info" header="⚡ Dynamic Loading">
          API metadata → UI configuration → Runtime adaptation | Server tells client how to behave
        </Alert>
        
        {hasContext && (
          <Alert type="success" header="🔗 Data Context from Previous Steps: Infrastructure Layers">
            <Box variant="p">
              Layer data inherited from layered system demo. Now demonstrating how server metadata dynamically configures client UI behavior at runtime.
            </Box>
          </Alert>
        )}
        
        <Container 
          header="Dynamic UI Configuration - Server Instructions"
          className="rest-constraint-6"
        >
          <SpaceBetween direction="vertical" size="s">
            <Alert type="info" header="💻 Server-Driven UI Adaptation">
              <Box variant="p">
                <strong>Runtime configuration:</strong> Server sends metadata that tells the client how to render, what actions to enable, and how to behave - UI adapts dynamically to server instructions.
              </Box>
            </Alert>
            
            <ColumnLayout columns={2} variant="text-grid">
              <Box variant="p">
                <strong>Select UI Behavior:</strong><br/>
                <Select
                  selectedOption={{ label: 'Dynamic Configuration', value: 'dynamic' }}
                  onChange={() => {}}
                  options={[
                    { label: 'Dynamic Configuration', value: 'dynamic' },
                    { label: 'Static Layout', value: 'static' },
                    { label: 'Adaptive Rendering', value: 'adaptive' },
                    { label: 'Conditional Actions', value: 'conditional' }
                  ]}
                />
              </Box>
              <Box variant="p">
                <strong>🌐 Metadata Endpoint:</strong><br/>
                <code>https://na1.api.riotgames.com/lol/platform/v3/champion-rotations</code><br/>
                <strong>📡 Response:</strong> UI configuration JSON<br/>
                <strong>🔑 Behavior:</strong> Server-driven adaptation
              </Box>
            </ColumnLayout>
            
            {this.renderApiButton(
              () => this.fetchDynamicConfig(),
              'Load Dynamic Config',
              'UI Configured!',
              false
            )}
            
            {lastUpdated && (
              <Box variant="small" color="text-body-secondary">
                🕰️ Config loaded: {lastUpdated.toLocaleTimeString()} | 💻 UI adapted dynamically
              </Box>
            )}
          </SpaceBetween>
        </Container>

        {(this.props.activeDemo === this.section || dataMode === 'live') && (
          <>
            <Alert 
              type="success" 
              header="🎉 Dynamic Configuration Applied! Server metadata configured client behavior."
              dismissible
            />
            <Container 
              data-testid="dynamic-response"
              header="⚡ Dynamic UI Configuration Response"
              className="rest-constraint-6"
            >
              <DataTable
                items={[]} // Will be populated by parent with config data
                columns={configColumns}
                header="💻 Runtime UI Configuration (Code on Demand)"
                description="Server metadata dynamically configures client UI behavior at runtime"
                emptyMessage="No configuration data available"
              />
            </Container>
            
            <Container variant="stacked">
              <SpaceBetween direction="vertical" size="s">
                <Box variant="h3">🎉 REST Constraints Complete!</Box>
                <Box variant="p">
                  You've experienced all 6 REST architectural constraints in action. Ready to explore more API patterns?
                </Box>
                {this.renderNextStep(
                  'overview',
                  'REST Overview',
                  ''
                )}
              </SpaceBetween>
            </Container>
          </>
        )}
      </>
    );
  }
}