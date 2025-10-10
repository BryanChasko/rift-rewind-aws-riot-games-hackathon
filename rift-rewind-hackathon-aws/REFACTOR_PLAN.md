# RiftRewindDashboard Refactoring Plan

## Current Issues
- **1,500+ lines** in single component
- **6 REST constraint render methods** (200+ lines each)
- **Repeated API logic** across multiple fetch functions
- **Mixed concerns** - UI, state, API, data transformation
- **Poor maintainability** and testing difficulty

## Object-Oriented Architecture

### 1. Core Classes

#### `ApiService` Class
```typescript
class ApiService {
  private baseUrl: string;
  
  async fetchContests(year: string): Promise<Contest[]>
  async fetchSummoners(year: string): Promise<TournamentWinner[]>
  async fetchChampionMastery(champion: string): Promise<MasteryData>
  async fetchDataDragon(champion: string): Promise<void>
  async fetchLayeredSystem(): Promise<LayerData[]>
  async fetchDynamicConfig(): Promise<ConfigData[]>
}
```

#### `RestConstraintManager` Class
```typescript
class RestConstraintManager {
  private apiService: ApiService;
  private dataMode: Record<string, 'demo' | 'live'>;
  
  setDataMode(section: string, mode: 'demo' | 'live'): void
  resetToDemo(section: string): void
  getLastUpdated(section: string): Date
}
```

### 2. Component Hierarchy

```
RiftRewindDashboard (Router)
├── RestConstraints/
│   ├── UniformInterface.tsx
│   ├── ClientServer.tsx
│   ├── Stateless.tsx
│   ├── Cacheable.tsx
│   ├── LayeredSystem.tsx
│   └── CodeOnDemand.tsx
├── shared/
│   ├── RestConstraintBase.tsx
│   ├── ApiButton.tsx
│   ├── DataTable.tsx
│   ├── ChampionSelector.tsx
│   └── StatusAlert.tsx
├── hooks/
│   ├── useApiService.ts
│   ├── useRestConstraint.ts
│   └── useChampionSelection.ts
└── services/
    ├── ApiService.ts
    ├── DataService.ts
    └── NavigationService.ts
```

### 3. Shared Components

#### `RestConstraintBase` Abstract Component
```typescript
abstract class RestConstraintBase {
  protected constraintNumber: number;
  protected title: string;
  protected description: string;
  
  abstract renderContent(): JSX.Element;
  renderBreadcrumbs(): JSX.Element;
  renderHeader(): JSX.Element;
  renderNextStep(): JSX.Element;
}
```

#### `ApiButton` Reusable Component
```typescript
interface ApiButtonProps {
  onFetch: () => Promise<void>;
  loading: boolean;
  dataMode: 'demo' | 'live';
  buttonText: string;
  className: string;
}
```

#### `ChampionSelector` Component
```typescript
interface ChampionSelectorProps {
  selectedChampion: Champion | null;
  onSelect: (champion: Champion) => void;
  selectionSource: 'table' | 'dropdown' | null;
  champions: Champion[];
}
```

### 4. Custom Hooks

#### `useRestConstraint` Hook
```typescript
function useRestConstraint(constraintId: string) {
  const [loading, setLoading] = useState(false);
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  return { loading, dataMode, lastUpdated, setDataMode, resetToDemo };
}
```

#### `useChampionSelection` Hook
```typescript
function useChampionSelection() {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [selectionSource, setSelectionSource] = useState<'table' | 'dropdown' | null>(null);
  
  return { selectedChampion, selectionSource, selectFromTable, selectFromDropdown };
}
```

### 5. File Structure

```
src/
├── components/
│   ├── RestConstraints/
│   │   ├── index.ts
│   │   ├── UniformInterface/
│   │   │   ├── UniformInterface.tsx
│   │   │   ├── ContestsTable.tsx
│   │   │   └── YearSelector.tsx
│   │   ├── ClientServer/
│   │   │   ├── ClientServer.tsx
│   │   │   ├── SummonersTable.tsx
│   │   │   └── ChampionSelector.tsx
│   │   └── [other constraints...]
│   ├── shared/
│   │   ├── RestConstraintBase.tsx
│   │   ├── ApiButton.tsx
│   │   ├── DataTable.tsx
│   │   ├── StatusAlert.tsx
│   │   └── NextStepContainer.tsx
├── hooks/
│   ├── useApiService.ts
│   ├── useRestConstraint.ts
│   └── useChampionSelection.ts
├── services/
│   ├── ApiService.ts
│   ├── DataService.ts
│   └── types.ts
└── data/
    ├── champions.ts
    └── tournamentData.ts
```

### 6. Implementation Strategy

#### Phase 1: Extract Services
1. Create `ApiService` class
2. Create `DataService` for tournament data
3. Move all API logic out of component

#### Phase 2: Create Base Components
1. Build `RestConstraintBase` abstract component
2. Create shared components (`ApiButton`, `DataTable`, etc.)
3. Develop custom hooks

#### Phase 3: Split REST Constraints
1. Extract `UniformInterface` component
2. Extract `ClientServer` component
3. Continue with remaining constraints

#### Phase 4: Optimize & Test
1. Add unit tests for services and hooks
2. Optimize bundle size with code splitting
3. Add error boundaries

### 7. Benefits

- **Maintainability**: Each constraint in separate file (~100 lines)
- **Reusability**: Shared components across constraints
- **Testability**: Services and hooks easily unit tested
- **Performance**: Code splitting reduces initial bundle
- **Scalability**: Easy to add new REST constraints
- **Type Safety**: Proper interfaces and abstractions

### 8. Migration Path

1. **Week 1**: Extract services and create base components
2. **Week 2**: Migrate first 3 REST constraints
3. **Week 3**: Migrate remaining constraints and optimize
4. **Week 4**: Add tests and documentation

This refactoring reduces the main component from 1,500+ lines to ~200 lines while improving code quality and maintainability.