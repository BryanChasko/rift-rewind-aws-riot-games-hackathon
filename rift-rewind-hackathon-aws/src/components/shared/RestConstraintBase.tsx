import React from 'react';
import { Header, Button, Box, SpaceBetween, Container } from '@cloudscape-design/components';
import { ApiService } from '../../services/ApiService';
import { StateManager } from '../../services/StateManager';
import type { ConstraintSection } from '../../services/types';

export interface RestConstraintBaseProps {
  apiService: ApiService;
  stateManager: StateManager;
  onNavigate: (page: string) => void;
  selectedYear: { label: string; value: string };
  selectedChampion: { label: string; value: string } | null;
  loading: boolean;
  activeDemo: ConstraintSection | null;
}

export abstract class RestConstraintBase extends React.Component<RestConstraintBaseProps> {
  protected abstract constraintNumber: number;
  protected abstract title: string;
  protected abstract description: string;
  protected abstract section: ConstraintSection;

  abstract renderContent(): React.JSX.Element;

  protected renderHeader(): React.JSX.Element {
    return (
      <Header
        variant="h1"
        description={this.description}
      >
        {this.constraintNumber}️⃣ {this.title}
      </Header>
    );
  }

  protected renderApiButton(
    onFetch: () => Promise<void>,
    buttonText: string,
    liveText: string,
    disabled: boolean = false
  ): React.JSX.Element {
    const dataMode = this.props.stateManager.getDataMode(this.section);
    const lastUpdated = this.props.stateManager.getLastUpdated(this.section);
    
    return (
      <SpaceBetween direction="vertical" size="s">
        <SpaceBetween direction="horizontal" size="s">
          <Button 
            onClick={onFetch}
            loading={this.props.loading && this.props.activeDemo === this.section}
            variant="primary"
            className={`button-color-${this.constraintNumber}`}
            disabled={disabled}
          >
            {dataMode === 'live' ? `✅ ${liveText}` : `🚀 ${buttonText}`}
          </Button>
          {dataMode === 'live' && (
            <Button 
              onClick={() => this.props.stateManager.resetToDemo(this.section)}
              variant="normal"
            >
              🔄 Reset to Demo Data
            </Button>
          )}
        </SpaceBetween>
        
        {lastUpdated && (
          <Box variant="small" color="text-body-secondary">
            🕰️ Last updated: {lastUpdated.toLocaleTimeString()} | 🔑 Using: Bryan's Private API Key
          </Box>
        )}
      </SpaceBetween>
    );
  }

  protected renderNextStep(nextPage: string, nextTitle: string, description?: string): React.JSX.Element {
    return (
      <Container variant="stacked">
        <Header variant="h3">🚀 Next Step: {nextTitle}</Header>
        <SpaceBetween direction="vertical" size="s">
          {description && <Box variant="p">{description}</Box>}
          <Button 
            variant="primary" 
            onClick={() => this.props.onNavigate(nextPage)}
          >
            ➡️ Continue to {nextTitle}
          </Button>
        </SpaceBetween>
      </Container>
    );
  }

  render(): React.JSX.Element {
    return (
      <SpaceBetween direction="vertical" size="l">
        {this.renderHeader()}
        {this.renderContent()}
      </SpaceBetween>
    );
  }
}