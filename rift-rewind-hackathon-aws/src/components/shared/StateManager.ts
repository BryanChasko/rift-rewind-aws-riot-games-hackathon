import type { DataMode, ConstraintSection } from '../../services/types';

export class StateManager {
  private dataMode: Record<ConstraintSection, DataMode> = {
    contests: 'demo',
    champions: 'demo',
    'champion-details': 'demo',
    'data-dragon': 'demo',
    challenger: 'demo',
    dynamic: 'demo'
  };
  
  private lastUpdated: Record<ConstraintSection, Date> = {} as Record<ConstraintSection, Date>;

  setDataMode(section: ConstraintSection, mode: DataMode): void {
    this.dataMode[section] = mode;
    this.lastUpdated[section] = new Date();
  }

  getDataMode(section: ConstraintSection): DataMode {
    return this.dataMode[section];
  }

  resetToDemo(section: ConstraintSection): void {
    this.dataMode[section] = 'demo';
    this.lastUpdated[section] = new Date();
  }

  getLastUpdated(section: ConstraintSection): Date | null {
    return this.lastUpdated[section] || null;
  }

  getAllDataModes(): Record<ConstraintSection, DataMode> {
    return { ...this.dataMode };
  }
}