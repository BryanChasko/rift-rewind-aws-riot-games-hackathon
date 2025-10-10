import React from 'react';
import { Button, SpaceBetween, Box, Grid } from '@cloudscape-design/components';
import type { DataMode } from '../../services/types';
import { announceToScreenReader } from '../../utils/accessibility';
import { useResponsive } from '../../utils/responsive';

interface ApiButtonProps {
  onFetch: () => Promise<void>;
  loading: boolean;
  dataMode: DataMode;
  buttonText: string;
  liveText: string;
  onReset: () => void;
  disabled?: boolean;
  className?: string;
  lastUpdated?: Date | null;
}

export const ApiButton: React.FC<ApiButtonProps> = ({
  onFetch,
  loading,
  dataMode,
  buttonText,
  liveText,
  onReset,
  disabled = false,
  className,
  lastUpdated
}) => {
  const { isMobile } = useResponsive();
  
  const handleFetch = async () => {
    announceToScreenReader('Loading data, please wait', 'polite');
    try {
      await onFetch();
      // Success announcement with assertive priority for important feedback
      announceToScreenReader(
        dataMode === 'live' ? 'Success: Live data loaded' : 'Demo data loaded', 
        'assertive'
      );
    } catch (error) {
      // Error announcement with assertive priority
      announceToScreenReader('Error: Failed to load data', 'assertive');
    }
  };
  
  const handleReset = () => {
    onReset();
    announceToScreenReader('Reset to demo data completed', 'polite');
  };
  return (
    <SpaceBetween direction="vertical" size="s">
      <Grid gridDefinition={[
        { colspan: { default: isMobile ? 12 : 'auto', xs: 12 } },
        { colspan: { default: isMobile ? 12 : 'auto', xs: 12 } }
      ]}>
        <Button 
          onClick={handleFetch}
          loading={loading}
          variant="primary"
          className={className}
          disabled={disabled}
          ariaLabel={dataMode === 'live' ? liveText : buttonText}
        >
          {dataMode === 'live' ? `✅ ${liveText}` : `🚀 ${buttonText}`}
        </Button>
        {dataMode === 'live' && (
          <Button 
            onClick={handleReset}
            variant="normal"
            ariaLabel="Reset to demo data"
          >
            🔄 Reset to Demo Data
          </Button>
        )}
      </Grid>
      
      {lastUpdated && (
        <Box variant="small" color="text-body-secondary">
          🕰️ Last updated: {lastUpdated.toLocaleTimeString()} | 🔑 Using: Bryan's Private API Key
        </Box>
      )}
    </SpaceBetween>
  );
};