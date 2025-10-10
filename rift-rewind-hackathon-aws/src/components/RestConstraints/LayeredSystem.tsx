
import React from 'react';
import { Container, Alert, ColumnLayout, Box, Select, SpaceBetween } from '@cloudscape-design/components';
import { RestConstraintBase } from '../shared/RestConstraintBase';
import { DataTable, type TableColumn } from '../shared/DataTable';
import type { LayerData } from '../../services/types';

export class LayeredSystem extends RestConstraintBase {
  protected constraintNumber = 5;
  protected title = "Layered System Architecture";
  protected description = "Explore hidden complexity behind simple API calls. Discover multiple infrastructure layers processing your requests invisibly.";
  protected section = 'challenger' as const;

  private async fetchLayeredSystem() {
    if (this.props.apiService) {
      await this.props.apiService.fetchLayeredSystem();
    }
    this.props.stateManager.setDataMode(this.section, 'live');
    this.forceUpdate();
  }

  renderContent(): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const lastUpdated = this.props.stateManager.getLastUpdated(this.section);
    const hasContext = this.props.stateManager.getDataMode('data-dragon') === 'live' || this.props.stateManager.getDataMode('champion-details') === 'live';

    const layerColumns: TableColumn<LayerData>[] = [
      {
        id: 'layer',
        header: 'Infrastructure Layer',
        cell: (item) => (
          <SpaceBetween direction="vertical" size="xs">
            <Box variant="strong">{item.layer}</Box>
            <Box variant="small" color="text-body-secondary">{item.description}</Box>
          </SpaceBetween>
        )
      },
      {
        id: 'purpose',
        header: 'Purpose',
        cell: (item) => (
          <Box variant="strong">
            {item.purpose}
          </Box>
        )
      },
      {
        id: 'latency',
        header: 'Processing Time',
        cell: (item) => (
          <Box variant="strong" color="text-status-success">
            {item.latency}ms
          </Box>
        )
      },
      {
        id: 'visibility',
        header: 'Client Visibility',
        cell: (item) => (
          <Box variant="strong" color={item.visible ? "text-status-warning" : "text-status-info"}>
            {item.visible ? 'Visible' : 'Hidden'}
          </Box>
        )
      }
    ];

    return (
      <>
        <Alert statusIconAriaLabel="Info" header="🔍 Hidden Layers">
          CDN → Load Balancer → Auth Service → Game DB | Multiple systems, one simple URL
        </Alert>
        
        {hasContext && (
          <Alert type="success" header="🔗 Data Context from Previous Steps: CDN Performance Data">
            <Box variant="p">
              CDN cache data inherited from cacheable demo. Now revealing the hidden infrastructure layers that made those fast responses possible.
            </Box>
          </Alert>
        )}
        
        <Container 
          header="Infrastructure Layers - Behind the Scenes"
          className="rest-constraint-5"
        >
          <SpaceBetween direction="vertical" size="s">
            <Alert type="info" header="🏗️ Multiple Systems, One Simple URL">
              <Box variant="p">
                <strong>Hidden complexity:</strong> Your simple API call traverses CDN edge servers, load balancers, authentication services, and game databases - all invisible to you as the client.
              </Box>
            </Alert>
            
            <ColumnLayout columns={2} variant="text-grid">
              <Box variant="p">
                <strong>Select Infrastructure Layer:</strong><br/>
                <Select
                  selectedOption={{ label: 'All Layers', value: 'all' }}
                  onChange={() => {}}
                  options={[
                    { label: 'All Layers', value: 'all' },
                    { label: 'CDN Edge', value: 'cdn' },
                    { label: 'Load Balancer', value: 'lb' },
                    { label: 'Auth Service', value: 'auth' },
                    { label: 'Game Database', value: 'db' }
                  ]}
                />
              </Box>
              <Box variant="p">
                <strong>🌐 Request Path:</strong><br/>
                <code>Client → CloudFront CDN → ALB → API Gateway → Lambda → RDS</code><br/>
                <strong>📡 Layers:</strong> 6+ systems<br/>
                <strong>🔑 Transparency:</strong> Hidden from client
              </Box>
            </ColumnLayout>
            
            {this.renderApiButton(
              () => this.fetchLayeredSystem(),
              'Trace Request Path',
              'Layers Revealed!',
              false
            )}
            
            {lastUpdated && (
              <Box variant="small" color="text-body-secondary">
                🕰️ Layer trace: {lastUpdated.toLocaleTimeString()} | 🔍 {Math.floor(Math.random() * 6 + 4)} layers traversed
              </Box>
            )}
          </SpaceBetween>
        </Container>

        {(this.props.activeDemo === this.section || dataMode === 'live') && (
          <>
            <Alert 
              type="success" 
              header="🎉 Infrastructure Layers Revealed! Multiple systems working invisibly."
              dismissible
            />
            <Container 
              data-testid="layers-response"
              header="🏗️ System Architecture Layers"
              className="rest-constraint-5"
            >
              <DataTable
                items={[
                  { layer: 'CloudFront CDN', description: 'Global edge cache', purpose: 'Content delivery', latency: 5, visible: false },
                  { layer: 'Application Load Balancer', description: 'Traffic distribution', purpose: 'Load balancing', latency: 2, visible: false },
                  { layer: 'API Gateway', description: 'Request routing', purpose: 'API management', latency: 8, visible: false },
                  { layer: 'Lambda Function', description: 'Serverless compute', purpose: 'Business logic', latency: 15, visible: false },
                  { layer: 'RDS Database', description: 'Persistent storage', purpose: 'Data retrieval', latency: 12, visible: false },
                  { layer: 'Response Aggregation', description: 'Data formatting', purpose: 'JSON response', latency: 3, visible: true }
                ]}
                columns={layerColumns}
                header="🔍 Request Processing Layers (Layered System)"
                description="Multiple infrastructure systems working behind one simple API call"
                emptyMessage="No layer data available"
              />
            </Container>
            
            {this.renderNextStep(
              'code-on-demand',
              'Code on Demand Pattern',
              'Ready to see how server instructions dynamically configure client behavior?'
            )}
          </>
        )}
      </>
    );
  }
}