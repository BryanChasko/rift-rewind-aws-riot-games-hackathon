import React from 'react';
import { Select } from '@cloudscape-design/components';
import { announceToScreenReader } from '../../utils/accessibility';

interface ChampionSelectorProps {
  selectedChampion: { label: string; value: string } | null;
  onSelect: (champion: { label: string; value: string }) => void;
  champions: { label: string; value: string }[];
  placeholder?: string;
}

export const ChampionSelector: React.FC<ChampionSelectorProps> = ({
  selectedChampion,
  onSelect,
  champions,
  placeholder = "Choose a champion"
}) => {
  const handleSelection = (champion: { label: string; value: string }) => {
    onSelect(champion);
    announceToScreenReader(`Selected champion: ${champion.label}`);
  };
  const options = champions;

  return (
    <Select
      selectedOption={selectedChampion}
      onChange={({ detail }) => handleSelection(detail.selectedOption as { label: string; value: string })}
      options={options}
      placeholder={placeholder}
      ariaLabel="Select a champion from the list"
      filteringAriaLabel="Filter champions"
    />
  );
};