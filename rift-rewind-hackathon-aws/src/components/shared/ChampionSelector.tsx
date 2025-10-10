import React from 'react';
import { Select } from '@cloudscape-design/components';
import type { TournamentWinner } from '../../services/types';

interface ChampionSelectorProps {
  selectedChampion: { label: string; value: string } | null;
  onSelect: (champion: { label: string; value: string }) => void;
  champions: TournamentWinner[];
  placeholder?: string;
}

export const ChampionSelector: React.FC<ChampionSelectorProps> = ({
  selectedChampion,
  onSelect,
  champions,
  placeholder = "Choose a champion"
}) => {
  const options = champions.map(champion => ({
    label: champion.championPlayed,
    value: champion.championPlayed.toLowerCase()
  }));

  return (
    <Select
      selectedOption={selectedChampion}
      onChange={({ detail }) => onSelect(detail.selectedOption as { label: string; value: string })}
      options={options}
      placeholder={placeholder}
    />
  );
};