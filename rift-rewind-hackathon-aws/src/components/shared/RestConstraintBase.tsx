import React from 'react';
import { Header, Button, Box, SpaceBetween, Container, Grid } from '@cloudscape-design/components';
import { ApiService } from '../../services/ApiService';
import { StateManager } from '../../services/StateManager';
import type { ConstraintSection } from '../../services/types';
import { focusElement, announceToScreenReader } from '../../utils/accessibility';
import { useResponsive } from '../../utils/responsive';

export interface RestConstraintBaseProps {
  apiService: ApiService;
  stateManager: StateManager;
  onNavigate: (page: string) => void;
  selectedYear: { label: string; value: string };
  selectedChampion: { label: string; value: string } | null;
  loading: boolean;
  activeDemo: ConstraintSection | null;
  onYearChange?: (year: { label: string; value: string }) => void;
  onChampionChange?: (champion: { label: string; value: string } | null) => void;
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
        headingIdentifier={`constraint-${this.constraintNumber}`}
        info={<span className="sr-only">REST constraint {this.constraintNumber} of 6</span>}
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
        <Button 
          onClick={onFetch}
          loading={this.props.loading && this.props.activeDemo === this.section}
          variant="primary"
          className={`button-color-${this.constraintNumber}`}
          disabled={disabled}
        >
          {dataMode === 'live' ? `✅ ${liveText}` : `🚀 ${buttonText}`}
        </Button>
        
        {lastUpdated && (
          <Box variant="small" color="text-body-secondary">
            🕰️ Last updated: {lastUpdated.toLocaleTimeString()} | 🔑 Using: Bryan's Private API Key
          </Box>
        )}
      </SpaceBetween>
    );
  }

  protected renderNextStep(nextPage: string, nextTitle: string, description?: string): React.JSX.Element {
    const handleNavigation = () => {
      announceToScreenReader(`Navigating to ${nextTitle}`, 'polite');
      this.props.onNavigate(nextPage);
      // Focus management following Cloudscape patterns
      setTimeout(() => {
        focusElement(`[data-testid="constraint-${this.constraintNumber + 1}-header"]`);
        announceToScreenReader(`Now viewing: ${nextTitle}`, 'polite');
      }, 300);
    };
    
    return (
      <Container 
        variant="stacked" 
         
        aria-label="Navigate to next REST constraint"
      >
        <Header variant="h3">🚀 Next Step: {nextTitle}</Header>
        <SpaceBetween direction="vertical" size="s">
          {description && <Box variant="p">{description}</Box>}
          <Button 
            variant="primary" 
            onClick={handleNavigation}
            ariaLabel={`Continue to ${nextTitle} - REST constraint ${this.constraintNumber + 1}`}
          >
            ➡️ Continue to {nextTitle}
          </Button>
        </SpaceBetween>
      </Container>
    );
  }

  render(): React.JSX.Element {
    return (
      <section 
        aria-labelledby={`constraint-${this.constraintNumber}`} 
        
        data-testid={`constraint-${this.constraintNumber}`}
        className="responsive-container"
      >
        <Grid gridDefinition={[{ colspan: { default: 12, xs: 12 } }]}>
          <SpaceBetween direction="vertical" size="l" className="responsive-stack">
            <div data-testid={`constraint-${this.constraintNumber}-header`}>
              {this.renderHeader()}
            </div>
            {this.renderContent()}
          </SpaceBetween>
        </Grid>
      </section>
    );
  }
}