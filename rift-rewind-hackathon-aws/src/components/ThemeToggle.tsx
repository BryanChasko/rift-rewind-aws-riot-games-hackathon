import React from 'react';
import { ButtonDropdown } from '@cloudscape-design/components';
import type { Theme } from '../utils/theme';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <ButtonDropdown
      items={[
        { id: 'light', text: '☀️ Light mode', disabled: currentTheme === 'light' },
        { id: 'dark', text: '🌙 Dark mode', disabled: currentTheme === 'dark' }
      ]}
      onItemClick={({ detail }) => onThemeChange(detail.id as Theme)}
      variant="icon"
      ariaLabel="Theme selector"
    >
      {currentTheme === 'dark' ? '🌙' : '☀️'}
    </ButtonDropdown>
  );
};
