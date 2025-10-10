import { useState } from 'react';
import type { ConstraintSection } from '../services/types';
import { StateManager } from '../services/StateManager';

export function useRestConstraint(constraintId: ConstraintSection, stateManager: StateManager) {
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<ConstraintSection | null>(null);

  const dataMode = stateManager.getDataMode(constraintId);
  const lastUpdated = stateManager.getLastUpdated(constraintId);

  const fetchLiveData = async (fetchFunction: () => Promise<void>) => {
    setLoading(true);
    setActiveDemo(constraintId);
    try {
      await fetchFunction();
      stateManager.setDataMode(constraintId, 'live');
    } catch (error) {
      console.error(`Failed to fetch data for ${constraintId}:`, error);
      stateManager.setDataMode(constraintId, 'demo');
    } finally {
      setLoading(false);
    }
  };

  const resetToDemo = () => {
    stateManager.resetToDemo(constraintId);
    setActiveDemo(constraintId);
  };

  return { 
    loading, 
    dataMode, 
    lastUpdated, 
    activeDemo,
    fetchLiveData, 
    resetToDemo 
  };
}