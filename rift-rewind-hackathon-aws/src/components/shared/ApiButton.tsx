import React from 'react';
import { Button, SpaceBetween, Box } from '@cloudscape-design/components';
import type { DataMode } from '../../services/types';

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
  return (
    <SpaceBetween direction="vertical" size="s">
      <SpaceBetween direction="horizontal" size="s">
        <Button 
          onClick={onFetch}
          loading={loading}
          variant="primary"
          className={className}
          disabled={disabled}
        >
          {dataMode === 'live' ? `✅ ${liveText}` : `🚀 ${buttonText}`}
        </Button>
        {dataMode === 'live' && (
          <Button 
            onClick={onReset}
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
};