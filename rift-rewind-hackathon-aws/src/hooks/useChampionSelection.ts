import { useState } from 'react';

export function useChampionSelection() {
  const [selectedChampion, setSelectedChampion] = useState<{ label: string; value: string } | null>(null);
  const [selectionSource, setSelectionSource] = useState<'table' | 'dropdown' | null>(null);

  const selectFromTable = (champion: { label: string; value: string }) => {
    setSelectedChampion(champion);
    setSelectionSource('table');
  };

  const selectFromDropdown = (champion: { label: string; value: string }) => {
    setSelectedChampion(champion);
    setSelectionSource('dropdown');
  };

  const clearSelection = () => {
    setSelectedChampion(null);
    setSelectionSource(null);
  };

  return { 
    selectedChampion, 
    selectionSource, 
    selectFromTable, 
    selectFromDropdown,
    clearSelection
  };
}